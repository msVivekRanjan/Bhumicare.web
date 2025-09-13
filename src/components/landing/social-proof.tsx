'use client';

import Image from "next/image";
import { motion } from "framer-motion";

const logos = [
    { src: "/aic-soa-logo.png", alt: "AIC SOA Foundation" },
    { src: "https://picsum.photos/seed/logo1/150/50?grayscale", alt: "Placeholder Logo 1" },
    { src: "https://picsum.photos/seed/logo2/150/50?grayscale", alt: "Placeholder Logo 2" },
    { src: "https://picsum.photos/seed/logo3/150/50?grayscale", alt: "Placeholder Logo 3" },
    { src: "https://picsum.photos/seed/logo4/150/50?grayscale", alt: "Placeholder Logo 4" },
    { src: "https://picsum.photos/seed/logo5/150/50?grayscale", alt: "Placeholder Logo 5" },
];

export function SocialProof() {
    const duplicatedLogos = [...logos, ...logos];

    return (
        <section className="py-16">
            <div className="container mx-auto max-w-7xl px-6">
                <p className="text-center text-sm font-semibold text-muted-foreground tracking-wider uppercase mb-8">
                    Trusted by Industry Leaders & Innovators
                </p>
                <div className="relative w-full overflow-hidden">
                    <motion.div
                        className="flex gap-16"
                        animate={{
                            x: ['0%', '-100%'],
                        }}
                        transition={{
                            ease: 'linear',
                            duration: 20,
                            repeat: Infinity,
                        }}
                    >
                        {duplicatedLogos.map((logo, index) => (
                            <div key={index} className="flex-shrink-0" style={{ minWidth: '150px' }}>
                                <Image
                                    src={logo.src}
                                    alt={logo.alt}
                                    width={150}
                                    height={50}
                                    className="object-contain h-10 w-auto filter grayscale brightness-0 invert"
                                />
                            </div>
                        ))}
                    </motion.div>
                     <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent"></div>
                     <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent"></div>
                </div>
            </div>
        </section>
    );
}
