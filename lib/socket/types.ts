import { NextApiResponse } from "next";
import { Socket } from "socket.io-client";

export type SocketRes = NextApiResponse & {
    socket: {
        server: any;
    };
};

export interface ServerEvents {

}

export interface ClientEvents {
    "quizRoom:join": () => void;
}

export type ClientSocket = Socket<ServerEvents, ClientEvents>;