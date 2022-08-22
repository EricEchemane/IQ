import { joinRoomPayload, participant } from 'lib/socket/types';
import { Server } from "socket.io";
import type { NextApiRequest } from 'next';
import { createRoomPayload, ServerSocket, SocketRes } from "lib/socket/types";
import { QuizRoom } from 'lib/socket/quizRoom';

const quizRooms = new Map<string, QuizRoom>();

/**
 * Map<socketId, {
 *  room: string;
 *  type: 'professor' | 'student';
 * }>
 */
const usersParticipatedQuizRooms = new Map<string, {
    room: string;
    email: string;
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

            if (userRoom.type === 'student') {
                const quizRoom = quizRooms.get(userRoom.room);
                if (!quizRoom) return;
                quizRoom.removeParticipant(userRoom.email);
                usersParticipatedQuizRooms.delete(socket.id);
                socket.in(userRoom.room).emit('participant:leave', quizRoom);
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
            usersParticipatedQuizRooms.set(socket.id, { room, type: 'professor', email: user.email });
            console.log(`${socket.id} joins the room ${room}`);

            callback(null, quizRoom);
        });

        socket.on('join:room', (payload: joinRoomPayload, callback: (err: any | null, data: any) => void) => {
            const { room, user } = payload;

            let quizRoom = quizRooms.get(room);
            if (!quizRoom) {
                callback('Room does not exist', null);
                return;
            }
            // dont join the room if user is not a student
            if (user.type !== 'student') {
                callback(new Error('Only students can join rooms'), null);
                return;
            }

            quizRoom.participate(socket.id, user);

            socket.join(room);
            usersParticipatedQuizRooms.set(socket.id, { room, type: 'student', email: user.email });
            socket.to(room).emit('participant:joined', quizRoom);

            console.log(`${socket.id} joins the room ${room}`);
            callback(null, {
                quizRoom,
                participant: quizRoom.getParticipant(socket.id)
            });
        });

        socket.on('destroy:room', (
            room: string,
            callback: (err: Error | null, data: any) => void
        ) => {
            const quizRoom = quizRooms.get(room);
            quizRooms.delete(room);
            usersParticipatedQuizRooms.delete(socket.id);
            socket.leave(room);
            socket.to(room).emit('room:destroyed', room);
            callback(null, quizRoom);
        });

        socket.on('start:quiz', (room: string, callback: Function) => {
            const quizRoom = quizRooms.get(room);
            if (!quizRoom) return;

            quizRoom.start();

            socket.to(room).emit('quiz:started', quizRoom);
            callback(null, quizRoom);
        });

        socket.on('quiz:stop', (room: string, callback: Function) => {
            const quizRoom = quizRooms.get(room);
            if (!quizRoom) return;

            quizRoom.stop();

            socket.to(room).emit('quiz:stopped', quizRoom);
            callback(null, quizRoom);
        });

        socket.on('timer:change', (count: number, room: string) => {
            socket.to(room).emit('timer:changed', count);
        });

        socket.on('next:question', (room: string, callback: Function) => {
            const quizRoom = quizRooms.get(room);
            if (!quizRoom) return;

            try {
                quizRoom.next();

                socket.to(room).emit('question:next', quizRoom);
                callback(null, quizRoom);
            } catch (error: any) {
                callback(error.message, null);
            }
        });
    });

    res.end();
}