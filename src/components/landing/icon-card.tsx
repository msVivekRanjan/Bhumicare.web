'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface IconCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const cardAnimation = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeInOut' },
};

export function IconCard({ icon, title, description }: IconCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
        <motion.div 
            className="p-6 text-left rounded-2xl glass-card relative overflow-hidden"
            variants={cardAnimation}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            <motion.div 
                className="absolute inset-0 bg-aurora"
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            />
            <div className="relative z-10">
                <div className="mb-4">
                    {icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
             <motion.div 
                className="absolute top-0 left-0 right-0 bottom-0 border-2 rounded-2xl border-primary"
                initial={{ opacity: 0}}
                animate={{ opacity: isHovered ? 0.5 : 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            />
        </motion.div>
    );
}
