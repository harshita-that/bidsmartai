'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { User, Mail, Save } from 'lucide-react';

import { useAuthStore } from '@/lib/store/auth';
import { apiClient } from '@/lib/api/client';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Input } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function SettingsPage() {
  const { user, checkAuth } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);
    try {
      await apiClient.put('/user/profile', { name: data.name });
      await checkAuth(); // refresh user data in store
      toast.success('Profile updated successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <h1 className="text-3xl font-display font-medium text-ivory mb-8">
          Settings
        </h1>

        <div className="bg-onyx-mid border border-white/10 rounded-sm overflow-hidden mb-8">
          <div className="p-6 md:p-8 border-b border-white/10">
            <h2 className="text-xl font-medium mb-1">Profile Information</h2>
            <p className="text-sm text-ivory/60">Update your account details.</p>
          </div>

          <div className="p-6 md:p-8">
            <div className="flex items-center gap-6 mb-8">
              <Avatar 
                src={user?.avatarUrl} 
                initials={user?.name?.charAt(0).toUpperCase()} 
                size="xl" 
              />
              <div>
                <Button variant="ghost" size="sm">
                  Change Avatar
                </Button>
                <p className="text-xs text-ivory/40 mt-2">
                  JPG, GIF or PNG. 1MB max.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md">
              <Input
                label="Full Name"
                icon={<User size={18} />}
                error={errors.name?.message}
                {...register('name')}
              />
              <Input
                label="Email Address"
                icon={<Mail size={18} />}
                disabled // Email change not supported in MVP
                error={errors.email?.message}
                {...register('email')}
              />
              
              <div className="pt-4 flex justify-end">
                <Button 
                  type="submit" 
                  disabled={!isDirty || isSubmitting}
                  isLoading={isSubmitting}
                >
                  <Save size={18} className="mr-2" /> Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>

        <div className="bg-onyx-mid border border-white/10 rounded-sm overflow-hidden">
          <div className="p-6 md:p-8 border-b border-white/10">
            <h2 className="text-xl font-medium text-burgundy-bright">Danger Zone</h2>
          </div>
          <div className="p-6 md:p-8">
            <p className="text-sm text-ivory/60 mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <Button variant="danger">
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
