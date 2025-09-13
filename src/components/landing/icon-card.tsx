'use client';
import { motion } from 'framer-motion';

interface IconCardProps {
    icon?: React.ReactNode;
    title: string;
    description: string;
}

export function IconCard({ icon, title, description }: IconCardProps) {
    
    return (
        <motion.div 
            className="p-6 text-left rounded-2xl glass-card relative overflow-hidden"
            whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.2)" }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
            <div className="relative z-10">
                {icon && <div className="mb-4">
                    {icon}
                </div>}
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
        </motion.div>
    );
}