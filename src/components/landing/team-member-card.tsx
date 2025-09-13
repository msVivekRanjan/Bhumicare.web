'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface TeamMemberCardProps {
    name: string;
    role: string;
    avatarUrl: string;
}

const cardAnimation = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeInOut' },
};

export function TeamMemberCard({ name, role, avatarUrl }: TeamMemberCardProps) {
    return (
        <motion.div 
            className="text-center p-4 rounded-2xl glass-card"
            variants={cardAnimation}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
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
