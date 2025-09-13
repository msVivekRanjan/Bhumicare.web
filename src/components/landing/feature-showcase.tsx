'use client';

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sprout, Mic, CheckCircle, Leaf } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";


const features = [
    {
        title: "Live Soil Health Data",
        description: "Get continuous, real-time data on soil nutrients (NPK), pH, and moisture, replacing infrequent and slow lab tests.",
        id: "live-data",
        icon: Sprout,
        image: "https://picsum.photos/seed/feature1/800/600"
    },
    {
        title: "Voice-First AI Advice",
        description: "Receive simple, actionable guidance in regional dialects (Hindi, Odia, English) that farmers can easily understand and act upon.",
        id: "ai-advice",
        icon: Mic,
        image: "https://picsum.photos/seed/feature2/800/600"
    },
    {
        title: "Dynamic Soil Fertility Maps",
        description: "Live, aggregated maps provide a ground-level truth for farmers and policymakers, unlike static government surveys.",
        id: "fertility-maps",
        icon: Leaf,
        image: "https://picsum.photos/seed/feature3/800/600"
    },
     {
        title: "Offline-First Design",
        description: "The device and app are designed to work reliably even without a stable internet connection, caching data until it can sync.",
        id: "offline-first",
        icon: CheckCircle,
        image: "https://picsum.photos/seed/feature4/800/600"
    },
];

export const FeatureShowcase = () => {
    const [activeFeature, setActiveFeature] = useState(features[0].id);
    const featureRefs = useRef<(HTMLDivElement | null)[]>([]);

     useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveFeature(entry.target.id);
                    }
                });
            },
            { rootMargin: "-50% 0% -50% 0%" }
        );

        featureRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => {
             featureRefs.current.forEach((ref) => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, []);


    return (
        <section id="solution" className="relative py-24 sm:py-32 px-6">
            <div className="container mx-auto max-w-7xl">
                <div className="text-center max-w-4xl mx-auto space-y-4 mb-16">
                    <h2 className="text-3xl md:text-4xl font-semibold tracking-tighter">This is Where Bhumicare Makes the Difference</h2>
                    <p className="text-lg text-muted-foreground">Our integrated system of hardware and AI provides a complete, modern solution to an age-old problem.</p>
                </div>
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                     <div className="sticky top-24 space-y-8">
                        {features.map((feature, index) => (
                             <motion.div 
                                key={feature.id}
                                className={cn(
                                    "p-6 rounded-2xl border transition-all duration-300",
                                    activeFeature === feature.id ? "border-primary/50 bg-primary/5 shadow-lg shadow-primary/10" : "border-white/10 bg-background-secondary"
                                )}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <div className="flex items-center gap-4 mb-2">
                                    <feature.icon className={cn("w-7 h-7 transition-colors", activeFeature === feature.id ? "text-primary" : "text-muted-foreground")} />
                                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                                </div>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="space-y-16">
                        {features.map((feature, index) => (
                             <div 
                                key={feature.id} 
                                id={feature.id} 
                                ref={el => featureRefs.current[index] = el}
                                className="min-h-[60vh] flex items-center justify-center"
                            >
                                <motion.div
                                     className={cn(
                                        "relative w-full aspect-video rounded-2xl border border-white/10 p-4 transition-opacity duration-500",
                                        activeFeature === feature.id ? 'opacity-100' : 'opacity-30'
                                    )}
                                >
                                    <Image
                                        src={feature.image}
                                        alt={feature.title}
                                        width={800}
                                        height={600}
                                        className="rounded-lg w-full h-full object-cover"
                                    />
                                </motion.div>
                             </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
