'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const signupSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters').regex(/\d/, 'Password must contain at least 1 number'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);
  const supabase = createBrowserClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormValues) => {
    setServerError('');
    setSuccess(false);

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    });

    if (error) {
      setServerError(error.message);
    } else {
      setSuccess(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex flex-col justify-center items-center p-6 text-[#F8FAFC]">
      <Link href="/" className="mb-8 font-syne font-bold text-3xl tracking-tight flex items-center gap-2">
        GreenPrize <div className="w-2 h-2 rounded-full bg-[#10B981] mb-1" />
      </Link>

      <div className="bg-[#111827] border border-white/5 p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <h2 className="font-syne text-2xl font-bold mb-6 text-center">Create your account</h2>

        {success ? (
          <div className="bg-[#10B981]/10 border border-[#10B981]/30 p-4 rounded-xl text-center">
            <h3 className="text-[#10B981] font-bold mb-2">Check your email</h3>
            <p className="text-sm text-white/70">We&apos;ve sent a confirmation link to your email. Please click it to verify your account.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {serverError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm">
                {serverError}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-white/70">Full Name</Label>
              <Input
                id="fullName"
                {...register('fullName')}
                className="bg-[#0A0A0F] border-white/10 text-white focus-visible:ring-[#10B981]"
                placeholder="John Doe"
              />
              {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName.message}</p>}
            </div>

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
              <Label htmlFor="password" className="text-white/70">Password</Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                className="bg-[#0A0A0F] border-white/10 text-white focus-visible:ring-[#10B981]"
              />
              {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white/70">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword')}
                className="bg-[#0A0A0F] border-white/10 text-white focus-visible:ring-[#10B981]"
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#10B981] hover:bg-[#10B981]/90 text-white font-semibold h-11 mt-6"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign Up'}
            </Button>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-white/50">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-[#10B981] hover:underline">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
}
