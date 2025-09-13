import { Card } from '@/components/ui/card';

interface IconCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

export function IconCard({ icon, title, description }: IconCardProps) {
    return (
        <Card className="p-6 text-left">
            <div className="mb-4">
                {icon}
            </div>
            <h3 className="font-bold text-lg font-headline mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
        </Card>
    );
}
