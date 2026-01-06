'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/lib/auth';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password);
      router.push('/dashboard');
    } catch {
      // Error is handled by the store
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-4xl font-bold gradient-text">لِمّ المنهج</h1>
          </Link>
          <p className="text-gray-400 mt-2">مرحباً بك مجدداً</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">تسجيل الدخول</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <Input
                label="البريد الإلكتروني"
                type="email"
                placeholder="example@email.com"
                icon={<Mail size={20} />}
                error={errors.email?.message}
                {...register('email')}
                onChange={(e) => {
                  register('email').onChange(e);
                  clearError();
                }}
              />

              <div className="relative">
                <Input
                  label="كلمة المرور"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  icon={<Lock size={20} />}
                  error={errors.password?.message}
                  {...register('password')}
                  onChange={(e) => {
                    register('password').onChange(e);
                    clearError();
                  }}
                />
                <button
                  type="button"
                  className="absolute left-4 top-10 text-gray-500 hover:text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <Button type="submit" className="w-full" isLoading={isLoading}>
                تسجيل الدخول
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                ليس لديك حساب؟{' '}
                <Link href="/auth/register" className="text-primary hover:underline">
                  إنشاء حساب جديد
                </Link>
              </p>
            </div>

            {/* Test accounts info */}
            <div className="mt-6 p-4 bg-dark-50 rounded-lg border border-dark-border">
              <p className="text-sm text-gray-400 mb-2">حسابات تجريبية:</p>
              <div className="text-xs text-gray-500 space-y-1">
                <p>طالب: student@limm.test / Test@123456</p>
                <p>مدرس: doctor@limm.test / Test@123456</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
