import { IUser } from "entities/user.entity";
import HttpAdapter from "../base.adapter";

export default class UserAdapter {

    static login: HttpAdapter = {
        url: "/api/user/login",
        method: "POST",
    };
    static register: HttpAdapter = {
        url: "/api/user/register",
        method: "POST",
    };
}

export type LoginPayload = {
    email: string;
};
export type RegisterPayload = IUser & {
    adminPasscode: string;
};