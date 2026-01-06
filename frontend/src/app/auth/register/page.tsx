'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore, type Role } from '@/lib/auth';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { Mail, Lock, Eye, EyeOff, User, GraduationCap, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

const registerSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  email: z.string().email('البريد الإلكتروني غير صالح'),
  password: z
    .string()
    .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
    .regex(/[A-Z]/, 'يجب أن تحتوي على حرف كبير واحد على الأقل')
    .regex(/[a-z]/, 'يجب أن تحتوي على حرف صغير واحد على الأقل')
    .regex(/[0-9]/, 'يجب أن تحتوي على رقم واحد على الأقل')
    .regex(/[^A-Za-z0-9]/, 'يجب أن تحتوي على رمز خاص واحد على الأقل'),
  confirmPassword: z.string(),
  role: z.enum(['STUDENT', 'DOCTOR']),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'كلمات المرور غير متطابقة',
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, isLoading, error, clearError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>('STUDENT');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'STUDENT',
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role,
      });
      router.push('/dashboard');
    } catch {
      // Error is handled by the store
    }
  };

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setValue('role', role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark p-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-4xl font-bold gradient-text">لِمّ المنهج</h1>
          </Link>
          <p className="text-gray-400 mt-2">إنشاء حساب جديد</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">التسجيل</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  نوع الحساب
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleRoleSelect('STUDENT')}
                    className={cn(
                      'p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2',
                      selectedRole === 'STUDENT'
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-dark-border bg-dark-50 text-gray-400 hover:border-gray-600'
                    )}
                  >
                    <GraduationCap size={24} />
                    <span className="font-semibold">طالب</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleSelect('DOCTOR')}
                    className={cn(
                      'p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2',
                      selectedRole === 'DOCTOR'
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-dark-border bg-dark-50 text-gray-400 hover:border-gray-600'
                    )}
                  >
                    <BookOpen size={24} />
                    <span className="font-semibold">مدرس</span>
                  </button>
                </div>
                <input type="hidden" {...register('role')} />
              </div>

              <Input
                label="الاسم الكامل"
                type="text"
                placeholder="أدخل اسمك"
                icon={<User size={20} />}
                error={errors.name?.message}
                {...register('name')}
                onChange={(e) => {
                  register('name').onChange(e);
                  clearError();
                }}
              />

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

              <Input
                label="تأكيد كلمة المرور"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                icon={<Lock size={20} />}
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />

              {/* Password requirements */}
              <div className="text-xs text-gray-500 space-y-1">
                <p>كلمة المرور يجب أن تحتوي على:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>8 أحرف على الأقل</li>
                  <li>حرف كبير واحد على الأقل</li>
                  <li>حرف صغير واحد على الأقل</li>
                  <li>رقم واحد على الأقل</li>
                  <li>رمز خاص واحد على الأقل (@$!%*?&)</li>
                </ul>
              </div>

              <Button type="submit" className="w-full" isLoading={isLoading}>
                إنشاء الحساب
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                لديك حساب بالفعل؟{' '}
                <Link href="/auth/login" className="text-primary hover:underline">
                  تسجيل الدخول
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
