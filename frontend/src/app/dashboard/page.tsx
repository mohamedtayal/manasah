'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth';
import { DashboardLayout } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';
import { userApi, progressApi, enrollmentsApi } from '@/lib/api';
import { formatDate, calculateProgress } from '@/lib/utils';
import {
  BookOpen,
  GraduationCap,
  Clock,
  TrendingUp,
  Award,
  Users,
  PlusCircle,
  ChevronLeft,
} from 'lucide-react';
import Link from 'next/link';

interface Stats {
  totalCourses?: number;
  totalStudents?: number;
  enrolledCourses?: number;
  completedCourses?: number;
  totalWatchTime?: number;
  averageProgress?: number;
}

interface Enrollment {
  id: string;
  course: {
    id: string;
    title: string;
    thumbnailUrl?: string;
  };
  progress: number;
  enrolledAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [stats, setStats] = useState<Stats>({});
  const [recentEnrollments, setRecentEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        if (user.role === 'STUDENT') {
          const [statsRes, enrollmentsRes] = await Promise.all([
            userApi.getStudentStats(),
            enrollmentsApi.getMyEnrollments(),
          ]);
          setStats(statsRes.data.data);
          setRecentEnrollments(enrollmentsRes.data.data.slice(0, 3));
        } else if (user.role === 'DOCTOR') {
          const statsRes = await userApi.getDoctorStats();
          setStats(statsRes.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (!user) return null;

  const isStudent = user.role === 'STUDENT';
  const isDoctor = user.role === 'DOCTOR';

  return (
    <DashboardLayout>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          مرحباً، {user.name}! 👋
        </h1>
        <p className="text-gray-400">
          {isStudent
            ? 'استمر في تعلمك وتطوير مهاراتك'
            : 'إدارة دوراتك ومتابعة طلابك'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {isStudent ? (
          <>
            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <BookOpen className="text-primary" size={24} />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">الدورات المسجلة</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.enrolledCourses || 0}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                  <Award className="text-accent" size={24} />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">الدورات المكتملة</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.completedCourses || 0}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <Clock className="text-green-500" size={24} />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">وقت المشاهدة</p>
                  <p className="text-2xl font-bold text-white">
                    {Math.round((stats.totalWatchTime || 0) / 60)} ساعة
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                  <TrendingUp className="text-yellow-500" size={24} />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">متوسط التقدم</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.averageProgress || 0}%
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <BookOpen className="text-primary" size={24} />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">إجمالي الدورات</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.totalCourses || 0}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                  <Users className="text-accent" size={24} />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">إجمالي الطلاب</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.totalStudents || 0}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardContent className="flex items-center justify-between">
                <div>
                  <p className="text-xl font-bold text-white mb-2">
                    إنشاء دورة جديدة
                  </p>
                  <p className="text-gray-400 text-sm">
                    شارك معرفتك مع طلابك
                  </p>
                </div>
                <Link href="/dashboard/courses/create">
                  <Button>
                    <PlusCircle size={20} />
                    إنشاء دورة
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Recent Enrollments (Student only) */}
      {isStudent && recentEnrollments.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">الدورات الحالية</h2>
            <Link
              href="/dashboard/courses"
              className="text-primary hover:underline flex items-center gap-1"
            >
              عرض الكل
              <ChevronLeft size={18} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentEnrollments.map((enrollment) => (
              <Card key={enrollment.id} glow>
                <CardContent>
                  <div className="aspect-video bg-dark-50 rounded-lg mb-4 overflow-hidden">
                    {enrollment.course.thumbnailUrl ? (
                      <img
                        src={enrollment.course.thumbnailUrl}
                        alt={enrollment.course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="text-gray-600" size={48} />
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-white mb-2">
                    {enrollment.course.title}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">التقدم</span>
                      <span className="text-primary">{enrollment.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-dark-50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                        style={{ width: `${enrollment.progress}%` }}
                      />
                    </div>
                  </div>
                  <Link href={`/dashboard/courses/${enrollment.course.id}`}>
                    <Button variant="secondary" className="w-full mt-4">
                      متابعة التعلم
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">إجراءات سريعة</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isStudent ? (
            <>
              <Link href="/dashboard/courses">
                <Card glow className="hover:border-primary/50 cursor-pointer">
                  <CardContent className="flex items-center gap-4">
                    <BookOpen className="text-primary" size={24} />
                    <div>
                      <p className="font-semibold text-white">تصفح الدورات</p>
                      <p className="text-sm text-gray-400">
                        اكتشف دورات جديدة
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/dashboard/progress">
                <Card glow className="hover:border-accent/50 cursor-pointer">
                  <CardContent className="flex items-center gap-4">
                    <TrendingUp className="text-accent" size={24} />
                    <div>
                      <p className="font-semibold text-white">تتبع تقدمك</p>
                      <p className="text-sm text-gray-400">
                        عرض إحصائياتك
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/dashboard/profile">
                <Card glow className="hover:border-green-500/50 cursor-pointer">
                  <CardContent className="flex items-center gap-4">
                    <GraduationCap className="text-green-500" size={24} />
                    <div>
                      <p className="font-semibold text-white">الملف الشخصي</p>
                      <p className="text-sm text-gray-400">
                        إدارة حسابك
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard/courses/create">
                <Card glow className="hover:border-primary/50 cursor-pointer">
                  <CardContent className="flex items-center gap-4">
                    <PlusCircle className="text-primary" size={24} />
                    <div>
                      <p className="font-semibold text-white">إنشاء دورة</p>
                      <p className="text-sm text-gray-400">
                        أضف دورة جديدة
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/dashboard/my-courses">
                <Card glow className="hover:border-accent/50 cursor-pointer">
                  <CardContent className="flex items-center gap-4">
                    <BookOpen className="text-accent" size={24} />
                    <div>
                      <p className="font-semibold text-white">دوراتي</p>
                      <p className="text-sm text-gray-400">
                        إدارة دوراتك
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/dashboard/students">
                <Card glow className="hover:border-green-500/50 cursor-pointer">
                  <CardContent className="flex items-center gap-4">
                    <Users className="text-green-500" size={24} />
                    <div>
                      <p className="font-semibold text-white">الطلاب</p>
                      <p className="text-sm text-gray-400">
                        متابعة الطلاب
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
