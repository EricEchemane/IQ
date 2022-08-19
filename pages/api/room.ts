import { ProfessorEvents, QuizRoom, Room, RoomExceptions, SocketRes, StudentEvents } from 'lib/quiz_room/types';
import { Server, Socket } from "socket.io";
import type { NextApiRequest } from 'next';
import { IUser } from 'entities/user.entity';

const rooms = new Map<string, QuizRoom>();

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

        let _room: string;

        socket.on(ProfessorEvents.join_quiz_room, (user: IUser, room: string, callback: Function) => {
            _room = room;

            if (user.type !== 'professor') {
                callback(RoomExceptions.not_a_professor);
                return;
            }

            if (rooms.has(room)) {
                callback(RoomExceptions.room_already_exists);
                return;
            }
            else {
                const quizRoom = new QuizRoom(socket.id);
                rooms.set(room, quizRoom);
                socket.join(room);
                callback(Room.joined);
            }

        });

        socket.on(StudentEvents.student_join_quiz_room, (user: IUser, room: string, callback: Function) => {
            const quizRoom = rooms.get(room);
            if (!quizRoom) {
                callback(RoomExceptions.room_not_found);
                return;
            }

            const userIsIn = quizRoom.participants.find(p => p.email === user.email);
            if (!userIsIn) quizRoom.participants.push(user);

            socket.join(room);
            socket.to(room).emit('new-participant', quizRoom.participants);

            callback(quizRoom);
        });

        socket.on('disconnect', () => {
            rooms.delete(_room);
        });
    });

    res.end();
}