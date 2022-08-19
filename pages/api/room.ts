import { Server, Socket } from "socket.io";
import type { NextApiRequest } from 'next';
import { SocketRes } from "lib/socket/types";

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
        console.log(`${socket.id} connnects from the server`);

        socket.on('disconnect', () => {
            console.log(`${socket.id} disconnected from the server`);
        });
    });

    res.end();
}