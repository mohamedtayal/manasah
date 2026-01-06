'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark">
      <div className="text-center">
        <h1 className="text-4xl font-bold gradient-text mb-4">لِمّ المنهج</h1>
        <div className="spinner mx-auto" />
      </div>
    </div>
  );
}
