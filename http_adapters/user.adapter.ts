import HttpAdapter from "./base.adapter";

export default class UserAdapter {

    static login = (payload: { email: string; }) => {
        return new HttpAdapter({
            url: "/api/user/login",
            payload,
            method: "POST",
        });
    };
}