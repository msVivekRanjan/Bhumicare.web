'use client';

import { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';
import { useRef } from 'react';

interface AnimatedNumberProps {
    value: number;
    className?: string;
    prefix?: string;
    postfix?: string;
}

export function AnimatedNumber({ value, className, prefix = '', postfix = '%' }: AnimatedNumberProps) {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest));
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
        if (isInView) {
            const controls = animate(count, value, { 
                duration: 2, 
                ease: 'easeOut' 
            });
            return controls.stop;
        }
    }, [isInView, value, count]);

    return (
        <span ref={ref} className={className}>
            {prefix}<motion.span>{rounded}</motion.span>{postfix}
        </span>
    );
}
