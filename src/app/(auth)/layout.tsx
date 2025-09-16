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
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
       <div className="absolute top-8 left-8 flex items-center gap-2">
         <BhumicareLogo className="h-8 w-8 text-primary" />
         <span className="text-xl font-bold font-headline">Bhumicare</span>
       </div>
        <div className="absolute top-8 right-8">
            <Button variant="outline" asChild>
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Link>
            </Button>
        </div>
      {children}
    </div>
  );
}
