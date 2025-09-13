'use client';

import { useEffect, useState } from 'react';

interface AnimatedNumberProps {
    value: number;
    className?: string;
    prefix?: string;
}

export function AnimatedNumber({ value, className, prefix = '+' }: AnimatedNumberProps) {
    const [currentValue, setCurrentValue] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = value;
        if (start === end) return;
        
        const duration = 1500;
        const incrementTime = (duration / end);

        const timer = setInterval(() => {
            start += 1;
            setCurrentValue(start);
            if (start === end) {
                clearInterval(timer);
            }
        }, incrementTime);

        return () => clearInterval(timer);
    }, [value]);

    return (
        <span className={className}>
            {prefix}{currentValue}%
        </span>
    );
}
