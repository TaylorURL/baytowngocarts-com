import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, ShoppingBag, ArrowRight, Bug } from 'lucide-react';
import Button from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

const SuccessPage = () => {
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const isDebug = searchParams.get('debug') === 'true';

  useEffect(() => {
    const recordPurchase = async () => {
      const sessionId = searchParams.get('session_id');
      const isDebugMode = searchParams.get('debug') === 'true';
      const isCartCheckout = searchParams.get('cart_checkout') === 'true';
      
      if (isDebugMode) {
        console.log('Debug mode - purchase already recorded');
        const timer = setTimeout(() => {
          setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
      }
      
      if (isCartCheckout && user) {
        try {
          const cartItemsJson = sessionStorage.getItem('pendingCartItems');
          if (cartItemsJson) {
            const cartItems = JSON.parse(cartItemsJson);
            
            const orderNumber = `SPW146-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
            
            const items = cartItems.map(item => ({
              product_id: item.product.id,
              product_name: item.product.name,
              price: Math.round(parseFloat(item.product.price.replace('$', '')) * 100),
              quantity: item.quantity,
              subtotal: Math.round(parseFloat(item.product.price.replace('$', '')) * 100) * item.quantity
            }));
            
            const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);
            const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

            const { error } = await supabase
              .from('purchases')
              .insert({
                user_id: user.id,
                order_number: orderNumber,
                items: items,
                total_amount: totalAmount,
                total_quantity: totalQuantity,
                status: 'completed',
                stripe_session_id: `cart_${Date.now()}`
              });

            if (error) {
              console.error('Error recording cart purchases:', error);
            } else {
              sessionStorage.removeItem('pendingCartItems');
            }
          }
        } catch (error) {
          console.error('Error processing cart checkout:', error);
        }
      } else if (sessionId && user) {
        try {
          const amount = searchParams.get('amount');
          const productName = searchParams.get('product_name');
          const productId = searchParams.get('product_id');
          const quantity = parseInt(searchParams.get('quantity') || '1');
          
          if (amount && productName && productId) {
            const orderNumber = `SPW146-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
            
            const items = [{
              product_id: productId,
              product_name: productName,
              price: parseInt(amount),
              quantity: quantity,
              subtotal: parseInt(amount) * quantity
            }];
            
            const { error } = await supabase
              .from('purchases')
              .insert({
                user_id: user.id,
                order_number: orderNumber,
                items: items,
                total_amount: parseInt(amount) * quantity,
                total_quantity: quantity,
                status: 'completed',
                stripe_session_id: sessionId
              });
            
            if (error) {
              console.error('Error recording purchase:', error);
            }
          }
        } catch (error) {
          console.error('Error recording purchase:', error);
        }
      }

      const timer = setTimeout(() => {
        setLoading(false);
      }, 1500);

      return () => clearTimeout(timer);
    };

    recordPurchase();
  }, [searchParams, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-900 via-red-900 to-navy-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Processing your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-red-900 to-navy-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {isDebug && (
          <div className="mb-4 bg-yellow-500 text-yellow-900 px-4 py-2 rounded-lg text-center font-bold flex items-center justify-center gap-2">
            <Bug className="h-5 w-5" />
            DEBUG MODE - Test Purchase Created
          </div>
        )}
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
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
                <button className="w-full inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105">
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  View My Purchases
                  <ArrowRight className="h-5 w-5 ml-2" />
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