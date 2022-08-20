import { joinRoomPayload, QuizRoom } from 'lib/socket/types';
import { Server } from "socket.io";
import type { NextApiRequest } from 'next';
import { createRoomPayload, ServerSocket, SocketRes } from "lib/socket/types";

const quizRooms = new Map<string, QuizRoom>();

/**
 * Map<socketId, {
 *  room: string;
 *  type: 'professor' | 'student';
 * }>
 */
const usersParticipatedQuizRooms = new Map<string, {
    room: string;
    type: 'professor' | 'student';
}>();

export default function SocketHandler(req: NextApiRequest, res: SocketRes) {
    // It means that socket server was already initialised
    if (res.socket.server.io) {
        res.end();
        return;
    }

    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    // Define actions inside
    io.on("connection", (socket: ServerSocket) => {
        console.log(`${socket.id} connnects to server`);

        socket.on('disconnect', () => {
            console.log(`${socket.id} disconnected from the server`);
            const userRoom = usersParticipatedQuizRooms.get(socket.id);
            if (!userRoom) return;

            if (userRoom.type === 'professor') {
                // delete quizRoom
                quizRooms.delete(userRoom.room);
                usersParticipatedQuizRooms.delete(socket.id);
            }
            else {
                quizRooms.get(userRoom.room)?.removeParticipant(socket.id);
                usersParticipatedQuizRooms.delete(socket.id);
            }
        });

        socket.on('create:room', (
            payload: createRoomPayload,
            callback: (err: Error | null, data: QuizRoom | null) => void
        ) => {
            const { room, user, quiz } = payload;
            console.log(`${socket.id} creates a room ${room}`);

            // dont create the room if user is not a professor
            if (user.type !== 'professor') {
                callback(new Error('Only professors can create rooms'), null);
                return;
            }

            let quizRoom = quizRooms.get(room);
            if (!quizRoom) {
                quizRoom = new QuizRoom(room, user, quiz);
                quizRooms.set(room, quizRoom);
            }

            socket.join(room);
            usersParticipatedQuizRooms.set(socket.id, { room, type: 'professor' });
            console.log(`${socket.id} joins the room ${room}`);

            callback(null, quizRoom);
        });

        socket.on('join:room', (
            payload: joinRoomPayload,
            callback: (err: Error | null, data: any) => void
        ) => {
            const { room, user } = payload;

            let quizRoom = quizRooms.get(room);
            if (!quizRoom) {
                callback(new Error('Room does not exist'), null);
                return;
            }
            // dont join the room if user is not a student
            if (user.type !== 'student') {
                callback(new Error('Only students can join rooms'), null);
                return;
            }

            quizRoom.participate(socket.id, user);

            socket.join(room);
            usersParticipatedQuizRooms.set(socket.id, { room, type: 'student' });
            socket.to(room).emit('participant:joined', quizRoom);

            console.log(`${socket.id} joins the room ${room}`);
            callback(null, quizRoom.getParticipant(socket.id));
        });
    });

    res.end();
}