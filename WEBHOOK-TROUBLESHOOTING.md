# 🚨 WEBHOOK NOT PROCESSING - TROUBLESHOOTING GUIDE

## The Problem
The success page shows "Purchase not found yet, webhook may still be processing" which means the Stripe webhook is NOT creating the purchase record in the database.

## Root Causes (Most Likely → Least Likely)

### 1. ❌ Webhook Not Configured in Stripe
**Most Common Issue**

The webhook endpoint is not set up in your Stripe Dashboard.

**HOW TO FIX:**

1. Go to: https://dashboard.stripe.com/test/webhooks
2. Click "Add endpoint"
3. Enter URL: `https://ggkqadmnvrjsewnazdxj.supabase.co/functions/v1/stripe-webhook`
4. Select events to listen to: `checkout.session.completed`
5. Click "Add endpoint"
6. Copy the "Signing secret" (starts with `whsec_`)
7. Update your Supabase Edge Function secrets with the NEW signing secret

---

### 2. ❌ Webhook Function Not Deployed

**HOW TO FIX:**

```bash
cd /Users/trentontaylor/WebstormProjects/speedway-146
supabase functions deploy stripe-webhook
```

---

### 3. ❌ Missing Supabase Environment Secrets

**HOW TO CHECK:**

1. Go to Supabase Dashboard → Project Settings → Edge Functions
2. Verify these secrets are set:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET` 
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

**HOW TO SET SECRETS:**

```bash
supabase secrets set STRIPE_SECRET_KEY=sk_test_51Sdz91DoUeruQHleBz7XwnM8k3hBYmDPWa27GJWtD6dQg4Ui7qXx5s6Kaxt83e38NSj6NArVpO4Hxm8HtCkx8DpI00w619K2UF

supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_YOUR_NEW_SIGNING_SECRET_HERE

supabase secrets set SUPABASE_URL=https://ggkqadmnvrjsewnazdxj.supabase.co

supabase secrets set SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY_HERE
```

---

### 4. ❌ RLS Policies Blocking Insert

**HOW TO FIX:**

Run this SQL in Supabase SQL Editor:

```sql
-- Ensure service role can insert purchases
DROP POLICY IF EXISTS "Service role can manage all purchases" ON purchases;

CREATE POLICY "Service role can manage all purchases"
  ON purchases
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
```

---

## 🔍 HOW TO DEBUG

### Step 1: Check Webhook Logs

1. Go to Supabase Dashboard
2. Click "Edge Functions" 
3. Click "stripe-webhook"
4. Click "Logs" tab
5. Make a test purchase
6. Watch for logs - you should see emoji logs like:
   - 🎯 Webhook received!
   - ✅ Event verified: checkout.session.completed
   - 💾 Saving purchase to database...
   - ✅ Purchase saved successfully!

If you see NO logs, the webhook isn't being called by Stripe.

### Step 2: Test Webhook Manually

Use Stripe CLI to trigger test events:

```bash
stripe listen --forward-to https://ggkqadmnvrjsewnazdxj.supabase.co/functions/v1/stripe-webhook

# In another terminal:
stripe trigger checkout.session.completed
```

### Step 3: Check Stripe Dashboard

1. Go to: https://dashboard.stripe.com/test/webhooks
2. Click on your webhook endpoint
3. Look at "Recent Deliveries"
4. You should see attempts with status codes:
   - ✅ 200 = Success
   - ❌ 400/500 = Error (click to see details)

---

## ⚡ QUICK FIX (Most Likely Solution)

The webhook is probably just not configured in Stripe. Do this:

1. **Deploy the updated webhook** (with better logging):
   ```bash
   cd /Users/trentontaylor/WebstormProjects/speedway-146
   supabase functions deploy stripe-webhook
   ```

2. **Add webhook endpoint in Stripe**:
   - URL: `https://ggkqadmnvrjsewnazdxj.supabase.co/functions/v1/stripe-webhook`
   - Event: `checkout.session.completed`

3. **Update webhook secret**:
   ```bash
   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_YOUR_NEW_SECRET
   ```

4. **Test a purchase** and check the logs

---

## 📝 What Should Happen

When working correctly:

1. User completes Stripe checkout
2. Stripe sends `checkout.session.completed` event to your webhook
3. Webhook logs show processing (with emoji logs)
4. Webhook creates purchase in `purchases` table
5. User sees purchase in "My Purchases"
6. Staff sees order in "Staff Panel"

---

## 🆘 Still Not Working?

Check the Supabase Edge Function logs for the exact error message. The updated webhook now has detailed logging that will show exactly where it's failing.
