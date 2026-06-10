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
