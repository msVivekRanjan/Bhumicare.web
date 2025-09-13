'use client';
import { Button } from '@/components/ui/button';
import { CheckCircle, Cloud, Cpu, Mic, Sprout } from 'lucide-react';
import { TeamMemberCard } from '@/components/landing/team-member-card';
import { LandingHeader } from '@/components/landing/header';
import { LandingFooter } from '@/components/landing/footer';
import { AnimatedNumber } from '@/components/landing/animated-number';
import { IconCard } from '@/components/landing/icon-card';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { HowItWorks } from '@/components/landing/how-it-works';
import { EndorsementCarousel } from '@/components/landing/endorsement-carousel';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const solutions = [
    {
        icon: <Sprout className="h-8 w-8 text-primary" />,
        title: 'Live Soil Health Data',
        description: 'Continuous, real-time data on soil nutrients, pH, and moisture, replacing infrequent and slow lab tests.',
    },
    {
        icon: <Mic className="h-8 w-8 text-primary" />,
        title: 'Voice-First AI Advice',
        description: 'Simple, actionable guidance in regional dialects (Hindi, Odia, English) that farmers can easily understand and act upon.',
    },
    {
        icon: <CheckCircle className="h-8 w-8 text-primary" />,
        title: 'Offline-First Design',
        description: 'The device and app are designed to work reliably even without a stable internet connection, caching data until it can sync.',
    },
    {
        icon: <Image src="/map-icon.svg" alt="Dynamic Map" width={32} height={32} />,
        title: 'Dynamic Soil Fertility Maps',
        description: 'Live, aggregated maps provide a ground-level truth for farmers and policymakers, unlike static government surveys.',
    },
    {
        icon: <CheckCircle className="h-8 w-8 text-primary" />,
        title: 'Affordable & Accessible',
        description: 'A low-cost IoT device paired with a simple subscription model, ensuring the technology is within reach for all farmers.',
    }
];

const teamMembers = [
    { name: 'Raj Sahashranshu Biswal', avatarUrl: 'https://picsum.photos/seed/dev1/100/100', role: 'Full Stack & AI' },
    { name: 'Vivek Ranjan Sahoo', avatarUrl: 'https://picsum.photos/seed/dev2/100/100', role: 'Hardware & IoT' },
    { name: 'Ayush Ranjan Pradhan', avatarUrl: 'https://picsum.photos/seed/dev3/100/100', role: 'UI/UX & Frontend' },
    { name: 'Subasis Mishra', avatarUrl: 'https://picsum.photos/seed/dev4/100/100', role: 'Product & Marketing' },
];

const Section = ({ children, className, id }: { children: React.ReactNode, className?: string, id: string }) => (
    <motion.section
        id={id}
        className={cn("py-16 md:py-24", className)}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
        <div className="container mx-auto max-w-7xl px-6">
            {children}
        </div>
    </motion.section>
);


export default function LandingPage() {
    return (
        <div className="bg-background text-foreground font-sans">
            <LandingHeader />

            <main className="overflow-x-hidden">
                {/* Hero Section */}
                <section id="home" className="relative h-screen flex items-center justify-center text-center px-4 overflow-hidden">
                     <div className="absolute inset-0 bg-aurora z-0" />
                     <div className="absolute inset-0 bg-background/50 z-0" />

                    <div className="relative z-10 space-y-6 max-w-4xl text-center flex flex-col items-center">
                         <motion.h1 
                            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: 'easeInOut' }}
                        >
                            From Guesswork to Guidance
                        </motion.h1>
                        <motion.p 
                            className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto"
                             initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: 'easeInOut' }}
                        >
                            Real-Time Soil Wisdom for Every Farmer. Bhumicare replaces outdated reports with simple, actionable advice, helping farmers increase yields, save resources, and secure their future.
                        </motion.p>
                        <motion.div 
                            className="pt-4"
                             initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4, ease: 'easeInOut' }}
                        >
                            <Button size="lg" asChild>
                                <Link href="/register">Get Started</Link>
                            </Button>
                        </motion.div>
                    </div>
                </section>

                {/* The Problem Section */}
                <Section id="problem">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-4 text-center lg:text-left">
                            <h2 className="text-3xl md:text-4xl font-semibold">The Challenge Facing Indian Agriculture</h2>
                            <p className="text-lg text-muted-foreground">
                                Today, both farmers and the government face the same big problem: wrong or missing soil data. This leads to wasted resources and uncertainty.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <IconCard
                                title="Guesswork for Farmers"
                                description="Farmers guess when to water or add fertilizer because soil test reports are rare, slow to arrive, and hard to understand."
                            />
                            <IconCard
                                title="Outdated Government Data"
                                description="Official surveys are costly, infrequent, and quickly become obsolete, making it impossible to plan subsidies or policies effectively."
                            />
                        </div>
                    </div>
                </Section>

                {/* The Solution Section */}
                <Section id="solution" className="bg-foreground/5">
                    <div className="text-center max-w-4xl mx-auto space-y-4">
                        <h2 className="text-3xl md:text-4xl font-semibold">This is Where Bhumicare Makes the Difference</h2>
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                            Our integrated system of hardware and AI provides a complete, modern solution to an age-old problem.
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-12">
                       {solutions.map((solution, i) => (
                           <IconCard key={i} {...solution} />
                       ))}
                    </div>
                </Section>

                {/* How It Works Section */}
                <HowItWorks />

                {/* The Impact Section */}
                <Section id="impact">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-4xl font-semibold">Grow More. Spend Less. Protect the Future.</h2>
                            <p className="text-lg text-muted-foreground">Bhumicare delivers tangible, data-driven results that empower farmers and strengthen the agricultural ecosystem.</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-8">
                                <IconCard
                                    icon={<Cpu className="h-8 w-8 text-secondary" />}
                                    title="Validated & Ready"
                                    description="Technology Readiness Level: TRL 4"
                                />
                                <IconCard
                                     icon={<Image src="/ashoka.svg" alt="Ashoka" width={32} height={32} />}
                                    title="National Alignment"
                                    description="Supports Digital Agriculture Mission, PM-KISAN, and more."
                                />
                                 <IconCard
                                    icon={<div className="grid grid-cols-2 gap-1">
                                        <Image src="/sdg-2.svg" alt="SDG 2" width={32} height={32} />
                                        <Image src="/sdg-6.svg" alt="SDG 6" width={32} height={32} />
                                        <Image src="/sdg-12.svg" alt="SDG 12" width={32} height={32} />
                                        <Image src="/sdg-13.svg" alt="SDG 13" width={32} height={32} />
                                    </div>}
                                    title="SDG Contribution"
                                    description="Aiding global goals for hunger, water, and climate."
                                />
                            </div>
                        </div>
                         <div className="grid grid-cols-1 gap-8">
                            <div className="glass-card p-8 text-center rounded-2xl">
                                <AnimatedNumber value={30} className="text-6xl md:text-7xl font-bold text-primary" prefix="+" />
                                <p className="text-xl font-semibold mt-2">Crop Yield Increase</p>
                            </div>
                             <div className="glass-card p-8 text-center rounded-2xl">
                                <AnimatedNumber value={30} className="text-6xl md:text-7xl font-bold text-primary" prefix="-" />
                                <p className="text-xl font-semibold mt-2">Fertilizer Costs</p>
                            </div>
                             <div className="glass-card p-8 text-center rounded-2xl">
                                <AnimatedNumber value={40} className="text-6xl md:text-7xl font-bold text-primary" prefix="-" />
                                <p className="text-xl font-semibold mt-2">Water Usage</p>
                            </div>
                        </div>
                    </div>
                </Section>
                
                 {/* Team & Mentors Section */}
                <Section id="team" className="bg-foreground/5">
                    <div className="text-center max-w-4xl mx-auto space-y-12">
                        <h2 className="text-3xl md:text-4xl font-semibold">Our Team & Mentors</h2>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {teamMembers.map(member => <TeamMemberCard key={member.name} {...member} />)}
                        </div>

                        <EndorsementCarousel />
                    </div>
                </Section>

                {/* Field Validation & Supporters Section */}
                <Section id="supporters">
                     <div className="text-center max-w-4xl mx-auto space-y-8">
                        <h2 className="text-3xl md:text-4xl font-semibold">Field Validation & Supporters</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Image src="https://picsum.photos/seed/field1/400/400" alt="Field test 1" width={400} height={400} className="rounded-lg shadow-md" />
                            <Image src="https://picsum.photos/seed/field2/400/400" alt="Field test 2" width={400} height={400} className="rounded-lg shadow-md" />
                            <Image src="https://picsum.photos/seed/field3/400/400" alt="Field test 3" width={400} height={400} className="rounded-lg shadow-md" />
                            <Image src="https://picsum.photos/seed/field4/400/400" alt="Field test 4" width={400} height={400} className="rounded-lg shadow-md" />
                        </div>
                        <div className="pt-8">
                            <p className="text-lg text-muted-foreground">Proudly Supported and Incubated by</p>
                            <div className="mt-4 flex justify-center items-center">
                               <Image src="/aic-soa-logo.png" alt="AIC SOA Foundation" width={200} height={80} />
                            </div>
                        </div>
                    </div>
                </Section>
            </main>
            
            <LandingFooter />
        </div>
    );
}
