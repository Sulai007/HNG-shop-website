import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { Order } from '../types';
import { Package, ArrowLeft, LogOut, ChevronRight, Calendar, MapPin, ExternalLink, Loader2 } from 'lucide-react';

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
        <h2 className="font-serif text-2xl text-[#2C241E]">Sign In Required</h2>
        <p className="text-sm text-[#7A6F65]">
          Please sign in with Google or select a demo profile to view your account and past order history.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => signInWithDemoUser('lagos')}
            className="px-6 py-3 bg-[#2C241E] text-[#FAF8F5] text-xs uppercase tracking-wider font-mono"
          >
            Demo Sign In (Adebayo Alabi)
          </button>
          <button
            onClick={onBackToShopping}
            className="px-6 py-3 bg-[#FAF8F5] border border-[#2C241E] text-[#2C241E] text-xs uppercase tracking-wider font-mono"
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
        className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#7A6F65] hover:text-[#1E1B18] mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Shopping</span>
      </button>

      {/* User Profile Card */}
      <div className="bg-[#FFFFFF] border border-[#E8E2D8] p-6 sm:p-8 mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.full_name}
              className="w-16 h-16 rounded-full object-cover border border-[#D9D2C7]"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[#2C241E] text-[#FAF8F5] flex items-center justify-center text-xl font-serif">
              {user.full_name.charAt(0)}
            </div>
          )}

          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#7A6F65] block">
              ÈDÁ Patron Sanctuary Account
            </span>
            <h1 className="text-2xl font-serif font-semibold text-[#1E1B18]">
              {user.full_name}
            </h1>
            <p className="text-xs text-[#594E45]">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={signOut}
            className="inline-flex items-center gap-2 px-4 py-2 border border-[#D9D2C7] text-xs font-mono uppercase text-[#7A6F65] hover:text-[#DC2626] hover:border-[#DC2626] transition-colors"
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
            <h2 className="text-xl font-serif font-semibold text-[#1E1B18]">
              Past Orders & Dispatch History
            </h2>
            <p className="text-xs text-[#7A6F65]">
              Persisted in Supabase PostgreSQL database
            </p>
          </div>
          <span className="text-xs font-mono text-[#594E45] tabular-nums">
            {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs font-mono text-[#7A6F65] flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#2C241E]" />
            <span>Loading orders from database...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-[#FFFFFF] border border-[#E8E2D8] p-12 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#7A6F65]">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg text-[#2C241E]">No orders placed yet</h3>
            <p className="text-xs text-[#695E54] max-w-sm mx-auto">
              Your orders and delivery statuses will automatically appear here once you complete checkout.
            </p>
            <button
              onClick={onBackToShopping}
              className="mt-2 px-6 py-2.5 bg-[#2C241E] text-[#FAF8F5] text-xs uppercase tracking-wider font-mono hover:bg-[#15120F]"
            >
              Browse Catalogue
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
                  className="bg-[#FFFFFF] border border-[#E8E2D8] hover:border-[#2C241E]/40 transition-all p-6 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0EBE3]">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-bold text-[#1E1B18]">
                          {ord.order_number}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 uppercase tracking-wide bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]">
                          {ord.payment_status}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 uppercase tracking-wide bg-[#FAF8F5] text-[#594E45] border border-[#E8E2D8]">
                          {ord.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-[#7A6F65] font-mono">
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
                      <span className="text-xs text-[#7A6F65] block">Order Total</span>
                      <span className="font-serif text-lg font-bold text-[#1E1B18] tabular-nums">
                        ₦{ord.total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Items Summary in Order */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#7A6F65] font-bold block">
                      Snapshot Items ({ord.items?.length || 0})
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {ord.items?.map((it, idx) => (
                        <div key={idx} className="p-2 bg-[#FAF8F5] border border-[#E8E2D8] flex justify-between">
                          <div>
                            <p className="font-medium text-[#1E1B18]">{it.product_name}</p>
                            {it.variant_information && (
                              <p className="text-[10px] text-[#7A6F65] font-mono">{it.variant_information}</p>
                            )}
                            <p className="text-[11px] text-[#7A6F65] font-mono">Qty: {it.quantity}</p>
                          </div>
                          <span className="font-serif font-bold text-[#2C241E] tabular-nums self-end">
                            ₦{it.subtotal.toLocaleString()}
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
                      className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-[#2C241E] hover:underline"
                    >
                      <span>View Full Order Details & Resend Email Receipt</span>
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
