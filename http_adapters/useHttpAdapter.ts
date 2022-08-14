import { useCallback, useState } from "react";
import HttpAdapter from "./base.adapter";
import { RequestError, SuccessfulRequest } from "./response_normalizer";

export default function useHttpAdapter<PayloadType>(adapter: HttpAdapter) {

    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<any>();
    const [error, setError] = useState<RequestError | null>();
    const [data, setData] = useState<any | null>();

    const execute = useCallback(async (payload: PayloadType) => {
        setLoading(true);
        setError(null);
        setResponse(null);
        setData(null);
        try {
            const response = await fetch(adapter.url, {
                ...adapter,
                body: JSON.stringify(payload)
            });
            setResponse(response);

            if (response.ok) {
                const data = await response.json();
                setData(data.data);
            }
            else {
                const error = await response.json();
                setError(error);
            }
        } catch (error: any) {
            setError(new RequestError(500, error.message));
        } finally {
            setLoading(false);
        }
    }, [adapter]);

    return {
        loading, data, error, response, execute
    };
}
