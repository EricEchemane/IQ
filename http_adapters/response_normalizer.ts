import { BadResponse, OkResponse } from 'lib/response';
import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

export class RequestError {
    success = false;
    code: number;
    error: {
        message: string;
    };
    constructor(code: number, message: string) {
        this.error = {
            message
        };
        this.code = code;
    }
}

export class SuccessfulRequest {
    success = true;
    data: any;
    constructor(data: any) {
        this.data = data;
    }
}

export default function normalize(
    controller: Function,
    options: { protect: boolean; } = { protect: true }
) {
    return async function (req: NextApiRequest, res: NextApiResponse) {
        const token = await getToken({ req });

        if (options.protect === true && !token) {
            return res.status(401).json(
                new RequestError(401, 'You are not authorized to access this resource')
            );
        }

        controller(req, res)
            .then((data: any) => {
                res.status(200).json(new SuccessfulRequest(data));
            })
            .catch((error: any) => {
                if (error instanceof RequestError) {
                    res.status(error.code).json(error);
                }
                else res.status(500).json(new RequestError(500, error.message));
            });
    };
}