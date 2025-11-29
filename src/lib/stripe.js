import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const redirectToCheckout = async (product, userEmail) => {
  try {
    const stripe = await stripePromise;
    
    const successUrl = `${window.location.origin}/success?product_id=${product.id}&product_name=${encodeURIComponent(product.name)}&amount=${Math.round(parseFloat(product.price.replace('$', '')) * 100)}`;
    
    const response = await fetch('https://ggkqadmnvrjsewnazdxj.supabase.co/functions/v1/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        priceId: product.priceId,
        successUrl: successUrl,
        cancelUrl: `${window.location.origin}/pricing`,
        customerEmail: userEmail,
      }),
    });

    const { sessionId, url } = await response.json();
    
    if (url) {
      window.location.href = url;
    } else if (sessionId) {
      const result = await stripe.redirectToCheckout({ sessionId });
      if (result.error) {
        throw result.error;
      }
    } else {
      throw new Error('No checkout URL returned');
    }
    
  } catch (error) {
    console.error('Checkout error:', error);
    alert('Unable to proceed to checkout. Please contact support at (346) 932-1266');
  }
};



