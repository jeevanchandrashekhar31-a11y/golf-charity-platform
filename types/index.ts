export type SubscriptionStatus = 'active' | 'inactive' | 'cancelled' | 'lapsed';
export type UserRole = 'user' | 'admin';
export type DrawStatus = 'pending' | 'simulated' | 'published';
export type PaymentStatus = 'pending' | 'verified' | 'paid';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface UpcomingEvent {
  name: string;
  date: string;
  location: string;
}

export interface Charity {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
  website_url: string | null;
  category: string | null;
  is_featured: boolean;
  is_active: boolean;
  total_contributions: number;
  upcoming_events: UpcomingEvent[];
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  subscription_status: SubscriptionStatus;
  subscription_plan: 'monthly' | 'yearly' | null;
  subscription_end_date: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  selected_charity_id: string | null;
  charity_contribution_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface GolfScore {
  id: string;
  user_id: string;
  score: number;
  played_at: string;
  created_at: string;
}

export interface Draw {
  id: string;
  draw_month: string;
  draw_type: 'random' | 'algorithmic' | null;
  drawn_numbers: number[];
  status: DrawStatus;
  total_pool: number;
  jackpot_pool: number;
  match4_pool: number;
  match3_pool: number;
  jackpot_rolled_over: boolean;
  previous_jackpot: number;
  active_subscriber_count: number;
  created_at: string;
  published_at: string | null;
}

export interface DrawResult {
  id: string;
  draw_id: string;
  user_id: string;
  user_scores: number[];
  matched_numbers: number[];
  match_count: number;
  prize_amount: number;
  payment_status: PaymentStatus;
  proof_url: string | null;
  verified_at: string | null;
  paid_at: string | null;
  created_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  stripe_payment_intent_id: string | null;
  stripe_subscription_id: string | null;
  amount: number;
  plan: 'monthly' | 'yearly' | null;
  status: string;
  prize_pool_contribution: number | null;
  charity_contribution: number | null;
  created_at: string;
}

export interface DrawWinner {
  userId: string;
  matchedNumbers: number[];
  prize: number;
}

export interface DrawSimulationResult {
  drawnNumbers: number[];
  winners5: DrawWinner[];
  winners4: DrawWinner[];
  winners3: DrawWinner[];
  jackpotRolledOver: boolean;
  pools: {
    jackpot: number;
    match4: number;
    match3: number;
    total: number;
  };
  // Convenience helpers used by DrawControl UI
  prizePool: number;
  jackpotRollover: number;
  results: Array<{
    userId: string;
    matchedNumbers: number[];
    matchCount: number;
    prizeAmount: number;
  }>;
  tierWinners: { match5: number; match4: number; match3: number };
  payoutPerWinner: { match5: number; match4: number; match3: number };
}

