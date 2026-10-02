import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { Order } from '../types';
import { Package, ArrowLeft, LogOut, ChevronRight, Calendar, MapPin, ExternalLink, Loader2 } from 'lucide-react';
import { formatNaira } from '../utils/formatters';

interface OrderHistoryViewProps {
  onBackToShopping: () => void;
  onOpenOrderConfirmation: (order: Order) => void;
}

export const OrderHistoryView: React.FC<OrderHistoryViewProps> = ({
  onBackToShopping,
  onOpenOrderConfirmation,
}) => {
  const { user, signOut, signInWithDemoUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      if (!user) {
        setOrders([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const userOrders = await orderService.getUserOrders(user.id);
        setOrders(userOrders);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <h2 className="font-heading font-bold text-2xl text-gray-900">Sign In Required</h2>
        <p className="text-sm text-gray-600">
          Please sign in with Google or your email to view your account and past order history.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onBackToShopping}
            className="px-6 py-3 bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs uppercase tracking-wider font-semibold rounded-lg transition-colors"
          >
            Return to Store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      
      {/* Back button */}
      <button
        type="button"
        onClick={onBackToShopping}
        className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-gray-500 hover:text-gray-900 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Shopping</span>
      </button>

      {/* User Profile Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.full_name}
              className="w-16 h-16 rounded-full object-cover border border-gray-200"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-slate-900 text-white flex items-center justify-center text-xl font-heading font-bold">
              {user.full_name.charAt(0)}
            </div>
          )}

          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-orange-600 font-bold block">
              Nova Stores · Verified Patron Account
            </span>
            <h1 className="text-2xl font-heading font-extrabold text-gray-900">
              {user.full_name}
            </h1>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={signOut}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:text-red-600 hover:border-red-200 transition-colors shadow-2xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Order History Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]">
          <div>
            <h2 className="text-xl font-heading font-extrabold text-gray-900">
              Past Orders & Dispatch History
            </h2>
            <p className="text-xs text-gray-500">
              Persisted in Supabase PostgreSQL database
            </p>
          </div>
          <span className="text-xs font-mono text-gray-600 tabular-nums">
            {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs font-mono text-gray-500 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-orange-600" />
            <span>Loading orders from database...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-gray-900">No orders placed yet</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Your orders and delivery statuses will automatically appear here once you complete checkout.
            </p>
            <button
              onClick={onBackToShopping}
              className="mt-2 px-6 py-2.5 bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => {
              const formattedDate = new Date(ord.created_at).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              });

              return (
                <div
                  key={ord.id}
                  className="bg-white border border-gray-200 hover:border-gray-300 rounded-xl transition-all p-6 space-y-4 shadow-2xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-bold text-gray-900">
                          {ord.order_number}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 uppercase tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                          {ord.payment_status}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 uppercase tracking-wide bg-gray-100 text-gray-700 border border-gray-200 rounded">
                          {ord.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500 font-mono">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{formattedDate}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{ord.city}, {ord.state}</span>
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-gray-500 block">Order Total</span>
                      <span className="font-heading font-extrabold text-lg text-gray-900 tabular-nums">
                        {formatNaira(ord.total)}
                      </span>
                    </div>
                  </div>

                  {/* Items Summary in Order */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-gray-500 font-bold block">
                      Purchased Items ({ord.items?.length || 0})
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {ord.items?.map((it, idx) => (
                        <div key={idx} className="p-2.5 bg-gray-50 rounded-lg border border-gray-200 flex justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{it.product_name}</p>
                            {it.variant_information && (
                              <p className="text-[10px] text-gray-500 font-mono">{it.variant_information}</p>
                            )}
                            <p className="text-[11px] text-gray-500 font-mono">Qty: {it.quantity}</p>
                          </div>
                          <span className="font-heading font-bold text-gray-900 tabular-nums self-end">
                            {formatNaira(it.subtotal)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Link to Full Receipt */}
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => onOpenOrderConfirmation(ord)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700 hover:underline cursor-pointer"
                    >
                      <span>View Full Order Details & Receipt</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
