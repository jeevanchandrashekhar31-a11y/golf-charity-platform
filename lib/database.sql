-- ==============================================================================
-- GOLF CHARITY SUBSCRIPTION PLATFORM - DATABASE SCHEMA
-- ==============================================================================

-- ==========================================
-- TABLES
-- ==========================================

CREATE TABLE public.charities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  logo_url text,
  banner_url text,
  website_url text,
  category text,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  total_contributions numeric DEFAULT 0,
  upcoming_events jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  avatar_url text,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user','admin')),
  subscription_status text NOT NULL DEFAULT 'inactive' CHECK (subscription_status IN ('active','inactive','cancelled','lapsed')),
  subscription_plan text CHECK (subscription_plan IN ('monthly','yearly')),
  subscription_end_date timestamptz,
  stripe_customer_id text UNIQUE,
  stripe_subscription_id text UNIQUE,
  selected_charity_id uuid REFERENCES public.charities(id) ON DELETE SET NULL,
  charity_contribution_percentage integer NOT NULL DEFAULT 10 CHECK (charity_contribution_percentage >= 10 AND charity_contribution_percentage <= 100),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE public.golf_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  score integer NOT NULL CHECK (score >= 1 AND score <= 45),
  played_at date NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.draws (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  draw_month text NOT NULL,
  draw_type text CHECK (draw_type IN ('random','algorithmic')),
  drawn_numbers integer[] NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending','simulated','published')),
  total_pool numeric DEFAULT 0,
  jackpot_pool numeric DEFAULT 0,
  match4_pool numeric DEFAULT 0,
  match3_pool numeric DEFAULT 0,
  jackpot_rolled_over boolean DEFAULT false,
  previous_jackpot numeric DEFAULT 0,
  active_subscriber_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  published_at timestamptz
);

CREATE TABLE public.draw_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  draw_id uuid NOT NULL REFERENCES public.draws(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_scores integer[] NOT NULL,
  matched_numbers integer[] NOT NULL,
  match_count integer NOT NULL CHECK (match_count IN (3,4,5)),
  prize_amount numeric DEFAULT 0,
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending','verified','paid')),
  proof_url text,
  verified_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  stripe_payment_intent_id text UNIQUE,
  stripe_subscription_id text,
  amount integer NOT NULL,
  plan text CHECK (plan IN ('monthly','yearly')),
  status text DEFAULT 'pending',
  prize_pool_contribution integer,
  charity_contribution integer,
  created_at timestamptz DEFAULT now()
);

-- ==========================================
-- TRIGGERS
-- ==========================================

-- 1. Auto-create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Rolling 5-score limit — delete oldest when 6th is added
CREATE OR REPLACE FUNCTION public.enforce_score_limit()
RETURNS trigger AS $$
BEGIN
  IF (SELECT COUNT(*) FROM public.golf_scores WHERE user_id = NEW.user_id) > 5 THEN
    DELETE FROM public.golf_scores
    WHERE id = (
      SELECT id FROM public.golf_scores
      WHERE user_id = NEW.user_id
      ORDER BY played_at ASC, created_at ASC
      LIMIT 1
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER enforce_golf_score_limit
  AFTER INSERT ON public.golf_scores
  FOR EACH ROW EXECUTE FUNCTION public.enforce_score_limit();

-- 3. Auto-update updated_at on profiles
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.golf_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draws ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draw_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Charities (public read)
CREATE POLICY "Anyone can view active charities" ON public.charities FOR SELECT USING (is_active = true);

-- Golf scores
CREATE POLICY "Users can manage own scores" ON public.golf_scores FOR ALL USING (auth.uid() = user_id);

-- Draws (published ones visible to all logged in users)
CREATE POLICY "Users can view published draws" ON public.draws FOR SELECT USING (status = 'published' AND auth.uid() IS NOT NULL);

-- Draw results
CREATE POLICY "Users can view own results" ON public.draw_results FOR SELECT USING (auth.uid() = user_id);

-- Payments
CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);

-- ==========================================
-- HELPER FUNCTIONS
-- ==========================================

CREATE OR REPLACE FUNCTION public.get_active_subscriber_count()
RETURNS bigint AS $$
  SELECT COUNT(*) FROM public.profiles WHERE subscription_status = 'active';
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_rolled_over_jackpot()
RETURNS numeric AS $$
  SELECT COALESCE(jackpot_pool, 0)
  FROM public.draws
  WHERE jackpot_rolled_over = true
  ORDER BY created_at DESC
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;
