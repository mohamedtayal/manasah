'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/auth';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, Button } from '@/components/ui';
import { coursesApi } from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/utils';
import { BookOpen, PlusCircle, Edit, Trash2, Eye, EyeOff, Users } from 'lucide-react';
import Link from 'next/link';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  published: boolean;
  thumbnailUrl?: string;
  createdAt: string;
  _count: {
    enrollments: number;
    modules: number;
  };
}

export default function MyCoursesPage() {
  const { user } = useAuthStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await coursesApi.getMyCourses();
        setCourses(response.data.data);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleTogglePublish = async (course: Course) => {
    try {
      await coursesApi.update(course.id, { published: !course.published });
      setCourses((prev) =>
        prev.map((c) =>
          c.id === course.id ? { ...c, published: !c.published } : c
        )
      );
    } catch (error) {
      console.error('Failed to update course:', error);
    }
  };

  const handleDelete = async (courseId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الدورة؟')) return;

    try {
      setDeletingId(courseId);
      await coursesApi.delete(courseId);
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
    } catch (error) {
      console.error('Failed to delete course:', error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <DashboardLayout allowedRoles={['DOCTOR']}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">دوراتي</h1>
          <p className="text-gray-400">إدارة الدورات التي أنشأتها</p>
        </div>
        <Link href="/dashboard/courses/create">
          <Button>
            <PlusCircle size={20} />
            إنشاء دورة جديدة
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="spinner" />
        </div>
      ) : courses.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="mx-auto text-gray-600 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-white mb-2">
              لم تنشئ أي دورات بعد
            </h3>
            <p className="text-gray-400 mb-6">
              ابدأ بإنشاء دورتك الأولى وشارك معرفتك مع الطلاب
            </p>
            <Link href="/dashboard/courses/create">
              <Button>
                <PlusCircle size={20} />
                إنشاء دورة جديدة
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {/* Thumbnail */}
                  <div className="w-full md:w-48 h-32 bg-dark-50 flex-shrink-0">
                    {course.thumbnailUrl ? (
                      <img
                        src={course.thumbnailUrl}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="text-gray-600" size={32} />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-white">
                            {course.title}
                          </h3>
                          {course.published ? (
                            <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                              منشورة
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                              مسودة
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm line-clamp-2 mb-2">
                          {course.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Users size={14} />
                            {course._count.enrollments} طالب
                          </span>
                          <span>{course._count.modules} وحدات</span>
                          <span>{formatPrice(course.price)}</span>
                          <span>{formatDate(course.createdAt)}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTogglePublish(course)}
                          title={course.published ? 'إلغاء النشر' : 'نشر'}
                        >
                          {course.published ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </Button>
                        <Link href={`/dashboard/courses/${course.id}/edit`}>
                          <Button variant="ghost" size="sm" title="تعديل">
                            <Edit size={18} />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300"
                          onClick={() => handleDelete(course.id)}
                          disabled={deletingId === course.id}
                          title="حذف"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
