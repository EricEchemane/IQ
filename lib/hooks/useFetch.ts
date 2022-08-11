import React from 'react';

interface Options {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: any;
    headers?: any;
}

export default function useFetch(url: string) {
    const [data, setData] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<any>(null);
    const [response, setResponse] = React.useState<any>(null);

    const doFetch = React.useCallback(async (options: Options = {}) => {
        setLoading(true);
        setError(null);
        setData(null);
        setResponse(null);

        const res = await fetch(url, options);
        setResponse(res);

        if (res.ok) {
            const data = await res.json();
            setData(data);
            return data;
        }
        else {
            const error = await res.json();
            setError(error);
        }
        setLoading(false);
    }, [url]);

    return { loading, data, error, response, doFetch };
}
