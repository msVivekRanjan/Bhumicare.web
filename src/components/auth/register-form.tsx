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
      
      // For demonstration, we save to local storage.
      // In a real app, this would be sent to the server.
      if (fieldCoordinates) {
        localStorage.setItem('bhumicare_field_coordinates', fieldCoordinates);
         try {
            const coords = JSON.parse(fieldCoordinates);
            if (coords.length > 0) {
                 // Save the center of the polygon as the user's location for map centering
                const bounds = new window.google.maps.LatLngBounds();
                coords.forEach((coord: google.maps.LatLngLiteral) => bounds.extend(coord));
                const center = bounds.getCenter().toJSON();
                localStorage.setItem('bhumicare_user_location', JSON.stringify(center));
            }
        } catch (error) {
            console.error("Could not parse field coordinates to set user location", error);
        }
      } else {
        // If no field is defined, we can clear old data or use a default
         localStorage.removeItem('bhumicare_field_coordinates');
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
        <div className="h-96 w-full rounded-lg overflow-hidden border">
          <ErrorBoundary fallback={<p>Something went wrong with the map.</p>}>
            <APIProvider apiKey={GOOGLE_MAPS_API_KEY} libraries={['drawing', 'geometry']}>
                  <RegistrationMap onPolygonChange={setFieldCoordinates} />
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
