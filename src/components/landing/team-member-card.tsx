'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface TeamMemberCardProps {
    name: string;
    role: string;
    avatarUrl: string;
}

export function TeamMemberCard({ name, role, avatarUrl }: TeamMemberCardProps) {
    return (
        <motion.div 
            className="text-center p-4 glass-card"
            whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.2)" }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
            <Image 
                src={avatarUrl} 
                alt={name} 
                width={100} 
                height={100} 
                className="rounded-full mx-auto mb-4 border-2 border-primary"
            />
            <h4 className="font-bold text-lg">{name}</h4>
            <p className="text-sm text-muted-foreground">{role}</p>
        </motion.div>
    );
}