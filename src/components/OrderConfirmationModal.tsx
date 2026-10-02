import React from 'react';
import { Order } from '../types';
import { CheckCircle2, Mail, Package, Home, MapPin, Truck } from 'lucide-react';
import { formatNaira } from '../utils/formatters';

interface OrderConfirmationModalProps {
  order: Order | null;
  onClose: () => void;
  onViewOrderHistory: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  onClose,
  onViewOrderHistory,
}) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Celebration Banner - Modern Nova Stores Aesthetic */}
        <div className="bg-slate-950 p-6 sm:p-8 text-center text-white space-y-3 relative">
          <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-mono tracking-widest uppercase text-orange-400 font-bold">
              Nova Stores · Order Confirmed
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Thank You for Your Order!
            </h2>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10 text-xs font-mono text-gray-200">
            <span>Order Reference:</span>
            <span className="font-bold text-white tracking-wider">{order.order_number}</span>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* Customer Confirmation Notice */}
          <div className="p-4 bg-orange-50/70 border border-orange-200/80 rounded-xl flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 flex-shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-900">
                Confirmation receipt dispatched to <span className="font-mono text-[#EA580C]">{order.customer_email}</span>
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Your order receipt, itemized invoice, and dispatch tracking details have been sent to your inbox.
              </p>
            </div>
          </div>

          {/* Delivery & Recipient Card */}
          <div className="bg-gray-50/70 p-5 rounded-xl border border-gray-200 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-900 uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-orange-600" />
              <span>Delivery Destination</span>
            </div>
            
            <div className="pl-6 text-xs text-gray-700 space-y-1">
              <p className="text-sm font-semibold text-gray-900">{order.customer_name}</p>
              <p className="leading-relaxed">
                {order.delivery_address}<br />
                {order.city}, {order.state}<br />
                <span className="font-mono text-gray-600">Phone: {order.customer_phone}</span>
              </p>
              {order.notes && (
                <p className="text-xs text-gray-600 italic pt-1.5 border-t border-gray-200/80">
                  Note: {order.notes}
                </p>
              )}
            </div>
          </div>

          {/* Items Breakdown */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-900">
                Purchased Items ({order.items.length})
              </span>
              <span className="text-[11px] font-mono text-gray-500">
                Verified Authentic
              </span>
            </div>

            <div className="divide-y divide-gray-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.product_name}
                        className="w-12 h-12 object-contain bg-gray-50 rounded-lg border border-gray-200 flex-shrink-0 p-1"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                        <Package className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-sm text-gray-900">{item.product_name}</p>
                      {item.variant_information && (
                        <p className="text-[11px] font-mono text-gray-600">{item.variant_information}</p>
                      )}
                      <p className="text-[11px] text-gray-500 font-mono mt-0.5">
                        Qty: {item.quantity} × {formatNaira(item.unit_price)}
                      </p>
                    </div>
                  </div>
                  
                  <span className="font-heading font-bold text-gray-900 tabular-nums text-sm">
                    {formatNaira(item.subtotal)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="pt-3 border-t border-gray-200 space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900 tabular-nums">{formatNaira(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee ({order.state})</span>
                <span className="font-mono text-gray-900 tabular-nums">{formatNaira(order.delivery_fee)}</span>
              </div>
              <div className="flex justify-between pt-2.5 border-t border-gray-200 text-base font-heading font-extrabold text-gray-950">
                <span>Total Paid</span>
                <span className="tabular-nums text-orange-600">{formatNaira(order.total)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-5 sm:p-6 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row gap-3 justify-end">
          <button
            type="button"
            onClick={onViewOrderHistory}
            className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
          >
            <Package className="w-4 h-4 text-gray-500" />
            <span>View Order History</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
        </div>

      </div>
    </div>
  );
};
