'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Lock, ArrowRight } from 'lucide-react';

import { apiClient } from '@/lib/api/client';
import { Input } from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setIsSubmitting(true);
    try {
      await apiClient.post('/auth/reset-password', {
        token: params.token,
        password: data.password,
      });
      toast.success('Password successfully reset');
      router.push('/login');
    } catch (err: any) {
      toast.error(err.message || 'Failed to reset password. The link might be expired.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-onyx-dark text-ivory relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-mid/10 to-transparent pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="bg-onyx-mid border border-white/10 rounded-sm p-8 shadow-2xl">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-sm bg-emerald-mid flex items-center justify-center">
              <span className="font-display font-bold text-ivory text-xl leading-none">B</span>
            </div>
            <span className="font-display font-medium text-xl tracking-wide">BidSmart</span>
          </div>

          <h1 className="text-2xl font-display font-medium mb-2">Create new password</h1>
          <p className="text-ivory/60 mb-6 text-sm">Please enter your new password below.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock size={18} />}
              error={errors.password?.message}
              {...register('password')}
            />

            <Input
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock size={18} />}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
            
            <Button type="submit" className="w-full mt-6" isLoading={isSubmitting}>
              Reset Password <ArrowRight size={18} className="ml-2" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
