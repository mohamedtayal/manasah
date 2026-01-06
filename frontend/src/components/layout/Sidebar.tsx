'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore, type Role } from '@/lib/auth';
import { Button } from '@/components/ui';
import {
  Home,
  BookOpen,
  GraduationCap,
  User,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  PlusCircle,
  Users,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles?: Role[];
}

const navItems: NavItem[] = [
  { label: 'الرئيسية', href: '/dashboard', icon: <Home size={20} />, roles: ['STUDENT', 'DOCTOR', 'ADMIN'] },
  { label: 'الدورات', href: '/dashboard/courses', icon: <BookOpen size={20} />, roles: ['STUDENT'] },
  { label: 'تقدمي', href: '/dashboard/progress', icon: <BarChart3 size={20} />, roles: ['STUDENT'] },
  { label: 'دوراتي', href: '/dashboard/my-courses', icon: <GraduationCap size={20} />, roles: ['DOCTOR'] },
  { label: 'إنشاء دورة', href: '/dashboard/courses/create', icon: <PlusCircle size={20} />, roles: ['DOCTOR'] },
  { label: 'الطلاب', href: '/dashboard/students', icon: <Users size={20} />, roles: ['DOCTOR'] },
  { label: 'الملف الشخصي', href: '/dashboard/profile', icon: <User size={20} />, roles: ['STUDENT', 'DOCTOR', 'ADMIN'] },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = React.useState(false);

  const filteredNavItems = navItems.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role))
  );

  const handleLogout = async () => {
    await logout();
    window.location.href = '/auth/login';
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="fixed top-4 right-4 z-50 md:hidden p-2 bg-dark-100 rounded-lg border border-dark-border"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed right-0 top-0 h-full w-64 bg-dark-100 border-l border-dark-border z-50',
          'transition-transform duration-300 md:translate-x-0',
          isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-dark-border">
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="text-2xl font-bold gradient-text">لِمّ المنهج</span>
            </Link>
          </div>

          {/* User info */}
          {user && (
            <div className="p-4 border-b border-dark-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {user.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-white">{user.name}</p>
                  <p className="text-sm text-gray-400">
                    {user.role === 'STUDENT' ? 'طالب' : user.role === 'DOCTOR' ? 'مدرس' : 'مدير'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {filteredNavItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                      pathname === item.href
                        ? 'bg-gradient-to-r from-primary/20 to-accent/20 text-primary'
                        : 'text-gray-400 hover:bg-dark-50 hover:text-white'
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-dark-border">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-400/10"
              onClick={handleLogout}
            >
              <LogOut size={20} />
              <span>تسجيل الخروج</span>
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
