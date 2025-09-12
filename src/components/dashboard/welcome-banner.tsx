'use client';

import { useTranslation } from "@/hooks/use-translation";
import { useState, useEffect } from "react";

interface WelcomeBannerProps {
    name: string;
}

export function WelcomeBanner({ name }: WelcomeBannerProps) {
    const { t } = useTranslation();
    const [date, setDate] = useState('');

    useEffect(() => {
        setDate(new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    }, []);

    return (
        <div className="p-6 rounded-xl bg-primary/80 text-primary-foreground backdrop-blur-sm">
            <h1 className="text-3xl font-bold font-headline">Welcome Back, {name}!</h1>
            {date && <p className="text-primary-foreground/80">{date}</p>}
        </div>
    );
}
