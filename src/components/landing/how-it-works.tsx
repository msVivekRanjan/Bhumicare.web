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
        offset: ['start start', 'end end'],
    });

    const x = useTransform(scrollYProgress, [0, 1], ["25%", "-100%"]);

    return (
        <section ref={targetRef} id="how-it-works" className="relative h-[400vh] bg-background">
            <div className="sticky top-0 h-screen flex items-center overflow-hidden">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 text-center space-y-2 z-10">
                    <h2 className="text-3xl md:text-5xl font-bold">Simple Technology, Powerful Results</h2>
                    <p className="text-lg text-muted-foreground">A seamless 4-step process from soil to solution.</p>
                </div>
                <motion.div style={{ x }} className="flex gap-16 pl-16">
                    {steps.map((step, index) => (
                        <Card key={step.title} step={step} index={index} scrollYProgress={scrollYProgress} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

interface CardProps {
    step: typeof steps[0];
    index: number;
    scrollYProgress: any;
}

const Card = ({ step, index, scrollYProgress }: CardProps) => {
    const totalSteps = steps.length;
    const start = index / totalSteps;
    const end = start + 1 / totalSteps;
    
    const scale = useTransform(scrollYProgress,
        [start - 0.1, start, end, end + 0.1],
        [0.8, 1, 1, 0.8]
    );
     const opacity = useTransform(scrollYProgress,
        [start - 0.1, start, end, end + 0.1],
        [0.5, 1, 1, 0.5]
    );


    return (
        <motion.div
            style={{ scale, opacity }}
            className={cn(
                "h-[450px] w-[300px] md:h-[500px] md:w-[450px] flex flex-col items-center justify-center p-8 rounded-3xl relative",
                "glass-card"
            )}
        >
            <div className="text-center space-y-4">
                <step.icon className="h-16 w-16 mx-auto text-primary" />
                <h3 className="text-2xl md:text-3xl font-bold">{step.title}</h3>
                <p className="text-base md:text-lg text-muted-foreground">{step.description}</p>
            </div>
        </motion.div>
    );
};

    