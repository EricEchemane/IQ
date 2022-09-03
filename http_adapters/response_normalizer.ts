import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

export class RequestError {
    success = false;
    code: number;
    message: string;
    constructor(code: number, message: string) {
        this.message = message;
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
    handler: Function,
    options: { protect: boolean; } = { protect: true }
) {
    return async function (
        req: NextApiRequest,
        res: NextApiResponse<SuccessfulRequest | RequestError>) {

        const token = await getToken({ req });

        if (options.protect === true && !token) {
            return res.status(401).json(
                new RequestError(401, 'You are not authorized to access this resource')
            );
        }

        try {
            const data = await handler(req, token);
            return res.status(200).json(new SuccessfulRequest(data));
        } catch (error: any) {
            console.error('\n\n==> Error from:', req.url);
            console.error(error.message);

            if (error.message.includes('E11000')) {
                error.message = 'This email is already in use';
            }
            if (error instanceof RequestError) {
                return res.status(error.code).json(error);
            }

            return res.status(500).json(new RequestError(500, error.message));
        }
    };
}