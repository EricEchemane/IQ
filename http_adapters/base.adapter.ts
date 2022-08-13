export default class HttpAdapter {
    url: string;
    payload: any;
    method: string;

    constructor(url: string, payload: any, method: string) {
        this.url = url;
        this.payload = payload;
        this.method = method;
    }
}