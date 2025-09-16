import { BhumicareLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-background p-4 overflow-hidden">
       {/* Animated Gradient Background */}
       <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-aurora-cta opacity-40" />
          <div className="absolute inset-0 bg-background/60" />
       </div>

       <div className="absolute top-8 left-8 flex items-center gap-2 z-10">
         <BhumicareLogo className="h-8 w-8 text-primary" />
         <span className="text-xl font-bold font-headline">Bhumicare</span>
       </div>
        <div className="absolute top-8 right-8 z-10">
            <Button variant="outline" asChild>
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Link>
            </Button>
        </div>
      <div className="relative z-10 w-full flex justify-center">{children}</div>
    </div>
  );
}
