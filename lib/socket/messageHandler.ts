import { Server, Socket } from 'socket.io';

export default function messageHandler(io: Server, socket: Socket) {

    socket.on("createdMessage", (msg: any) => {
        socket.broadcast.emit("newIncomingMessage", msg);
    });
};