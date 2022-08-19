import { NextApiResponse } from "next";
import { Socket as SSocket } from "socket.io";
import { Socket as CSocket } from "socket.io-client";

export type SocketRes = NextApiResponse & {
    socket: {
        server: any;
    };
};

export interface ServerEvents {
    "room:join": () => void;
}

export interface ClientEvents {
    "create:room": () => void;
}

export type ClientSocket = CSocket<ServerEvents, ClientEvents>;
export type ServerSocket = SSocket<ClientEvents, ServerEvents>;