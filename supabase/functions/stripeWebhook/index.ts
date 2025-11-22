// supabase/functions/stripeWebhook/index.ts
/// <reference path="../deno.d.ts" />

// @ts-expect-error - Deno HTTP imports work at runtime
import { serve } from "https://deno.land/std@0.182.0/http/server.ts";
// @ts-expect-error - Deno HTTP imports work at runtime
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
// @ts-expect-error - Deno HTTP imports work at runtime
import Stripe from "https://esm.sh/stripe@16.6.0?target=deno";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY")!;
const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY")!;
const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;
const STRIPE_PRICE_ID_YEARLY = Deno.env.get("STRIPE_PRICE_ID_YEARLY")!;

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20" as any
});

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

serve(async (req) => {
  const body = await req.text();
  const sig = req.headers.get("Stripe-Signature") || "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature error", err);
    return new Response("Invalid signature", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.supabase_user_id as string | undefined;
        const subscriptionId = session.subscription as string | null;
        const customerId = session.customer as string | null;

        if (userId) {
          // Give 1 year adult access from now
          const oneYearFromNow = new Date();
          oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

          await supabase
            .from("profiles")
            .upsert({
              id: userId,
              stripe_customer_id: customerId || undefined,
              subscription_status: "active",
              adult_access_until: oneYearFromNow.toISOString()
            });

          if (subscriptionId) {
            await supabase.from("user_subscriptions").insert({
              user_id: userId,
              stripe_subscription_id: subscriptionId,
              stripe_price_id: STRIPE_PRICE_ID_YEARLY,
              status: "active"
            });
          }
        }
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;
        const status = sub.status;

        // Find user by stripe_customer_id
        const { data: profiles, error } = await supabase
          .from("profiles")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .limit(1);

        if (error) {
          console.error("Error finding profile for customer", error);
          break;
        }

        const userId = profiles?.[0]?.id;
        if (userId) {
          const adult_access_until =
            status === "active" && sub.current_period_end
              ? new Date(sub.current_period_end * 1000).toISOString()
              : null;

          await supabase
            .from("profiles")
            .update({
              subscription_status: status,
              adult_access_until
            })
            .eq("id", userId);
        }
        break;
      }

      default:
        // Ignore other events
        break;
    }

    return new Response("ok", { status: 200 });
  } catch (err) {
    console.error("Webhook processing error", err);
    return new Response("Webhook error", { status: 500 });
  }
});
