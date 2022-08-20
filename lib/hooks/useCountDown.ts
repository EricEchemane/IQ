import { useCallback } from 'react';
import { useEffect } from 'react';
import React, { useState } from 'react';

const validateCount = (count: number) => {
    if (count < 0) {
        throw new Error('Count must be greater than 0');
    }
};

let interval: any;
let clearCountdown = () => clearInterval(interval);
let _seconds: number;

export default function useCountDown(props: {
    onCountDownEnd: Function;
    seconds: number;
}) {
    const [started, setStarted] = useState(false);
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        _seconds = props.seconds;
        validateCount(props.seconds);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [count, setCount] = useState<number>(props.seconds);

    useEffect(() => {
        if (count === 0) {
            clearCountdown();
            props.onCountDownEnd();
            setFinished(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [count]);

    const start = useCallback((seconds: number = props.seconds) => {
        setCount(seconds);
        setStarted(true);
        interval = setInterval(() => {
            setCount(c => c - 1);
        }, 1000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { start, currentCount: count, started, finished };
}
