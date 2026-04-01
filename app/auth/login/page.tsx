'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [serverError, setServerError] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const router = useRouter();
  const supabase = createBrowserClient();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setServerError('');
    
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setServerError('Invalid email or password.');
      return;
    }

    if (authData.user) {
      // Fetch profile to dictate redirect
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, subscription_status')
        .eq('id', authData.user.id)
        .single();

      if (profile?.role === 'admin') {
        router.push('/admin');
      } else if (profile?.subscription_status === 'active') {
        router.push('/dashboard');
      } else {
        router.push('/subscribe');
      }
    }
  };

  const handleResetPassword = async () => {
    const email = getValues('email');
    if (!email || errors.email) {
      setServerError('Please enter a valid email address first to reset password.');
      return;
    }

    setIsResetting(true);
    setServerError('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
    });
    setIsResetting(false);

    if (error) {
      setServerError(error.message);
    } else {
      toast.success('Password reset email sent!');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex flex-col justify-center items-center p-6 text-[#F8FAFC]">
      <Link href="/" className="mb-8 font-syne font-bold text-3xl tracking-tight flex items-center gap-2">
        GreenPrize <div className="w-2 h-2 rounded-full bg-[#10B981] mb-1" />
      </Link>

      <div className="bg-[#111827] border border-white/5 p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <h2 className="font-syne text-2xl font-bold mb-6 text-center">Welcome back</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {serverError && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm">
              {serverError}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white/70">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              className="bg-[#0A0A0F] border-white/10 text-white focus-visible:ring-[#10B981]"
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password" className="text-white/70">Password</Label>
              <button 
                type="button" 
                onClick={handleResetPassword}
                disabled={isResetting}
                className="text-xs text-[#10B981] hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <Input
              id="password"
              type="password"
              {...register('password')}
              className="bg-[#0A0A0F] border-white/10 text-white focus-visible:ring-[#10B981]"
            />
            {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#10B981] hover:bg-[#10B981]/90 text-white font-semibold h-11 mt-6"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Log In'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-white/50">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="text-[#10B981] hover:underline">
            Sign up here
          </Link>
        </div>
      </div>
    </div>
  );
}
