import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('Stripe-Signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing Stripe signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
  }

  const supabase = createAdminClient();

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as any;
        
        let userId = subscription.metadata?.userId;
        
        if (!userId) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('stripe_customer_id', subscription.customer as string)
            .single();
            
          if (profile) userId = profile.id;
        }

        if (userId) {
          await supabase
            .from('profiles')
            .update({
              subscription_status: subscription.status === 'active' || subscription.status === 'trialing' ? 'active' : 'inactive',
              subscription_plan: subscription.metadata?.plan || null,
              subscription_end_date: new Date(subscription.current_period_end * 1000).toISOString(),
              stripe_subscription_id: subscription.id,
            })
            .eq('id', userId);
        }
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        await supabase
          .from('profiles')
          .update({
            subscription_status: 'cancelled',
            subscription_end_date: new Date(subscription.current_period_end * 1000).toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as any;
        
        if (invoice.subscription) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('id, charity_contribution_percentage, subscription_plan')
            .eq('stripe_customer_id', invoice.customer as string)
            .single();

          if (profile) {
            const amount = invoice.amount_paid; // pence
            const prizePoolContribution = Math.floor(amount * 0.30);
            const charityContribution = Math.floor(amount * (profile.charity_contribution_percentage / 100));

            await supabase
              .from('payments')
              .insert({
                user_id: profile.id,
                stripe_payment_intent_id: invoice.payment_intent as string | null,
                stripe_subscription_id: invoice.subscription as string,
                amount: amount,
                plan: profile.subscription_plan as 'monthly' | 'yearly',
                status: 'paid',
                prize_pool_contribution: prizePoolContribution,
                charity_contribution: charityContribution,
              });
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as any;
        if (invoice.subscription) {
          await supabase
            .from('profiles')
            .update({ subscription_status: 'lapsed' })
            .eq('stripe_subscription_id', invoice.subscription as string);
        }
        break;
      }

      case 'checkout.session.completed': {
        const session = event.data.object as any;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan;

        if (userId && session.subscription) {
          await supabase
            .from('profiles')
            .update({
              subscription_status: 'active',
              subscription_plan: plan || null,
              stripe_subscription_id: session.subscription as string,
            })
            .eq('id', userId);
        }
        break;
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error: any) {
    console.error('Webhook handling error:', error);
    return NextResponse.json({ error: 'Webhook Processing Error' }, { status: 500 });
  }
}
