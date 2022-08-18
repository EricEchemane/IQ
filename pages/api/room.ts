import { Server, Socket } from "socket.io";
import type { NextApiRequest, NextApiResponse } from 'next';
import messageHandler from "lib/socket/messageHandler";

export type SocketRes = NextApiResponse & {
    socket: {
        server: any;
    };
};

export default function SocketHandler(req: NextApiRequest, res: SocketRes) {
    // It means that socket server was already initialised
    if (res.socket.server.io) {
        res.end();
        return;
    }

    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    const onConnection = (socket: Socket) => {
        messageHandler(io, socket);
    };

    // Define actions inside
    io.on("connection", onConnection);

    console.log("Setting up socket");
    res.end();
}