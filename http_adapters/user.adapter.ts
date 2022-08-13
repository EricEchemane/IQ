import HttpAdapter from "./base.adapter";

export default class UserAdapter {

    static login: HttpAdapter = {
        url: "/api/user/login",
        method: "POST",
    };
}

export type LoginPayload = {
    email: string;
};