'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/auth';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, Button, Input } from '@/components/ui';
import { userApi } from '@/lib/api';
import { User, Mail, FileText, Lock, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const profileSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  bio: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'كلمة المرور الحالية مطلوبة'),
  newPassword: z
    .string()
    .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
    .regex(/[A-Z]/, 'يجب أن تحتوي على حرف كبير')
    .regex(/[a-z]/, 'يجب أن تحتوي على حرف صغير')
    .regex(/[0-9]/, 'يجب أن تحتوي على رقم')
    .regex(/[^A-Za-z0-9]/, 'يجب أن تحتوي على رمز خاص'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'كلمات المرور غير متطابقة',
  path: ['confirmPassword'],
});

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const { user, fetchProfile } = useAuthStore();
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      bio: user?.bio || '',
    },
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    if (user) {
      profileForm.setValue('name', user.name);
      profileForm.setValue('bio', user.bio || '');
    }
  }, [user, profileForm]);

  const onProfileSubmit = async (data: ProfileForm) => {
    try {
      setIsProfileLoading(true);
      setProfileSuccess(false);
      await userApi.updateProfile(data);
      await fetchProfile();
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsProfileLoading(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordForm) => {
    try {
      setIsPasswordLoading(true);
      setPasswordSuccess(false);
      setPasswordError('');
      await userApi.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setPasswordSuccess(true);
      passwordForm.reset();
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (error: any) {
      setPasswordError(error.response?.data?.message || 'فشل تغيير كلمة المرور');
    } finally {
      setIsPasswordLoading(false);
    }
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">الملف الشخصي</h1>
        <p className="text-gray-400">إدارة معلومات حسابك</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Info */}
        <Card>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {user.name.charAt(0)}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{user.name}</h2>
                <p className="text-gray-400">{user.email}</p>
                <span className="inline-block mt-1 px-3 py-1 bg-primary/20 text-primary text-sm rounded-full">
                  {user.role === 'STUDENT' ? 'طالب' : user.role === 'DOCTOR' ? 'مدرس' : 'مدير'}
                </span>
              </div>
            </div>

            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
              {profileSuccess && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-green-400 text-sm">
                  تم تحديث الملف الشخصي بنجاح
                </div>
              )}

              <Input
                label="الاسم الكامل"
                icon={<User size={20} />}
                error={profileForm.formState.errors.name?.message}
                {...profileForm.register('name')}
              />

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  نبذة عنك
                </label>
                <textarea
                  className="bg-dark-50 border border-dark-border rounded-lg px-4 py-3 w-full text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all min-h-[100px] resize-none"
                  placeholder="اكتب نبذة قصيرة عنك..."
                  {...profileForm.register('bio')}
                />
              </div>

              <Button type="submit" isLoading={isProfileLoading}>
                <Save size={18} />
                حفظ التغييرات
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardContent>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Lock size={24} />
              تغيير كلمة المرور
            </h2>

            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              {passwordSuccess && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-green-400 text-sm">
                  تم تغيير كلمة المرور بنجاح
                </div>
              )}

              {passwordError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
                  {passwordError}
                </div>
              )}

              <Input
                label="كلمة المرور الحالية"
                type="password"
                icon={<Lock size={20} />}
                error={passwordForm.formState.errors.currentPassword?.message}
                {...passwordForm.register('currentPassword')}
              />

              <Input
                label="كلمة المرور الجديدة"
                type="password"
                icon={<Lock size={20} />}
                error={passwordForm.formState.errors.newPassword?.message}
                {...passwordForm.register('newPassword')}
              />

              <Input
                label="تأكيد كلمة المرور الجديدة"
                type="password"
                icon={<Lock size={20} />}
                error={passwordForm.formState.errors.confirmPassword?.message}
                {...passwordForm.register('confirmPassword')}
              />

              <div className="text-xs text-gray-500 space-y-1">
                <p>كلمة المرور يجب أن تحتوي على:</p>
                <ul className="list-disc list-inside">
                  <li>8 أحرف على الأقل</li>
                  <li>حرف كبير وحرف صغير</li>
                  <li>رقم ورمز خاص</li>
                </ul>
              </div>

              <Button type="submit" isLoading={isPasswordLoading}>
                <Lock size={18} />
                تغيير كلمة المرور
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
