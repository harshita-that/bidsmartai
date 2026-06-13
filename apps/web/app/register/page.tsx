'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

import { useAuthStore } from '@/lib/store/auth';
import { Input } from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  terms: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the terms and conditions' }),
  }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true);
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      toast.success('Account created successfully!');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Failed to create account');
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

          <h1 className="text-3xl font-display font-medium mb-2">Create an account</h1>
          <p className="text-ivory/60 mb-8">Join BidSmart to predict auction prices with 94% accuracy.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              icon={<User size={18} />}
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              icon={<Mail size={18} />}
              error={errors.email?.message}
              {...register('email')}
            />
            
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock size={18} />}
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="flex items-start gap-3 mt-4">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  className="w-4 h-4 rounded-sm border-white/10 bg-onyx-light text-emerald-mid focus:ring-emerald-mid focus:ring-offset-onyx-dark"
                  {...register('terms')}
                />
              </div>
              <div className="text-sm">
                <label htmlFor="terms" className="font-medium text-ivory/80">
                  I agree to the Terms and Conditions
                </label>
                {errors.terms && (
                  <p className="text-xs text-burgundy-bright mt-1">{errors.terms.message}</p>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full mt-6" isLoading={isSubmitting}>
              Create Account <ArrowRight size={18} className="ml-2" />
            </Button>
          </form>

          {/* Google OAuth */}
          <div className="mt-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-sm text-ivory/40">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
          <button
            onClick={() => toast.info('Google OAuth coming soon')}
            className="w-full mt-6 flex items-center justify-center gap-3 px-4 py-3 rounded-sm border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign up with Google
          </button>

          <p className="mt-8 text-center text-ivory/60">
            Already have an account?{' '}
            <Link href="/login" className="text-emerald-bright hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right side: Abstract Art/Graphic */}
      <div className="hidden md:block flex-1 bg-onyx-mid relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tl from-emerald-mid/20 to-transparent z-10" />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />
      </div>
    </div>
  );
}
