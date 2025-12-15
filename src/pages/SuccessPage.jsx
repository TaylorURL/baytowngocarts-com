import React, {useEffect, useRef, useState} from 'react';
import {Link, useSearchParams} from 'react-router-dom';
import {ArrowRight, CheckCircle, ShoppingBag} from 'lucide-react';
import Button from '../components/common/Button';
import {useAuth} from '../hooks/useAuth';
import {supabase} from '../lib/supabase';
import {useCart} from '../hooks/useCart';

const SuccessPage = () => {
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const {user} = useAuth();
    const {clearCart} = useCart();
    const purchaseAttempted = useRef(false);

    useEffect(() => {
        const createPurchase = async () => {
            const sessionId = searchParams.get('session_id');

            if (!sessionId || !user) {
                setLoading(false);
                return;
            }

            if (purchaseAttempted.current) {
                return;
            }
            purchaseAttempted.current = true;

            try {
                const {data: existingPurchase} = await supabase
                    .from('purchases')
                    .select('id')
                    .eq('stripe_session_id', sessionId)
                    .limit(1);

                if (existingPurchase && existingPurchase.length > 0) {
                    console.log('Purchase already exists');
                    localStorage.removeItem('pendingPurchase');
                    clearCart();
                    setLoading(false);
                    return;
                }

                const pendingPurchaseStr = localStorage.getItem('pendingPurchase');
                if (!pendingPurchaseStr) {
                    console.log('No pending purchase data found');
                    setLoading(false);
                    return;
                }

                const pendingPurchase = JSON.parse(pendingPurchaseStr);
                const orderNumber = `SPW146-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

                const purchaseData = {
                    user_id: user.id,
                    order_number: orderNumber,
                    items: pendingPurchase.items.map(item => ({
                        product_name: item.name,
                        price: Math.round(parseFloat(item.price.replace('$', '')) * 100),
                        quantity: item.quantity,
                        subtotal: Math.round(parseFloat(item.price.replace('$', '')) * 100) * item.quantity
                    })),
                    total_amount: Math.round(pendingPurchase.total * 100),
                    total_quantity: pendingPurchase.totalQuantity,
                    status: 'completed',
                    stripe_session_id: sessionId,
                    customer_email: user.email
                };

                const {error} = await supabase
                    .from('purchases')
                    .insert(purchaseData);

                if (error) {
                    if (error.code === '23505') {
                        console.log('Purchase already exists (unique constraint)');
                    } else {
                        console.error('Error creating purchase:', error);
                    }
                } else {
                    console.log('Purchase created successfully');
                }

                localStorage.removeItem('pendingPurchase');
                clearCart();
            } catch (error) {
                console.error('Error in createPurchase:', error);
            }

            setLoading(false);
        };

        createPurchase();
    }, [searchParams, user]);

    if (loading) {
        return (
            <div
                className="min-h-screen bg-gradient-to-br from-navy-900 via-red-900 to-navy-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-white text-lg">Processing your payment...</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-navy-900 via-red-900 to-navy-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-lg shadow-xl p-8 text-center">
                    <div className="mb-6">
                        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4"/>
                        <h1 className="text-2xl font-bold text-navy-900 mb-2">Payment Successful!</h1>
                        <p className="text-gray-600">
                            Thank you for your purchase! Your order has been confirmed.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-green-900 mb-2">What's Next?</h3>
                            <ul className="text-green-700 text-sm space-y-1 text-left">
                                <li>• Check your email for order confirmation</li>
                                <li>• View your order details in My Purchases</li>
                                <li>• Visit us during business hours</li>
                                <li>• Bring a valid ID and completed waiver</li>
                            </ul>
                        </div>

                        <div className="flex flex-col space-y-3">
                            <Link to="/dashboard">
                                <button
                                    className="w-full inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105">
                                    <ShoppingBag className="h-5 w-5 mr-2"/>
                                    View My Purchases
                                    <ArrowRight className="h-5 w-5 ml-2"/>
                                </button>
                            </Link>

                            <Link to="/">
                                <Button variant="outline" fullWidth>
                                    Return to Home
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuccessPage;