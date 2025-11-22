// Supabase Edge Function: createCheckout
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
const STRIPE_PRICE_ID_YEARLY = Deno.env.get("STRIPE_PRICE_ID_YEARLY")!;
const CHECKOUT_SUCCESS_URL = Deno.env.get("CHECKOUT_SUCCESS_URL")!;
const CHECKOUT_CANCEL_URL = Deno.env.get("CHECKOUT_CANCEL_URL")!;

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20" as any
});

serve(async (req) => {
  // CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, content-type"
      }
    });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      global: {
        headers: {
          Authorization: req.headers.get("Authorization")!
        }
      }
    });

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Not authenticated" }),
        { status: 401 }
      );
    }

    // Ensure profile exists / get stripe_customer_id
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, stripe_customer_id")
      .eq("id", user.id)
      .maybeSingle();

    let customerId = profile?.stripe_customer_id ?? null;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        metadata: { supabase_user_id: user.id }
      });
      customerId = customer.id;

      await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          stripe_customer_id: customerId
        });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer: customerId,
      line_items: [
        {
          price: STRIPE_PRICE_ID_YEARLY,
          quantity: 1
        }
      ],
      success_url: CHECKOUT_SUCCESS_URL + "?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: CHECKOUT_CANCEL_URL,
      metadata: {
        supabase_user_id: user.id
      }
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (err) {
    console.error("createCheckout error", err);
    return new Response(
      JSON.stringify({ error: "Failed to create checkout" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
});
