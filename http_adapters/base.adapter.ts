export default class HttpAdapter {
    url: string;
    body: any;
    method: string;
    headers: any;

    constructor(params: {
        url: string;
        body: any;
        method: string;
        headers?: any;
        stringiyfyBody?: true;
    }) {
        this.url = params.url;
        this.method = params.method;
        this.headers = params.headers;

        if (params.stringiyfyBody) {
            this.body = JSON.stringify(params.body);
        }
        else this.body = params.body;
    }
}