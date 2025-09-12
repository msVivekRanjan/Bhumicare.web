'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/use-translation';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const { t } = useTranslation();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email">{t('email')}</Label>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          required
          defaultValue="farmer@bhumicare.com"
        />
      </div>
      <div className="grid gap-2">
        <div className="flex items-center">
            <Label htmlFor="password">{t('password')}</Label>
            <Link href="#" className="ml-auto inline-block text-sm underline">
                Forgot your password?
            </Link>
        </div>
        <Input id="password" type="password" required defaultValue="password" />
      </div>
      <Button type="submit" className="w-full">
        {t('login')}
      </Button>
      <div className="mt-4 text-center text-sm">
        {t('dont_have_account')}{' '}
        <Link href="/register" className="underline">
          {t('register')}
        </Link>
      </div>
    </form>
  );
}
