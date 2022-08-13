export default class HttpAdapter {
    url: string;
    payload: any;
    method: string;
    headers: any;

    constructor(params: {
        url: string;
        payload: any;
        method: string;
        headers?: any;
        stringiyfyPayload?: true;
    }) {
        this.url = params.url;
        this.method = params.method;
        this.headers = params.headers;

        if (params.stringiyfyPayload) {
            this.payload = JSON.stringify(params.payload);
        }
        else this.payload = params.payload;
    }
}