'use client';

import { LoginForm } from '@/components/auth/login-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';

export default function LoginPage() {
  const { t } = useTranslation();
  return (
    <Card className="w-full max-w-sm bg-background/30 backdrop-blur-xl border-white/20">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">{t('login_to_bhumicare')}</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  );
}
