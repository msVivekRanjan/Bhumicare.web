import Image from 'next/image';
import { Card } from '@/components/ui/card';

interface TeamMemberCardProps {
    name: string;
    role: string;
    avatarUrl: string;
}

export function TeamMemberCard({ name, role, avatarUrl }: TeamMemberCardProps) {
    return (
        <Card className="text-center p-4">
            <Image 
                src={avatarUrl} 
                alt={name} 
                width={100} 
                height={100} 
                className="rounded-full mx-auto mb-4 border-2 border-primary"
            />
            <h4 className="font-bold font-headline text-lg">{name}</h4>
            <p className="text-sm text-muted-foreground">{role}</p>
        </Card>
    );
}
