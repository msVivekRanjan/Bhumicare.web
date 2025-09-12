'use client';

import { useTranslation } from "@/hooks/use-translation";

interface WelcomeBannerProps {
    name: string;
}

export function WelcomeBanner({ name }: WelcomeBannerProps) {
    const { t } = useTranslation();
    const date = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="p-6 rounded-xl bg-primary/80 text-primary-foreground backdrop-blur-sm">
            <h1 className="text-3xl font-bold font-headline">Welcome Back, {name}!</h1>
            <p className="text-primary-foreground/80">{date}</p>
        </div>
    );
}
