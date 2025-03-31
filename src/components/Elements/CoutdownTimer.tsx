import { useState, useEffect } from "react";

interface CountdownTimerProps {
    duration?: number;
    onComplete?: () => void;
}

const CountdownTimer = ({ duration = 3 * 60 * 60, onComplete }: CountdownTimerProps) => {
    const [timeLeft, setTimeLeft] = useState<number>(() => {
        const savedTime = localStorage.getItem("timer");
        return savedTime ? Math.max(0, parseInt(savedTime, 10)) : duration;
    });

    useEffect(() => {
        if (timeLeft <= 0) {
            onComplete?.();
            localStorage.removeItem("timer");
            return;
        }

        localStorage.setItem("timer", timeLeft.toString());

        const timer = setInterval(() => {
            setTimeLeft((prev) => Math.max(0, prev - 1));
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, onComplete]);

    const formatTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };

    return <div className="text-lg font-bold text-red-600 border px-3 py-px border-red-500 font-mono">{formatTime(timeLeft)}</div>;
};

export default CountdownTimer;
