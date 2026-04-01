import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(pence: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(pence / 100)
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'd MMMM yyyy')
}

export function getMonthKey(date?: Date): string {
  const d = date ? new Date(date) : new Date()
  return format(d, 'yyyy-MM')
}

export function getScoreColor(score: number): string {
  if (score >= 35 && score <= 45) return 'text-emerald-500 bg-emerald-500/10'
  if (score >= 25 && score <= 34) return 'text-blue-500 bg-blue-500/10'
  if (score >= 15 && score <= 24) return 'text-amber-500 bg-amber-500/10'
  return 'text-red-500 bg-red-500/10'
}

export function getScoreLabel(score: number): string {
  if (score >= 35 && score <= 45) return 'Excellent'
  if (score >= 25 && score <= 34) return 'Good'
  if (score >= 15 && score <= 24) return 'Average'
  return 'Poor'
}

export function getInitials(name: string): string {
  if (!name) return ''
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}
