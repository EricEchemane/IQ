import { ProfessorEvents, Room, RoomExceptions, SocketRes } from 'lib/quiz_room/types';
import { Server, Socket } from "socket.io";
import type { NextApiRequest } from 'next';
import { IUser } from 'entities/user.entity';

export default function SocketHandler(req: NextApiRequest, res: SocketRes) {
    // It means that socket server was already initialised
    if (res.socket.server.io) {
        res.end();
        return;
    }

    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    // Define actions inside
    io.on("connection", (socket: Socket) => {
        console.log(socket.id, 'joined');

        socket.on(ProfessorEvents.join_quiz_room, (user: IUser, room: string, callback: Function) => {
            if (user.type !== 'professor') {
                callback(RoomExceptions.not_a_professor);
                return;
            }
            socket.join(room);
            callback(Room.joined);
        });

        socket.on('disconnect', () => {
            console.log(socket.id, 'is disconnected');
        });
    });


    console.log("Setting up socket");
    res.end();
}