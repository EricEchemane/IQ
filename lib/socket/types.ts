import { NextApiResponse } from "next";

export type SocketRes = NextApiResponse & {
    socket: {
        server: any;
    };
};

export interface ServerEvents {

}