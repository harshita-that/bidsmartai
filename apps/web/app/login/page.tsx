'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Mail, Lock, ArrowRight } from 'lucide-react';

import { useAuthStore } from '@/lib/store/auth';
import { Input } from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      await login(data);
      toast.success('Welcome back!');
      const redirectTo = searchParams.get('redirect') || '/dashboard';
      router.push(redirectTo);
    } catch (err: any) {
      toast.error(err.message || 'Failed to sign in');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-onyx-dark text-ivory">
      {/* Left side: Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-block mb-12">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-sm bg-emerald-mid flex items-center justify-center">
                <span className="font-display font-bold text-ivory text-xl leading-none">B</span>
              </div>
              <span className="font-display font-medium text-xl tracking-wide">BidSmart</span>
            </div>
          </Link>

          <h1 className="text-3xl font-display font-medium mb-2">Welcome back</h1>
          <p className="text-ivory/60 mb-8">Sign in to your account to continue.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              icon={<Mail size={18} />}
              error={errors.email?.message}
              {...register('email')}
            />
            
            <div className="space-y-1.5">
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                icon={<Lock size={18} />}
                error={errors.password?.message}
                {...register('password')}
              />
              <div className="flex justify-end">
                <Link href="/forgot-password" className="text-sm text-emerald-bright hover:underline">
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button type="submit" className="w-full mt-4" isLoading={isSubmitting}>
              Sign In <ArrowRight size={18} className="ml-2" />
            </Button>
          </form>

          {/* Google OAuth Stub */}
          <div className="mt-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-sm text-ivory/40">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <button
            onClick={() => toast.info('Google OAuth coming soon')}
            className="w-full mt-6 flex items-center justify-center gap-3 px-4 py-3 rounded-sm border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            Sign in with Google
          </button>

          <p className="mt-8 text-center text-ivory/60">
            Don't have an account?{' '}
            <Link href="/register" className="text-emerald-bright hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>

      {/* Right side: Abstract Art/Graphic */}
      <div className="hidden md:block flex-1 bg-onyx-mid relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-mid/20 to-transparent z-10" />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />
        <div className="absolute inset-0 flex items-center justify-center z-20 p-12">
          <div className="max-w-md text-center">
            <h2 className="text-3xl font-display font-medium text-ivory mb-4">
              "BidSmart saved me $14,000 on a Patek Philippe Nautilus."
            </h2>
            <p className="text-ivory/60">
              — James T., Private Collector
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
