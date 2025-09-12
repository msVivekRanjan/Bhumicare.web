'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/use-translation';
import { APIProvider } from '@vis.gl/react-google-maps';
import { GOOGLE_MAPS_API_KEY } from '@/lib/constants';
import { RegistrationMap } from './registration-map';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import ErrorBoundary from '../error-boundary';

export function RegisterForm() {
  const { t } = useTranslation();
  const [fieldCoordinates, setFieldCoordinates] = useState<string>('');
  const router = useRouter();
  const { toast } = useToast();


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
      
      if (fieldCoordinates) {
        localStorage.setItem('bhumicare_field_coordinates', fieldCoordinates);
        console.log('Registered with field coordinates:', fieldCoordinates);
      } else {
        localStorage.removeItem('bhumicare_field_coordinates');
        console.log('Registered without field coordinates.');
      }
      toast({
        title: "Registration Successful!",
        description: "Your account has been created.",
      });
      router.push('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="full-name">{t('full_name')}</Label>
          <Input id="full-name" placeholder="Ram Kumar" required className="bg-background/50" />
        </div>
         <div className="grid gap-2">
            <Label htmlFor="email">{t('email')}</Label>
            <Input id="email" type="email" placeholder="ram@example.com" required className="bg-background/50" />
         </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">{t('password')}</Label>
        <Input id="password" type="password" required className="bg-background/50" />
      </div>

      <div className="grid gap-2">
        <Label>{t('define_field_boundary')}</Label>
        <div className="h-64 w-full rounded-lg overflow-hidden border">
          <ErrorBoundary fallback={<p>Something went wrong with the map.</p>}>
            <APIProvider apiKey={GOOGLE_MAPS_API_KEY} libraries={['drawing']}>
                  <RegistrationMap onCoordinatesChange={setFieldCoordinates} />
            </APIProvider>
          </ErrorBoundary>
        </div>
        <Input id="coordinates" type="hidden" value={fieldCoordinates} />
      </div>

      <Button type="submit" className="w-full">
        {t('register')}
      </Button>

      <div className="mt-4 text-center text-sm">
        {t('already_have_account')}{' '}
        <Link href="/login" className="underline">
          {t('login')}
        </Link>
      </div>
    </form>
  );
}