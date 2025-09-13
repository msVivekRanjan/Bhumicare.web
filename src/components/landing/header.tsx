'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BhumicareLogo } from '@/components/icons';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/use-translation';

export function LandingHeader() {
    const { t } = useTranslation();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: '#solution', label: 'Solution' },
        { href: '#impact', label: 'Impact' },
        { href: '#team', label: 'Team' },
    ];
    
    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        const href = e.currentTarget.href;
        const targetId = href.replace(/.*#/, "");
        const elem = document.getElementById(targetId);
        elem?.scrollIntoView({
            behavior: "smooth",
        });
    };

    return (
        <header className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
            isScrolled ? "bg-background/80 border-b border-border/20 backdrop-blur-lg" : "bg-transparent"
        )}>
            <div className="container mx-auto flex items-center justify-between h-20 px-4">
                <Link href="/" className="flex items-center gap-2">
                    <BhumicareLogo className="w-8 h-8 text-primary" />
                    <span className="font-headline text-xl font-semibold">{t('bhumicare')}</span>
                </Link>
                
                <nav className="hidden md:flex items-center gap-6">
                    {navLinks.map(link => (
                         <a 
                            key={link.href} 
                            href={link.href} 
                            onClick={handleScroll}
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>
                
                <div className="flex items-center gap-2">
                    <Button variant="ghost" asChild>
                        <Link href="/login">Login</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/register">Get Started</Link>
                    </Button>
                </div>
            </div>
        </header>
    );
}
