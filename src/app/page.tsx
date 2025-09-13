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

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: 'easeInOut' },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const wordAnimation = {
    initial: { y: "100%" },
    animate: { y: "0%" },
};

export default function LandingPage() {
    const heroTitle = "From Guesswork to Guidance";

    return (
        <div className="bg-background text-foreground font-sans">
            <LandingHeader />

            <main className="overflow-x-hidden">
                {/* Hero Section */}
                <motion.section 
                    id="home" 
                    className="relative h-screen flex items-center justify-center text-center text-white px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <div className="absolute inset-0 overflow-hidden z-0">
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                            src="https://videos.pexels.com/video-files/3209828/3209828-hd_1920_1080_25fps.mp4"
                        />
                        <div className="absolute inset-0 bg-black/50" />
                    </div>

                    <div className="relative z-10 space-y-6 max-w-4xl">
                        <h1 className="text-4xl md:text-7xl font-bold tracking-tight">
                            {heroTitle.split(" ").map((word, i) => (
                                <span key={i} className="inline-block overflow-hidden pb-2">
                                     <motion.span 
                                        className="inline-block"
                                        variants={wordAnimation}
                                        initial="initial"
                                        animate="animate"
                                        transition={{ delay: 0.2 + i * 0.1, ease: 'easeInOut', duration: 0.8}}
                                    >
                                        {word}&nbsp;
                                    </motion.span>
                                </span>
                            ))}
                        </h1>
                        <motion.p 
                            className="text-lg md:text-xl font-light text-white/80 max-w-3xl mx-auto"
                             {...fadeIn}
                             transition={{ ...fadeIn.transition, delay: 0.8 }}
                        >
                            Real-Time Soil Wisdom for Every Farmer. Bhumicare replaces outdated reports with simple, actionable advice, helping farmers increase yields, save resources, and secure their future.
                        </motion.p>
                        <motion.div 
                            className="pt-4"
                            {...fadeIn}
                            transition={{ ...fadeIn.transition, delay: 1 }}
                        >
                            <Button size="lg" asChild>
                                <a href="/register">Get Started</a>
                            </Button>
                        </motion.div>
                    </div>
                </motion.section>

                {/* The Problem Section */}
                <section id="problem" className="py-24 px-4">
                    <motion.div 
                        className="container mx-auto text-center max-w-4xl space-y-4"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <motion.h2 className="text-3xl md:text-5xl font-bold" variants={fadeIn}>The Challenge Facing Indian Agriculture</motion.h2>
                        <motion.p className="text-lg text-muted-foreground" variants={fadeIn}>
                            Today, both farmers and the government face the same big problem: wrong or missing soil data. This leads to wasted resources and uncertainty.
                        </motion.p>
                        <motion.div 
                            className="grid md:grid-cols-3 gap-6 pt-8 text-left"
                            variants={staggerContainer}
                        >
                            <motion.div className="glass-card p-6 rounded-2xl" variants={fadeIn}>
                                <h3 className="font-bold text-lg mb-2">Guesswork for Farmers</h3>
                                <p className="text-sm text-muted-foreground">Farmers guess when to water or add fertilizer because soil test reports are rare, slow to arrive, and hard to understand.</p>
                            </motion.div>
                            <motion.div className="glass-card p-6 rounded-2xl" variants={fadeIn}>
                                <h3 className="font-bold text-lg mb-2">Outdated Government Data</h3>
                                <p className="text-sm text-muted-foreground">Official surveys are costly, infrequent, and quickly become obsolete, making it impossible to plan subsidies or policies effectively.</p>
                            </motion.div>
                             <motion.div className="glass-card p-6 rounded-2xl" variants={fadeIn}>
                                <h3 className="font-bold text-lg mb-2">Economic & Environmental Risk</h3>
                                <p className="text-sm text-muted-foreground">Farmers can't prove land quality for loans, water is wasted, and erratic weather makes farming more precarious than ever.</p>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </section>

                {/* The Solution Section */}
                <section id="solution" className="py-24 px-4 bg-primary/5">
                     <motion.div 
                        className="container mx-auto text-center max-w-6xl space-y-4"
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, amount: 0.2 }}
                     >
                        <motion.h2 className="text-3xl md:text-5xl font-bold" variants={fadeIn}>This is Where Bhumicare Makes the Difference</motion.h2>
                        <motion.p className="text-lg text-muted-foreground max-w-3xl mx-auto" variants={fadeIn}>
                            Our integrated system of hardware and AI provides a complete, modern solution to an age-old problem.
                        </motion.p>
                        <motion.div 
                            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-8"
                            variants={staggerContainer}
                        >
                           {solutions.map((solution, i) => (
                               <IconCard key={i} {...solution} />
                           ))}
                        </motion.div>
                    </motion.div>
                </section>

                {/* How It Works Section */}
                <HowItWorks />

                {/* The Impact Section */}
                <section id="impact" className="py-24 px-4 bg-primary/5">
                    <motion.div 
                        className="container mx-auto text-center max-w-5xl space-y-12"
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={staggerContainer}
                    >
                         <div className="space-y-2">
                            <motion.h2 className="text-3xl md:text-5xl font-bold" variants={fadeIn}>Grow More. Spend Less. Protect the Future.</motion.h2>
                            <motion.p className="text-lg text-muted-foreground" variants={fadeIn}>Bhumicare delivers tangible, data-driven results that empower farmers and strengthen the agricultural ecosystem.</motion.p>
                        </div>
                        <motion.div className="grid md:grid-cols-3 gap-8" variants={staggerContainer}>
                            <motion.div className="glass-card p-8 text-center rounded-2xl" variants={fadeIn}>
                                <AnimatedNumber value={30} className="text-6xl md:text-7xl font-bold text-primary" prefix="+" />
                                <p className="text-xl font-semibold mt-2">Crop Yield Increase</p>
                            </motion.div>
                             <motion.div className="glass-card p-8 text-center rounded-2xl" variants={fadeIn}>
                                <AnimatedNumber value={30} className="text-6xl md:text-7xl font-bold text-primary" prefix="-" />
                                <p className="text-xl font-semibold mt-2">Fertilizer Costs</p>
                            </motion.div>
                             <motion.div className="glass-card p-8 text-center rounded-2xl" variants={fadeIn}>
                                <AnimatedNumber value={40} className="text-6xl md:text-7xl font-bold text-primary" prefix="-" />
                                <p className="text-xl font-semibold mt-2">Water Usage</p>
                            </motion.div>
                        </motion.div>
                        <motion.p className="text-md text-muted-foreground pt-4" variants={fadeIn}>
                            The device pays for itself in one season and is fully aligned with India's Digital Agriculture Mission.
                        </motion.p>
                    </motion.div>
                </section>
                
                 {/* Team & Mentors Section */}
                <motion.section 
                    id="team" 
                    className="py-24 px-4 relative"
                >
                     <motion.div 
                        className="container mx-auto text-center max-w-6xl space-y-12"
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={staggerContainer}
                    >
                        <motion.h2 className="text-3xl md:text-5xl font-bold" variants={fadeIn}>Our Team & Mentors</motion.h2>
                        
                        <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-6" variants={staggerContainer}>
                            {teamMembers.map(member => <TeamMemberCard key={member.name} {...member} />)}
                        </motion.div>

                        <motion.div className="grid md:grid-cols-2 gap-8 pt-8 text-left" variants={staggerContainer}>
                            <motion.div className="glass-card p-6 rounded-2xl" variants={fadeIn}>
                                <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                                    "Bhumicare's ground-level data is the missing piece in precision agriculture. It has the potential to revolutionize how we manage soil health at scale."
                                </blockquote>
                                <p className="mt-4 font-semibold">— Agricultural Scientist</p>
                            </motion.div>
                            <motion.div className="glass-card p-6 rounded-2xl" variants={fadeIn}>
                                 <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                                    "A brilliant application of IoT and AI to solve a real-world problem for millions. This is the future of sustainable farming."
                                </blockquote>
                                <p className="mt-4 font-semibold">— Startup Mentor</p>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </motion.section>

                {/* Field Validation & Supporters Section */}
                <section className="py-24 px-4 bg-primary/5">
                    <motion.div 
                        className="container mx-auto text-center max-w-6xl space-y-8"
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={staggerContainer}
                    >
                        <motion.h2 className="text-3xl md:text-5xl font-bold" variants={fadeIn}>Field Validation & Supporters</motion.h2>
                        <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4" variants={staggerContainer}>
                            <motion.div variants={fadeIn}><Image src="https://picsum.photos/seed/field1/400/400" alt="Field test 1" width={400} height={400} className="rounded-lg shadow-md" /></motion.div>
                            <motion.div variants={fadeIn}><Image src="https://picsum.photos/seed/field2/400/400" alt="Field test 2" width={400} height={400} className="rounded-lg shadow-md" /></motion.div>
                            <motion.div variants={fadeIn}><Image src="https://picsum.photos/seed/field3/400/400" alt="Field test 3" width={400} height={400} className="rounded-lg shadow-md" /></motion.div>
                            <motion.div variants={fadeIn}><Image src="https://picsum.photos/seed/field4/400/400" alt="Field test 4" width={400} height={400} className="rounded-lg shadow-md" /></motion.div>
                        </motion.div>
                        <motion.div className="pt-8" variants={fadeIn}>
                            <p className="text-lg text-muted-foreground">Proudly Supported and Incubated by</p>
                            <div className="mt-4 flex justify-center items-center">
                               <Image src="/aic-soa-logo.png" alt="AIC SOA Foundation" width={200} height={80} />
                            </div>
                        </motion.div>
                    </motion.div>
                </section>
            </main>
            
            <LandingFooter />
        </div>
    );
}
