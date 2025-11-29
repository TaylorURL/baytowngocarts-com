import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, CreditCard, Bug } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useAdmin } from '../hooks/useAdmin';
import { supabase } from '../lib/supabase';

export default function CartPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasPermission } = useAdmin();
  const { items, updateQuantity, removeItem, getTotal, getTotalItems, clearCart } = useCart();

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (items.length === 0) {
      return;
    }

    try {
      sessionStorage.setItem('pendingCartItems', JSON.stringify(items));
      
      const totalAmount = Math.round(getTotal() * 100);
      const totalItems = getTotalItems();
      const productNames = items.map(item => `${item.product.name} (x${item.quantity})`).join(', ');
      
      clearCart();
      
      navigate(`/success?cart_checkout=true&amount=${totalAmount}&product_name=${encodeURIComponent(productNames)}&quantity=${totalItems}`);
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Unable to process checkout. Please try again.');
    }
  };

  const handleDebugCheckout = async () => {
    if (!user) {
      alert('You must be logged in to use debug mode');
      return;
    }

    if (items.length === 0) {
      alert('Cart is empty');
      return;
    }

    try {
      const orderNumber = `SPW146-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
      
      const orderItems = items.map(item => ({
        product_id: item.product.id,
        product_name: item.product.name,
        price: Math.round(parseFloat(item.product.price.replace('$', '')) * 100),
        quantity: item.quantity,
        subtotal: Math.round(parseFloat(item.product.price.replace('$', '')) * 100) * item.quantity
      }));
      
      const totalAmount = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
      const totalQuantity = orderItems.reduce((sum, item) => sum + item.quantity, 0);

      const { error } = await supabase
        .from('purchases')
        .insert({
          user_id: user.id,
          order_number: orderNumber,
          items: orderItems,
          total_amount: totalAmount,
          total_quantity: totalQuantity,
          status: 'completed',
          stripe_session_id: `debug_${Date.now()}`
        });

      if (error) {
        console.error('Error creating debug purchases:', error);
        alert('Error creating debug purchases. Check console.');
        return;
      }

      clearCart();
      
      const firstItem = items[0];
      const amount = Math.round(parseFloat(firstItem.product.price.replace('$', '')) * 100);
      navigate(`/success?product_id=${firstItem.product.id}&product_name=${encodeURIComponent(firstItem.product.name)}&amount=${amount * firstItem.quantity}&quantity=${firstItem.quantity}&debug=true`);
    } catch (error) {
      console.error('Debug checkout error:', error);
      alert('Error in debug mode. Check console.');
    }
  };

  if (items.length === 0) {
    return (
      <div className="w-full -mt-20">
        <section className="relative bg-navy-900 overflow-hidden pt-32 pb-20 min-h-screen flex items-center">
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30"
              style={{ backgroundImage: 'url(/images/3.jpg)' }}
            />
          </div>
          
          <div 
            className="absolute inset-0 z-5 opacity-10" 
            style={{
              backgroundImage: 'linear-gradient(45deg, var(--color-black) 25%, transparent 25%), linear-gradient(-45deg, var(--color-black) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--color-black) 75%), linear-gradient(-45deg, transparent 75%, var(--color-black) 75%)',
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
            }}
          />

          <div className="relative z-10 container mx-auto px-4 text-center">
            <ShoppingCart className="h-20 w-20 text-gray-600 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-white mb-4">Your Cart is Empty</h1>
            <p className="text-gray-300 text-xl mb-8">Add some racing packages to get started!</p>
            <button
              onClick={() => navigate('/pricing')}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
            >
              Browse Packages
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full -mt-20">
      <section className="relative bg-navy-900 overflow-hidden pt-32 pb-20 min-h-[40vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: 'url(/images/3.jpg)' }}
          />
        </div>
        
        <div 
          className="absolute inset-0 z-5 opacity-10" 
          style={{
            backgroundImage: 'linear-gradient(45deg, var(--color-black) 25%, transparent 25%), linear-gradient(-45deg, var(--color-black) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--color-black) 75%), linear-gradient(-45deg, transparent 75%, var(--color-black) 75%)',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
          }}
        />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6 px-4 py-2 bg-red-600 text-white rounded-full text-sm font-bold tracking-wider">
              SHOPPING CART
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-white leading-tight">
              Your <span className="text-red-500">Cart</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Review your items and proceed to checkout
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%, 0% 100%)' }} />
      </section>

      <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => navigate('/pricing')}
              className="flex items-center gap-2 text-navy-900 hover:text-red-600 transition-colors mb-8 font-semibold"
            >
              <ArrowLeft className="h-5 w-5" />
              Continue Shopping
            </button>

            <div className="space-y-6">
              {items.map((item) => {
                const price = parseFloat(item.product.price.replace('$', ''));
                const subtotal = price * item.quantity;

                return (
                  <div
                    key={item.product.id}
                    className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-6 hover:shadow-xl transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-navy-900 mb-2">
                          {item.product.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                          {item.product.description}
                        </p>
                        <p className="text-xl font-bold text-navy-900">
                          ${price.toFixed(2)} <span className="text-sm font-normal text-gray-600">per person</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-10 h-10 rounded-lg bg-white hover:bg-red-100 transition-colors flex items-center justify-center"
                          >
                            <Minus className="h-4 w-4 text-navy-900" />
                          </button>
                          <span className="w-12 text-center text-xl font-bold text-navy-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-10 h-10 rounded-lg bg-white hover:bg-green-100 transition-colors flex items-center justify-center"
                          >
                            <Plus className="h-4 w-4 text-navy-900" />
                          </button>
                        </div>

                        <div className="text-right min-w-[100px]">
                          <div className="text-2xl font-black text-red-600">
                            ${subtotal.toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500">subtotal</div>
                        </div>

                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="p-3 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-5 w-5 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 bg-white rounded-2xl border-2 border-gray-200 shadow-xl p-8">
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Total Items:</span>
                  <span className="font-semibold">{getTotalItems()} people</span>
                </div>
                <div className="border-t border-gray-200 pt-4"></div>
                <div className="flex justify-between text-2xl font-bold">
                  <span className="text-navy-900">Total:</span>
                  <span className="text-red-600">${getTotal().toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <CreditCard className="h-6 w-6" />
                Proceed to Checkout
              </button>

              {hasPermission('admin.debug') && (
                <button
                  onClick={handleDebugCheckout}
                  className="mt-3 w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all border-2 border-yellow-500 bg-yellow-50 text-yellow-900 hover:bg-yellow-100"
                >
                  <Bug className="h-6 w-6" />
                  Debug Checkout (Skip Payment)
                </button>
              )}

              <p className="text-sm text-gray-500 text-center mt-4">
                Secure payment powered by Stripe
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
