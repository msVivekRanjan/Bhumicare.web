'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Cpu, Cloud, BrainCircuit, MicVocal } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
    {
        icon: Cpu,
        title: '1. Sense',
        description: 'Our IoT device continuously measures NPK, pH, moisture, and temperature in the soil.',
    },
    {
        icon: Cloud,
        title: '2. Sync',
        description: 'Data is sent to the cloud via Wi-Fi, LoRa, or 5G, with offline caching for reliability.',
    },
    {
        icon: BrainCircuit,
        title: '3. Analyze',
        description: 'Our AI advisor combines soil, crop, and weather data to generate insights.',
    },
    {
        icon: MicVocal,
        title: '4. Advise',
        description: 'Receive simple, voice-first advice in your own language directly on the app.',
    },
];

export const HowItWorks = () => {
    const targetRef = useRef<HTMLDivElement | null>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ['start end', 'end start'],
    });

    return (
        <section ref={targetRef} id="how-it-works" className="py-16 md:py-24 bg-foreground/5">
            <div className="container mx-auto max-w-7xl px-6">
                <div className="text-center max-w-4xl mx-auto space-y-4 mb-12">
                    <motion.h2 
                        className="text-3xl md:text-4xl font-semibold"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.8 }}
                    >
                        Simple Technology, Powerful Results
                    </motion.h2>
                    <motion.p 
                        className="text-lg text-muted-foreground"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        A seamless 4-step process from soil to solution.
                    </motion.p>
                </div>
                <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-0.5 h-full bg-border" />

                    <div className="space-y-16">
                        {steps.map((step, index) => {
                            const isEven = index % 2 === 0;
                            return (
                                <motion.div
                                    key={step.title}
                                    className={cn(
                                        "flex flex-col md:flex-row items-center gap-8",
                                        !isEven && "md:flex-row-reverse"
                                    )}
                                     initial={{ opacity: 0, y: 50 }}
                                     whileInView={{ opacity: 1, y: 0 }}
                                     viewport={{ once: true, amount: 0.5 }}
                                     transition={{ duration: 0.8 }}
                                >
                                    <div className="flex-1">
                                        <div className="glass-card p-6 md:p-8">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="bg-primary/10 p-3 rounded-full border border-primary/20">
                                                    <step.icon className="h-8 w-8 text-primary" />
                                                </div>
                                                <h3 className="text-2xl font-bold">{step.title}</h3>
                                            </div>
                                            <p className="text-muted-foreground">{step.description}</p>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-primary border-4 border-background ring-4 ring-primary flex-shrink-0 z-10" />
                                    <div className="flex-1 hidden md:block" />
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};
