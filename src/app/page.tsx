'use client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { CheckCircle, Cloud, Cpu, Mic, Sprout } from 'lucide-react';
import { TeamMemberCard } from '@/components/landing/team-member-card';
import { LandingHeader } from '@/components/landing/header';
import { LandingFooter } from '@/components/landing/footer';
import { AnimatedNumber } from '@/components/landing/animated-number';
import { IconCard } from '@/components/landing/icon-card';

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

export default function LandingPage() {
    return (
        <div className="bg-background/80 text-foreground font-body">
            <LandingHeader />

            <main>
                {/* Hero Section */}
                <section id="home" className="relative h-[80vh] min-h-[600px] flex items-center justify-center text-center text-white px-4">
                    <div className="relative z-10 space-y-4">
                        <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter">
                            From Guesswork to Guidance
                        </h1>
                        <p className="text-2xl md:text-3xl font-light font-headline text-white/80">
                            Real-Time Soil Wisdom for Every Farmer.
                        </p>
                        <p className="max-w-3xl mx-auto text-base md:text-lg text-white/70">
                            Bhumicare replaces outdated reports with simple, actionable advice, helping farmers increase yields, save resources, and secure their future.
                        </p>
                        <div className="pt-4">
                            <Button size="lg" asChild>
                                <a href="/register">Get Started</a>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* The Problem Section */}
                <section id="problem" className="py-20 px-4">
                    <div className="container mx-auto text-center max-w-4xl space-y-4">
                        <h2 className="text-3xl md:text-4xl font-headline font-bold">The Challenge Facing Indian Agriculture</h2>
                        <p className="text-lg text-muted-foreground">
                            Today, both farmers and the government face the same big problem: wrong or missing soil data. This leads to wasted resources and uncertainty.
                        </p>
                        <div className="grid md:grid-cols-3 gap-6 pt-8 text-left">
                            <Card className="p-6">
                                <h3 className="font-bold text-lg font-headline mb-2">Guesswork for Farmers</h3>
                                <p className="text-sm text-muted-foreground">Farmers guess when to water or add fertilizer because soil test reports are rare, slow to arrive, and hard to understand.</p>
                            </Card>
                            <Card className="p-6">
                                <h3 className="font-bold text-lg font-headline mb-2">Outdated Government Data</h3>
                                <p className="text-sm text-muted-foreground">Official surveys are costly, infrequent, and quickly become obsolete, making it impossible to plan subsidies or policies effectively.</p>
                            </Card>
                             <Card className="p-6">
                                <h3 className="font-bold text-lg font-headline mb-2">Economic & Environmental Risk</h3>
                                <p className="text-sm text-muted-foreground">Farmers can't prove land quality for loans, water is wasted, and erratic weather makes farming more precarious than ever.</p>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* The Solution Section */}
                <section id="solution" className="py-20 px-4 bg-primary/5">
                     <div className="container mx-auto text-center max-w-6xl space-y-4">
                        <h2 className="text-3xl md:text-4xl font-headline font-bold">This is Where Bhumicare Makes the Difference</h2>
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                            Our integrated system of hardware and AI provides a complete, modern solution to an age-old problem.
                        </p>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
                           {solutions.map((solution, i) => (
                               <IconCard key={i} {...solution} />
                           ))}
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section id="how-it-works" className="py-20 px-4">
                    <div className="container mx-auto text-center max-w-5xl space-y-12">
                        <div className="space-y-2">
                            <h2 className="text-3xl md:text-4xl font-headline font-bold">Simple Technology, Powerful Results</h2>
                            <p className="text-lg text-muted-foreground">A seamless 4-step process from soil to solution.</p>
                        </div>
                        <div className="grid md:grid-cols-4 gap-8 relative">
                           {/* Dashed Lines */}
                           <div className="hidden md:block absolute top-1/2 left-0 w-full h-px -translate-y-16">
                               <svg width="100%" height="2" className="text-border">
                                   <line x1="0" y1="1" x2="100%" y2="1" stroke="currentColor" strokeWidth="2" strokeDasharray="8 8" />
                               </svg>
                           </div>

                            <div className="flex flex-col items-center text-center relative z-10">
                                <div className="bg-card border-2 border-primary rounded-full h-24 w-24 flex items-center justify-center mb-4"><Cpu className="h-10 w-10 text-primary" /></div>
                                <h3 className="font-bold font-headline text-lg">1. Sense</h3>
                                <p className="text-sm text-muted-foreground">Our IoT device continuously measures NPK, pH, moisture, and temperature in the soil.</p>
                            </div>
                            <div className="flex flex-col items-center text-center relative z-10">
                                <div className="bg-card border-2 border-primary rounded-full h-24 w-24 flex items-center justify-center mb-4"><Cloud className="h-10 w-10 text-primary" /></div>
                                <h3 className="font-bold font-headline text-lg">2. Sync</h3>
                                <p className="text-sm text-muted-foreground">Data is sent to the cloud via Wi-Fi, LoRa, or 5G, with offline caching for reliability.</p>
                            </div>
                            <div className="flex flex-col items-center text-center relative z-10">
                                <div className="bg-card border-2 border-primary rounded-full h-24 w-24 flex items-center justify-center mb-4"><Image src="/brain-icon.svg" alt="Analyze" width={44} height={44} /></div>
                                <h3 className="font-bold font-headline text-lg">3. Analyze</h3>
                                <p className="text-sm text-muted-foreground">Our AI advisor combines soil, crop, and weather data to generate insights.</p>
                            </div>
                            <div className="flex flex-col items-center text-center relative z-10">
                                <div className="bg-card border-2 border-primary rounded-full h-24 w-24 flex items-center justify-center mb-4"><Mic className="h-10 w-10 text-primary" /></div>
                                <h3 className="font-bold font-headline text-lg">4. Advise</h3>
                                <p className="text-sm text-muted-foreground">Receive simple, voice-first advice in your own language directly on the app.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* The Impact Section */}
                <section id="impact" className="py-20 px-4 bg-primary/5">
                    <div className="container mx-auto text-center max-w-5xl space-y-12">
                         <div className="space-y-2">
                            <h2 className="text-3xl md:text-4xl font-headline font-bold">Grow More. Spend Less. Protect the Future.</h2>
                            <p className="text-lg text-muted-foreground">Bhumicare delivers tangible, data-driven results that empower farmers and strengthen the agricultural ecosystem.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            <Card className="p-8 text-center">
                                <AnimatedNumber value={30} className="text-6xl font-bold font-headline text-primary" />
                                <p className="text-xl font-semibold mt-2">Crop Yield Increase</p>
                            </Card>
                             <Card className="p-8 text-center">
                                <AnimatedNumber value={30} className="text-6xl font-bold font-headline text-primary" prefix="-" />
                                <p className="text-xl font-semibold mt-2">Fertilizer Costs</p>
                            </Card>
                             <Card className="p-8 text-center">
                                <AnimatedNumber value={40} className="text-6xl font-bold font-headline text-primary" prefix="-" />
                                <p className="text-xl font-semibold mt-2">Water Usage</p>
                            </Card>
                        </div>
                        <p className="text-md text-muted-foreground pt-4">
                            The device pays for itself in one season and is fully aligned with India's Digital Agriculture Mission.
                        </p>
                    </div>
                </section>
                
                 {/* Team & Mentors Section */}
                <section id="team" className="py-20 px-4">
                    <div className="container mx-auto text-center max-w-6xl space-y-12">
                        <h2 className="text-3xl md:text-4xl font-headline font-bold">Our Team & Mentors</h2>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {teamMembers.map(member => <TeamMemberCard key={member.name} {...member} />)}
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 pt-8 text-left">
                            <Card className="p-6">
                                <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                                    "Bhumicare's ground-level data is the missing piece in precision agriculture. It has the potential to revolutionize how we manage soil health at scale."
                                </blockquote>
                                <p className="mt-4 font-semibold font-headline">— Agricultural Scientist</p>
                            </Card>
                            <Card className="p-6">
                                 <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                                    "A brilliant application of IoT and AI to solve a real-world problem for millions. This is the future of sustainable farming."
                                </blockquote>
                                <p className="mt-4 font-semibold font-headline">— Startup Mentor</p>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Field Validation & Supporters Section */}
                <section className="py-20 px-4 bg-primary/5">
                    <div className="container mx-auto text-center max-w-6xl space-y-8">
                        <h2 className="text-3xl md:text-4xl font-headline font-bold">Field Validation & Supporters</h2>
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
                </section>
            </main>
            
            <LandingFooter />
        </div>
    );
}
