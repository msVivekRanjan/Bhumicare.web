import { BhumicareLogo } from '@/components/icons';

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
      {children}
    </div>
  );
}
