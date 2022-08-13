import { useCallback, useState } from "react";
import HttpAdapter from "./base.adapter";

export default function useHttpAdapter(adapter: HttpAdapter) {

    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<any>();
    const [error, setError] = useState<{
        message: string;
        code: number;
    } | null>();
    const [data, setData] = useState<{
        data: any;
        success: boolean;
    } | null>();

    const Fetch = useCallback(async () => {
        setLoading(true);
        setError(null);
        setResponse(null);
        setData(null);
        try {
            const response = await fetch(adapter.url, { ...adapter });
            setResponse(response);
            if (response.ok) {
                const data = await response.json();
                setData(data);
            }
            else {
                setError({
                    message: response.statusText,
                    code: response.status
                });
            }
        } catch (error: any) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }, [adapter]);

    return {
        loading, data, error, response, Fetch
    };
}
