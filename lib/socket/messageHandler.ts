import { Server, Socket } from 'socket.io';

export default function messageHandler(io: Server, socket: Socket) {
    const createdMessage = (msg: any) => {
        socket.broadcast.emit("newIncomingMessage", msg);
    };

    socket.on("createdMessage", createdMessage);
};