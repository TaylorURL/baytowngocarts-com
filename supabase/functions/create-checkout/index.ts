// @ts-ignore
import {serve} from 'https://deno.land/std@0.168.0/http/server.ts'
// @ts-ignore
import Stripe from 'https://esm.sh/stripe@13.10.0?target=deno'

// @ts-ignore
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
    apiVersion: '2023-10-16',
    httpClient: Stripe.createFetchHttpClient(),
})

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const PLATFORM_FEE_PERCENT = 0.01
const TRANSACTION_FEE_PERCENT = 0.04
const TEXAS_SALES_TAX_PERCENT = 0.0825
// @ts-ignore
const CONNECTED_ACCOUNT_ID = Deno.env.get('STRIPE_CONNECTED_ACCOUNT_ID') || ''

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', {headers: corsHeaders})
    }

    try {
        const {items, successUrl, cancelUrl, customerEmail, userId} = await req.json()

        let subtotal = 0
        const lineItems = []

        for (const item of items) {
            const itemPrice = parseFloat(item.price.replace('$', ''))
            const itemTotal = itemPrice * item.quantity
            subtotal += itemTotal

            lineItems.push({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name,
                        description: item.description,
                    },
                    unit_amount: Math.round(itemPrice * 100),
                },
                quantity: item.quantity,
            })
        }

        const salesTax = subtotal * TEXAS_SALES_TAX_PERCENT
        const transactionFee = (subtotal * TRANSACTION_FEE_PERCENT) + 0.30
        const platformFee = subtotal * PLATFORM_FEE_PERCENT
        const totalFees = transactionFee + platformFee

        lineItems.push({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: 'Sales Tax',
                },
                unit_amount: Math.round(salesTax * 100),
            },
            quantity: 1,
        })

        lineItems.push({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: 'Transaction Fee',
                },
                unit_amount: Math.round(totalFees * 100),
            },
            quantity: 1,
        })

        const total = subtotal + salesTax + totalFees
        const stripeProcessingFee = (total * 0.029) + 0.30
        const applicationFeeAmount = Math.round((platformFee + stripeProcessingFee) * 100)

        const sessionConfig: any = {
            line_items: lineItems,
            mode: 'payment',
            success_url: successUrl + '?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: cancelUrl,
            customer_email: customerEmail,
            metadata: {
                user_id: userId,
                platform_fee: platformFee.toFixed(2),
                transaction_fee: transactionFee.toFixed(2),
                sales_tax: salesTax.toFixed(2),
                subtotal: subtotal.toFixed(2),
            },
            payment_intent_data: {
                application_fee_amount: applicationFeeAmount,
                on_behalf_of: CONNECTED_ACCOUNT_ID,
                transfer_data: {
                    destination: CONNECTED_ACCOUNT_ID,
                },
            },
        }

        const session = await stripe.checkout.sessions.create(sessionConfig)

        return new Response(
            JSON.stringify({
                sessionId: session.id,
                url: session.url,
                subtotal: subtotal.toFixed(2),
                platformFee: platformFee.toFixed(2),
                transactionFee: transactionFee.toFixed(2),
                total: total.toFixed(2),
            }),
            {
                headers: {...corsHeaders, 'Content-Type': 'application/json'},
                status: 200,
            },
        )
    } catch (error) {
        console.error('Checkout error:', error)
        return new Response(
            JSON.stringify({
                error: error.message,
                details: error.toString(),
            }),
            {
                headers: {...corsHeaders, 'Content-Type': 'application/json'},
                status: 400,
            },
        )
    }
})
