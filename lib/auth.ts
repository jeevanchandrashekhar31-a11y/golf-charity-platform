import { createServerClient } from './supabase'
import { redirect } from 'next/navigation'
import { Profile } from '@/types'
import { User } from '@supabase/supabase-js'

export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const user = await getCurrentUser()
  if (!user) return null

  const supabase = await createServerClient()
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return data as Profile
}

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/auth/login')
  }
  return user
}

export async function requireAdmin(): Promise<Profile> {
  const profile = await getCurrentProfile()
  if (!profile || profile.role !== 'admin') {
    redirect('/dashboard')
  }
  return profile
}

export async function requireActiveSubscription(): Promise<Profile> {
  const profile = await getCurrentProfile()
  if (!profile) {
    redirect('/auth/login')
  }
  if (profile.subscription_status !== 'active') {
    redirect('/subscribe')
  }
  return profile
}
