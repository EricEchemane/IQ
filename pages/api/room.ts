import { QuizRoom } from 'lib/socket/types';
import { Server } from "socket.io";
import type { NextApiRequest } from 'next';
import { createRoomPayload, ServerSocket, SocketRes } from "lib/socket/types";

const quizRooms = new Map<string, QuizRoom>();

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
            console.log(`${socket.id} joins the room ${room}`);

            callback(null, quizRoom);
        });
    });

    res.end();
}