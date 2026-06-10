'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Mail, ArrowLeft, ArrowRight } from 'lucide-react';

import { apiClient } from '@/lib/api/client';
import { Input } from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsSubmitting(true);
    try {
      await apiClient.post('/auth/forgot-password', data);
      setIsSubmitted(true);
      toast.success('Password reset email sent');
    } catch (err: any) {
      toast.error(err.message || 'Failed to send password reset email');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-onyx-dark text-ivory relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-mid/10 to-transparent pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10">
        <Link href="/login" className="inline-flex items-center text-sm text-ivory/60 hover:text-ivory mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Back to login
        </Link>

        <div className="bg-onyx-mid border border-white/10 rounded-sm p-8 shadow-2xl">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-sm bg-emerald-mid flex items-center justify-center">
              <span className="font-display font-bold text-ivory text-xl leading-none">B</span>
            </div>
            <span className="font-display font-medium text-xl tracking-wide">BidSmart</span>
          </div>

          <h1 className="text-2xl font-display font-medium mb-2">Reset Password</h1>
          
          {isSubmitted ? (
            <div className="bg-emerald-mid/10 border border-emerald-mid/20 rounded-sm p-4 text-emerald-bright">
              <p>Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.</p>
            </div>
          ) : (
            <>
              <p className="text-ivory/60 mb-6 text-sm">Enter the email address associated with your account and we'll send you a link to reset your password.</p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  icon={<Mail size={18} />}
                  error={errors.email?.message}
                  {...register('email')}
                />
                
                <Button type="submit" className="w-full mt-2" isLoading={isSubmitting}>
                  Send Reset Link <ArrowRight size={18} className="ml-2" />
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
