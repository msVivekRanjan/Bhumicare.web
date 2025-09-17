'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BhumicareLogo } from '@/components/icons';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from '../layout/theme-toggle';
import { LanguageSwitcher } from '../layout/language-switcher';
import { useTranslation } from '@/hooks/use-translation';

export function LandingHeader() {
    const { t } = useTranslation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

     useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isMenuOpen]);

    const navLinks = [
        { href: '#solution', label: t('solution') },
        { href: '#impact', label: t('impact') },
        { href: '#team', label: t('team') },
    ];
    
    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        const href = e.currentTarget.href;
        const targetId = href.replace(/.*#/, "");
        const elem = document.getElementById(targetId);
        elem?.scrollIntoView({
            behavior: "smooth",
        });
        setIsMenuOpen(false);
    };

    const menuVariants = {
        closed: { opacity: 0, y: "-100%" },
        open: { opacity: 1, y: "0%" }
    };
    
    const navLinkVariants = {
      hidden: { opacity: 0, y: -20 },
      visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
          delay: i * 0.1 + 0.3,
          ease: 'easeOut'
        }
      })
    };


    return (
        <>
            <motion.header 
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-colors duration-300",
                    isScrolled ? "bg-background/80 border-b border-white/10 backdrop-blur-lg" : "bg-transparent"
                )}
            >
                <div className="container mx-auto flex items-center justify-between h-20 px-6 max-w-7xl">
                    <Link href="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                        <BhumicareLogo className="w-8 h-8 text-primary" />
                        <span className="text-xl font-semibold tracking-tighter">Bhumicare</span>
                    </Link>
                    
                    <nav className="hidden lg:flex items-center gap-8">
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
                    
                    <div className="hidden lg:flex items-center gap-2">
                        <LanguageSwitcher />
                        <ThemeToggle />
                        <Button variant="ghost" asChild>
                            <Link href="/login">{t('login')}</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/register">{t('get_started')}</Link>
                        </Button>
                    </div>

                    <div className="lg:hidden">
                        <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(true)}>
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </div>
                </div>
            </motion.header>

            <AnimatePresence>
                {isMenuOpen && (
                     <motion.div
                        variants={menuVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl h-screen w-screen"
                    >
                        <div className="container mx-auto px-6 h-full flex flex-col">
                            <div className="flex items-center justify-between h-20">
                                <Link href="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                                    <BhumicareLogo className="w-8 h-8 text-primary" />
                                    <span className="text-xl font-semibold">Bhumicare</span>
                                </Link>
                                <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                                    <X className="h-6 w-6" />
                                    <span className="sr-only">Close menu</span>
                                </Button>
                            </div>
                            <nav className="flex flex-col items-center justify-center text-center gap-8 flex-1 -mt-20">
                                {navLinks.map((link, i) => (
                                     <motion.a 
                                        key={link.href} 
                                        href={link.href} 
                                        onClick={handleScroll}
                                        className="text-3xl font-medium text-foreground transition-colors hover:text-primary"
                                        custom={i}
                                        variants={navLinkVariants}
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        {link.label}
                                    </motion.a>
                                ))}
                                 <motion.div 
                                    className="flex flex-col gap-4 pt-8 w-full max-w-xs"
                                    initial={{opacity: 0, y: 20}}
                                    animate={{opacity: 1, y: 0}}
                                    transition={{delay: 0.6, ease: 'easeOut'}}
                                >
                                    <div className="flex justify-center gap-4">
                                        <LanguageSwitcher />
                                        <ThemeToggle />
                                    </div>
                                    <Button variant="outline" size="lg" asChild>
                                        <Link href="/login" onClick={() => setIsMenuOpen(false)}>{t('login')}</Link>
                                    </Button>
                                    <Button size="lg" asChild>
                                        <Link href="/register" onClick={() => setIsMenuOpen(false)}>{t('get_started')}</Link>
                                    </Button>
                                </motion.div>
                            </nav>
                        </div>
                     </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
