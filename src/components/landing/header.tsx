'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BhumicareLogo } from '@/components/icons';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/use-translation';
import { motion, useScroll } from 'framer-motion';

export function LandingHeader() {
    const { t } = useTranslation();
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        return scrollY.on('change', (latest) => {
            setIsScrolled(latest > 50);
        });
    }, [scrollY]);

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
        <motion.header 
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-colors duration-300",
                isScrolled ? "bg-background/80 border-b border-white/10 backdrop-blur-lg" : "bg-transparent"
            )}
            animate={{
                 boxShadow: isScrolled ? '0 5px 15px rgba(0,0,0,0.1)' : '0 0px 0px rgba(0,0,0,0)',
            }}
            transition={{ type: 'tween', duration: 0.3 }}
        >
            <div className="container mx-auto flex items-center justify-between h-20 px-4">
                <Link href="/" className="flex items-center gap-2">
                    <BhumicareLogo className="w-8 h-8 text-primary" />
                    <span className="text-xl font-semibold">{t('bhumicare')}</span>
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
                
                <div className="flex items-center gap-4">
                    <Button variant="ghost" asChild>
                        <Link href="/login">Login</Link>
                    </Button>
                    <motion.div
                        animate={{
                            '--glow-color': ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--primary))'],
                        } as any}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                        className="relative"
                    >
                        <Button asChild className="relative overflow-hidden">
                            <Link href="/register">Get Started</Link>
                        </Button>
                         <motion.div
                            className="absolute inset-0 border-2 border-primary rounded-md "
                            style={{
                                filter: 'blur(4px)',
                                WebkitMaskImage: 'radial-gradient(100% 100% at 50% 50%, black 50%, transparent 100%)',
                                maskImage: 'radial-gradient(100% 100% at 50% 50%, black 50%, transparent 100%)',
                                borderColor: 'var(--glow-color)' as any
                            }}
                        />
                    </motion.div>
                </div>
            </div>
        </motion.header>
    );
}
