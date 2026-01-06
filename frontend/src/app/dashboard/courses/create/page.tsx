'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, Button, Input } from '@/components/ui';
import { coursesApi } from '@/lib/api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BookOpen, DollarSign, Tag, FileText, Image, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const courseSchema = z.object({
  title: z.string().min(5, 'عنوان الدورة يجب أن يكون 5 أحرف على الأقل'),
  description: z.string().min(20, 'وصف الدورة يجب أن يكون 20 حرفاً على الأقل'),
  category: z.string().min(1, 'يرجى اختيار تصنيف'),
  price: z.number().min(0, 'السعر لا يمكن أن يكون سالباً'),
  thumbnailUrl: z.string().url('رابط الصورة غير صالح').optional().or(z.literal('')),
});

type CourseForm = z.infer<typeof courseSchema>;

const categories = [
  'برمجة',
  'تصميم',
  'تسويق',
  'أعمال',
  'لغات',
  'علوم بيانات',
  'ذكاء اصطناعي',
  'أمن سيبراني',
  'شبكات',
  'أخرى',
];

export default function CreateCoursePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CourseForm>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      price: 0,
    },
  });

  const thumbnailUrl = watch('thumbnailUrl');

  const onSubmit = async (data: CourseForm) => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await coursesApi.create({
        ...data,
        thumbnailUrl: data.thumbnailUrl || undefined,
      });
      
      router.push(`/dashboard/courses/${response.data.data.id}/edit`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'فشل إنشاء الدورة');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout allowedRoles={['DOCTOR']}>
      <div className="mb-8">
        <Link
          href="/dashboard/my-courses"
          className="text-gray-400 hover:text-white flex items-center gap-2 mb-4"
        >
          <ArrowRight size={18} />
          العودة إلى دوراتي
        </Link>
        <h1 className="text-3xl font-bold text-white mb-2">إنشاء دورة جديدة</h1>
        <p className="text-gray-400">أدخل معلومات الدورة الأساسية</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <Input
                  label="عنوان الدورة"
                  placeholder="مثال: أساسيات البرمجة بلغة Python"
                  icon={<BookOpen size={20} />}
                  error={errors.title?.message}
                  {...register('title')}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    وصف الدورة
                  </label>
                  <textarea
                    className="bg-dark-50 border border-dark-border rounded-lg px-4 py-3 w-full text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all min-h-[150px] resize-none"
                    placeholder="اكتب وصفاً تفصيلياً للدورة يشرح ما سيتعلمه الطالب..."
                    {...register('description')}
                  />
                  {errors.description && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    التصنيف
                  </label>
                  <select
                    className="bg-dark-50 border border-dark-border rounded-lg px-4 py-3 w-full text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    {...register('category')}
                  >
                    <option value="">اختر تصنيفاً</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.category.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    السعر (ريال سعودي)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="bg-dark-50 border border-dark-border rounded-lg px-4 py-3 w-full text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="0 للدورات المجانية"
                    {...register('price', { valueAsNumber: true })}
                  />
                  {errors.price && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                <Input
                  label="رابط صورة الغلاف (اختياري)"
                  placeholder="https://example.com/image.jpg"
                  icon={<Image size={20} />}
                  error={errors.thumbnailUrl?.message}
                  {...register('thumbnailUrl')}
                />

                <div className="flex gap-4">
                  <Button type="submit" isLoading={isLoading}>
                    إنشاء الدورة
                  </Button>
                  <Link href="/dashboard/my-courses">
                    <Button type="button" variant="secondary">
                      إلغاء
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardContent>
              <h3 className="text-lg font-semibold text-white mb-4">معاينة</h3>
              <div className="aspect-video bg-dark-50 rounded-lg mb-4 overflow-hidden">
                {thumbnailUrl ? (
                  <img
                    src={thumbnailUrl}
                    alt="معاينة"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="text-gray-600" size={48} />
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-400 space-y-2">
                <p>• بعد إنشاء الدورة، يمكنك إضافة الوحدات والدروس</p>
                <p>• الدورة ستكون مسودة حتى تقوم بنشرها</p>
                <p>• يمكنك تعديل جميع المعلومات لاحقاً</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
