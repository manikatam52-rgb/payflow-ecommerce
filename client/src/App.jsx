import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { ShoppingCart, Package, CreditCard, CheckCircle2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [clientSecret, setClientSecret] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/products`)
      .then((res) => setProducts(res.data))
      .catch(() => toast.error('Failed to load products'));
  }, []);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast.success(`Added ${product.name} to cart!`);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleStartCheckout = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/create-payment-intent`, {
        items: cart,
      });
      setClientSecret(res.data.clientSecret);
      setIsCheckoutOpen(true);
    } catch {
      toast.error('Could not initialize checkout');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Toaster position="top-right" />

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <CreditCard className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold tracking-tight">PayFlow Store</span>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(!isCheckoutOpen)}
            className="relative rounded-full p-2 text-slate-600 transition hover:text-indigo-600"
          >
            <ShoppingCart className="h-6 w-6" />
            {cart.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white animate-pulse">
                {cart.reduce((a, c) => a + c.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {orderSuccess ? (
          <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg">
            <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-emerald-500 animate-bounce" />
            <h2 className="text-2xl font-bold text-slate-800">Payment Completed!</h2>
            <p className="mt-2 mb-6 text-slate-500">Your real-time order confirmation has been processed.</p>
            <button
              onClick={() => {
                setCart([]);
                setIsCheckoutOpen(false);
                setOrderSuccess(false);
              }}
              className="w-full rounded-xl bg-indigo-600 py-3 font-medium text-white transition hover:bg-indigo-700"
            >
              Back to Store
            </button>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-3">
            <div className="grid gap-6 sm:grid-cols-2 md:col-span-2">
              {products.map((product) => (
                <div key={product.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                  <div className="mb-4 flex h-40 items-center justify-center rounded-xl bg-slate-100">
                    <Package className="h-12 w-12 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">{product.name}</h3>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xl font-bold text-slate-900">${product.price}</span>
                    <button
                      onClick={() => addToCart(product)}
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 active:scale-95"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 border-b border-slate-200 pb-4 text-xl font-bold">Order Summary</h2>
              {cart.length === 0 ? (
                <p className="py-6 text-center text-slate-400">Your cart is empty.</p>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-medium text-slate-800">{item.name}</p>
                        <p className="text-slate-400">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}

                  <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-lg font-bold">
                    <span>Total</span>
                    <span className="text-indigo-600">${cartTotal.toFixed(2)}</span>
                  </div>

                  {!clientSecret ? (
                    <button
                      onClick={handleStartCheckout}
                      className="w-full rounded-xl bg-slate-900 py-3 font-medium text-white transition hover:bg-slate-800"
                    >
                      Checkout Now
                    </button>
                  ) : (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      <CheckoutForm amount={cartTotal} onSuccess={() => setOrderSuccess(true)} />
                    </Elements>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
