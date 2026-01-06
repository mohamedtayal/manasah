'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/auth';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, Button, Input } from '@/components/ui';
import { coursesApi, enrollmentsApi } from '@/lib/api';
import { formatPrice, truncateText } from '@/lib/utils';
import { BookOpen, Search, Filter, ChevronLeft, Users, Clock } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  thumbnailUrl?: string;
  instructor: {
    name: string;
  };
  _count: {
    enrollments: number;
    modules: number;
  };
}

export default function CoursesPage() {
  const { user } = useAuthStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<string>>(new Set());
  const [enrollingId, setEnrollingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, categoriesRes] = await Promise.all([
          coursesApi.getAll({ category: selectedCategory, search: searchQuery }),
          coursesApi.getCategories(),
        ]);
        setCourses(coursesRes.data.data);
        setCategories(categoriesRes.data.data);

        if (user?.role === 'STUDENT') {
          const enrollmentsRes = await enrollmentsApi.getMyEnrollments();
          const ids = new Set(
            enrollmentsRes.data.data.map((e: any) => e.course.id)
          );
          setEnrolledCourseIds(ids);
        }
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory, searchQuery, user]);

  const handleEnroll = async (courseId: string) => {
    try {
      setEnrollingId(courseId);
      await enrollmentsApi.enroll(courseId);
      setEnrolledCourseIds((prev) => new Set([...prev, courseId]));
    } catch (error) {
      console.error('Failed to enroll:', error);
    } finally {
      setEnrollingId(null);
    }
  };

  const isEnrolled = (courseId: string) => enrolledCourseIds.has(courseId);

  return (
    <DashboardLayout allowedRoles={['STUDENT']}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">تصفح الدورات</h1>
        <p className="text-gray-400">اكتشف دورات جديدة وطور مهاراتك</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <Input
            placeholder="ابحث عن دورة..."
            icon={<Search size={20} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory('')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm transition-all',
              !selectedCategory
                ? 'bg-primary text-dark font-semibold'
                : 'bg-dark-50 text-gray-400 hover:bg-dark-100'
            )}
          >
            الكل
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm transition-all',
                selectedCategory === category
                  ? 'bg-primary text-dark font-semibold'
                  : 'bg-dark-50 text-gray-400 hover:bg-dark-100'
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="spinner" />
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="mx-auto text-gray-600 mb-4" size={64} />
          <p className="text-gray-400">لا توجد دورات متاحة حالياً</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} glow className="overflow-hidden">
              <div className="aspect-video bg-dark-50 relative">
                {course.thumbnailUrl ? (
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="text-gray-600" size={48} />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span className="bg-dark/80 backdrop-blur px-3 py-1 rounded-full text-xs text-gray-300">
                    {course.category}
                  </span>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-white mb-2 line-clamp-1">
                  {course.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {truncateText(course.description, 100)}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <span className="flex items-center gap-1">
                    <Users size={16} />
                    {course._count.enrollments} طالب
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen size={16} />
                    {course._count.modules} وحدات
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">
                    {formatPrice(course.price)}
                  </span>
                  {isEnrolled(course.id) ? (
                    <Link href={`/dashboard/courses/${course.id}`}>
                      <Button size="sm">
                        متابعة التعلم
                        <ChevronLeft size={16} />
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleEnroll(course.id)}
                      isLoading={enrollingId === course.id}
                    >
                      {course.price === 0 ? 'التسجيل مجاناً' : 'التسجيل الآن'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
