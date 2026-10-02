import React, { useState } from 'react';
import { Order } from '../types';
import { CheckCircle2, Mail, ExternalLink, ArrowRight, Package, Home } from 'lucide-react';
import { ProductArtwork } from './ProductArtwork';

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
  const [showEmailPreview, setShowEmailPreview] = useState(false);

  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="bg-[#FAF8F5] border border-[#E8E2D8] w-full max-w-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Top Celebration Banner */}
        <div className="bg-[#2C241E] p-8 text-center text-[#FAF8F5] space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#3B82F6]/20 border border-[#3B82F6] flex items-center justify-center text-[#93C5FD]">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-normal tracking-wide">
            Order Confirmed · Ẹ ṣe pupọ
          </h2>
          <p className="text-xs text-[#C8BDB0] font-mono tracking-widest uppercase">
            Order Reference: {order.order_number}
          </p>
        </div>

        {/* Content Details */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* Email dispatch notice */}
          <div className="p-4 bg-[#FFFFFF] border border-[#E8E2D8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#2C241E] flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-[#1E1B18]">
                  Confirmation Dispatched to {order.customer_email}
                </p>
                <p className="text-[11px] text-[#7A6F65]">
                  Sent via Resend Transactional Email Service
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowEmailPreview(!showEmailPreview)}
              className="text-xs font-mono underline text-[#2C241E] hover:text-[#000000] inline-flex items-center gap-1 self-start sm:self-auto"
            >
              <span>{showEmailPreview ? 'Hide Email Receipt' : 'Inspect Resend HTML Email'}</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {/* Collapsible HTML Email Preview for verification & testing */}
          {showEmailPreview && (
            <div className="border border-[#D9D2C7] bg-[#FFFFFF] p-4 rounded-sm animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#E8E2D8]">
                <span className="text-[11px] font-mono uppercase text-[#7A6F65] font-bold">
                  Live Resend Transactional Email Output
                </span>
                <span className="text-[10px] font-mono text-[#166534] bg-[#DCFCE7] px-2 py-0.5">
                  Verified HTML
                </span>
              </div>
              <div
                className="max-h-80 overflow-y-auto text-xs bg-[#FAF8F5] p-3 border border-[#E8E2D8]"
                dangerouslySetInnerHTML={{ __html: order.email_receipt_html || '<p>Receipt generated and sent to email.</p>' }}
              />
            </div>
          )}

          {/* Delivery & Recipient */}
          <div className="bg-[#FFFFFF] p-5 border border-[#E8E2D8] space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#7A6F65] block font-bold">
              Dispatch Destination
            </span>
            <p className="text-sm font-medium text-[#1E1B18]">{order.customer_name}</p>
            <p className="text-xs text-[#594E45] leading-relaxed">
              {order.delivery_address}<br />
              {order.city}, {order.state}<br />
              Phone: {order.customer_phone}
            </p>
            {order.notes && (
              <p className="text-xs text-[#7A6F65] italic pt-1 border-t border-[#F0EBE3]">
                Delivery Note: {order.notes}
              </p>
            )}
          </div>

          {/* Items Breakdown */}
          <div className="bg-[#FFFFFF] p-5 border border-[#E8E2D8] space-y-4">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#7A6F65] block font-bold">
              Artisanal Pieces ({order.items.length})
            </span>

            <div className="divide-y divide-[#F0EBE3]">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-serif font-medium text-sm text-[#1E1B18]">{item.product_name}</p>
                    {item.variant_information && (
                      <p className="text-[11px] font-mono text-[#7A6F65]">{item.variant_information}</p>
                    )}
                    <p className="text-[11px] text-[#7A6F65] font-mono">
                      Qty: {item.quantity} × ₦{item.unit_price.toLocaleString()}
                    </p>
                  </div>
                  <span className="font-serif font-bold text-[#1E1B18] tabular-nums">
                    ₦{item.subtotal.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="pt-3 border-t border-[#2C241E] space-y-1.5 text-xs text-[#594E45]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-serif tabular-nums text-[#1E1B18]">₦{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-mono tabular-nums text-[#1E1B18]">₦{order.delivery_fee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#E8E2D8] text-base font-serif font-bold text-[#1E1B18]">
                <span>Total Paid</span>
                <span className="tabular-nums">₦{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-[#FAF8F5] border-t border-[#E8E2D8] flex flex-col sm:flex-row gap-3 justify-end">
          <button
            type="button"
            onClick={onViewOrderHistory}
            className="px-6 py-3 bg-[#FFFFFF] border border-[#2C241E] text-[#2C241E] text-xs uppercase tracking-wider font-mono hover:bg-[#EFEAE2] transition-colors flex items-center justify-center gap-2"
          >
            <Package className="w-4 h-4" />
            <span>View Order History</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 bg-[#2C241E] text-[#FAF8F5] text-xs uppercase tracking-wider font-mono hover:bg-[#15120F] transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
        </div>

      </div>
    </div>
  );
};
