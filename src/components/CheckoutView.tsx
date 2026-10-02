import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CheckoutFormData, Order } from '../types';
import { NIGERIAN_STATES } from '../data/seedData';
import { paymentService } from '../services/paymentService';
import { orderService } from '../services/orderService';
import { ArrowLeft, ShieldCheck, CreditCard, Lock, AlertCircle, Loader2, Sparkles, Building, Smartphone, Check } from 'lucide-react';
import { ProductArtwork } from './ProductArtwork';

interface CheckoutViewProps {
  onBackToShopping: () => void;
  onOrderCompleted: (order: Order) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  onBackToShopping,
  onOrderCompleted,
}) => {
  const { items, subtotal, deliveryFee, total, selectedState, setSelectedState, clearCart } = useCart();
  const { user } = useAuth();

  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: user?.full_name || 'Adebayo Alabi',
    email: user?.email || 'adebayo.alabi@example.ng',
    phone: user?.phone || '+234 803 123 4567',
    deliveryAddress: '14B Victoria Arobieke Street, Off Admiralty Way',
    city: 'Lekki Phase 1',
    state: selectedState.name,
    notes: 'Please call upon arrival at the gate.',
    simulatePaymentFailure: false,
  });

  // Mock Payment Interactive Controls
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer' | 'ussd'>('card');
  const [cardNumber, setCardNumber] = useState('4084 0800 0000 0000');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('408');
  const [cardPin, setCardPin] = useState('1234');

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleStateChange = (code: string) => {
    const found = NIGERIAN_STATES.find((s) => s.code === code);
    if (found) {
      setSelectedState(found);
      setFormData((prev) => ({ ...prev, state: found.name }));
    }
  };

  const handleFillDemoData = () => {
    setFormData({
      fullName: user?.full_name || 'Adebayo Alabi',
      email: user?.email || 'elevatepages980@gmail.com',
      phone: '+234 812 345 6789',
      deliveryAddress: 'Plot 12, Admiralty Way, Lekki Phase 1',
      city: 'Lekki',
      state: 'Lagos (Island / Lekki / Ikoyi / VI)',
      notes: 'Leave with concierge security.',
      simulatePaymentFailure: false,
    });
    setCardNumber('4084 0800 0000 0000');
    setCardExpiry('12/28');
    setCardCvv('408');
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Form validation
    if (!formData.fullName.trim()) {
      setErrorMessage('Please provide your full name for delivery.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Please provide a valid email address for your order confirmation receipt.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 8) {
      setErrorMessage('Please provide a valid Nigerian contact phone number for dispatch.');
      return;
    }
    if (!formData.deliveryAddress.trim()) {
      setErrorMessage('Please provide your physical delivery street address.');
      return;
    }

    if (items.length === 0) {
      setErrorMessage('Your sanctuary bag is empty. Please add products first.');
      return;
    }

    setIsProcessing(true);
    setProcessingStep('1/3 Contacting Test Payment Gateway...');

    try {
      // Step 1: Simulated 3D-Secure / Card Processing
      await new Promise(r => setTimeout(r, 600));
      setProcessingStep('2/3 Verifying Test NGN Transaction Authorization...');

      const paymentResult = await paymentService.processPayment({
        orderReference: `EDA_${Date.now()}`,
        amount: total,
        customerEmail: formData.email,
        customerName: formData.fullName,
        currency: 'NGN',
        simulateFailure: formData.simulatePaymentFailure,
      });

      if (!paymentResult.success) {
        setIsProcessing(false);
        setErrorMessage(paymentResult.message || 'Payment was declined by test gateway.');
        return;
      }

      // Step 2: Authoritative Order Creation & Persistence
      setProcessingStep('3/3 Saving Order & Dispatching Resend Confirmation Email...');
      const effectiveUserId = user?.id || 'usr_guest_' + Date.now();
      const orderResult = await orderService.createOrder(
        effectiveUserId,
        items,
        formData,
        selectedState
      );

      if (!orderResult.success || !orderResult.order) {
        setIsProcessing(false);
        setErrorMessage(orderResult.error || 'Failed to complete order.');
        return;
      }

      // Step 3: Clear cart and transition to confirmation
      clearCart();
      setIsProcessing(false);
      onOrderCompleted(orderResult.order);
    } catch (err: any) {
      console.error('Order creation error:', err);
      setIsProcessing(false);
      setErrorMessage(err.message || 'An unexpected error occurred during checkout.');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl text-[#2C241E]">Your Sanctuary Bag is Empty</h2>
        <p className="text-sm text-[#7A6F65]">You must have items in your bag to proceed through checkout.</p>
        <button
          onClick={onBackToShopping}
          className="mt-4 px-8 py-3 bg-[#2C241E] text-[#FAF8F5] text-xs uppercase tracking-widest font-mono hover:bg-[#15120F]"
        >
          Return to Catalogue
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      
      {/* Top Controls */}
      <div className="flex items-center justify-between mb-8">
        <button
          type="button"
          onClick={onBackToShopping}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#7A6F65] hover:text-[#1E1B18] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Shopping</span>
        </button>

        {/* 1-Click Auto-Fill Demo Button */}
        <button
          type="button"
          onClick={handleFillDemoData}
          className="px-3 py-1.5 bg-[#FAF8F5] border border-[#2C241E] text-[#2C241E] text-xs font-mono flex items-center gap-1.5 hover:bg-[#EFEAE2] transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#2C241E]" />
          <span>Auto-fill Lagos Test Delivery</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Customer & Delivery Details */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#786B60]">
              Secure Checkout · Step 1 of 1
            </span>
            <h1 className="mt-1 text-3xl font-serif font-semibold text-[#1E1B18]">
              Delivery & Payment Details
            </h1>
            <p className="text-xs text-[#695E54] mt-1">
              Hand-packaged in custom shock-absorbing presentation boxes in Lagos, Nigeria.
            </p>
          </div>

          {errorMessage && (
            <div className="p-4 bg-[#FEF2F2] border border-[#FECACA] flex items-start gap-3 text-xs text-[#991B1B]">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold">Checkout Notice</p>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}

          <form id="checkout-form" onSubmit={handleSubmitOrder} className="space-y-6">
            
            {/* Customer Information */}
            <div className="bg-[#FFFFFF] p-6 border border-[#E8E2D8] space-y-4">
              <h2 className="font-serif text-lg font-medium text-[#2C241E] pb-2 border-b border-[#F0EBE3]">
                1. Recipient Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#7A6F65] block">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Adebayo Alabi"
                    className="w-full text-sm p-3 bg-[#FAF8F5] border border-[#D9D2C7] text-[#2C241E] focus:outline-none focus:border-[#2C241E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#7A6F65] block">
                    Email Address (Receipt) *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. adebayo@example.ng"
                    className="w-full text-sm p-3 bg-[#FAF8F5] border border-[#D9D2C7] text-[#2C241E] focus:outline-none focus:border-[#2C241E]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase tracking-wider text-[#7A6F65] block">
                  Nigerian Phone Number (For Dispatch Rider) *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+234 803 123 4567"
                  className="w-full text-sm p-3 bg-[#FAF8F5] border border-[#D9D2C7] text-[#2C241E] focus:outline-none focus:border-[#2C241E]"
                />
              </div>
            </div>

            {/* Delivery Destination */}
            <div className="bg-[#FFFFFF] p-6 border border-[#E8E2D8] space-y-4">
              <h2 className="font-serif text-lg font-medium text-[#2C241E] pb-2 border-b border-[#F0EBE3]">
                2. Delivery Destination
              </h2>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase tracking-wider text-[#7A6F65] block">
                  Street Address & Flat / House Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.deliveryAddress}
                  onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                  placeholder="e.g. Plot 12, Admiralty Way, Lekki Phase 1"
                  className="w-full text-sm p-3 bg-[#FAF8F5] border border-[#D9D2C7] text-[#2C241E] focus:outline-none focus:border-[#2C241E]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#7A6F65] block">
                    City / Area *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Lekki / Victoria Island / Ikeja"
                    className="w-full text-sm p-3 bg-[#FAF8F5] border border-[#D9D2C7] text-[#2C241E] focus:outline-none focus:border-[#2C241E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#7A6F65] block">
                    Nigerian State / Region *
                  </label>
                  <select
                    value={selectedState.code}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="w-full text-sm p-3 bg-[#FAF8F5] border border-[#D9D2C7] text-[#2C241E] focus:outline-none focus:border-[#2C241E]"
                  >
                    {NIGERIAN_STATES.map((state) => (
                      <option key={state.code} value={state.code}>
                        {state.name} — ₦{state.delivery_fee.toLocaleString()} ({state.estimated_days})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase tracking-wider text-[#7A6F65] block">
                  Delivery Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Leave with security at the gate or call upon arrival."
                  className="w-full text-sm p-3 bg-[#FAF8F5] border border-[#D9D2C7] text-[#2C241E] focus:outline-none focus:border-[#2C241E]"
                />
              </div>
            </div>

            {/* Interactive Mock Payment Gateway Section */}
            <div className="bg-[#FFFFFF] p-6 border border-[#E8E2D8] space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#F0EBE3]">
                <h2 className="font-serif text-lg font-medium text-[#2C241E] flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#2C241E]" />
                  <span>3. Payment Gateway (Test Simulation)</span>
                </h2>
                <span className="text-[11px] font-mono text-[#166534] bg-[#F0FDF4] px-2 py-0.5 border border-[#BBF7D0]">
                  Paystack / Flutterwave Pattern
                </span>
              </div>

              {/* Payment Method Selector */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 text-xs font-mono flex flex-col items-center gap-1 border transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#2C241E] bg-[#FAF8F5] font-semibold text-[#2C241E]'
                      : 'border-[#E8E2D8] text-[#7A6F65] hover:border-[#8C8075]'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Card (NGN)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('transfer')}
                  className={`p-3 text-xs font-mono flex flex-col items-center gap-1 border transition-all ${
                    paymentMethod === 'transfer'
                      ? 'border-[#2C241E] bg-[#FAF8F5] font-semibold text-[#2C241E]'
                      : 'border-[#E8E2D8] text-[#7A6F65] hover:border-[#8C8075]'
                  }`}
                >
                  <Building className="w-4 h-4" />
                  <span>Bank Transfer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('ussd')}
                  className={`p-3 text-xs font-mono flex flex-col items-center gap-1 border transition-all ${
                    paymentMethod === 'ussd'
                      ? 'border-[#2C241E] bg-[#FAF8F5] font-semibold text-[#2C241E]'
                      : 'border-[#E8E2D8] text-[#7A6F65] hover:border-[#8C8075]'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>USSD (*737#)</span>
                </button>
              </div>

              {/* Interactive Card Form */}
              {paymentMethod === 'card' && (
                <div className="p-4 bg-[#FAF8F5] border border-[#E8E2D8] space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-[#7A6F65]">
                    <span>Card Details (Mock Test Mode)</span>
                    <span className="text-[#166534]">Mastercard / Visa / Verve</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase text-[#7A6F65] block">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4084 0800 0000 0000"
                      className="w-full text-sm font-mono p-2.5 bg-[#FFFFFF] border border-[#D9D2C7] text-[#2C241E]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono uppercase text-[#7A6F65] block">
                        Valid Thru
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full text-sm font-mono p-2.5 bg-[#FFFFFF] border border-[#D9D2C7] text-[#2C241E]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono uppercase text-[#7A6F65] block">
                        CVV
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="408"
                        className="w-full text-sm font-mono p-2.5 bg-[#FFFFFF] border border-[#D9D2C7] text-[#2C241E]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'transfer' && (
                <div className="p-4 bg-[#FAF8F5] border border-[#E8E2D8] text-xs font-mono space-y-1 text-[#2C241E]">
                  <p className="font-bold">ÈDÁ Mock Virtual NIP Account</p>
                  <p>Bank: Wema Bank / Providus Bank</p>
                  <p>Account Number: 9928374610</p>
                  <p className="text-[11px] text-[#7A6F65]">Click Authorize below to simulate instantaneous payment confirmation.</p>
                </div>
              )}

              {paymentMethod === 'ussd' && (
                <div className="p-4 bg-[#FAF8F5] border border-[#E8E2D8] text-xs font-mono space-y-1 text-[#2C241E]">
                  <p className="font-bold">Instant USSD Simulation</p>
                  <p>Dial code: *737*000*4928# on registered Nigerian SIM</p>
                  <p className="text-[11px] text-[#7A6F65]">Click Authorize below to simulate prompt completion.</p>
                </div>
              )}

              {/* Simulation Testing Failure Switch */}
              <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D8] flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-medium text-[#2C241E] block">
                    Simulate Payment Failure Mode
                  </span>
                  <span className="text-[11px] text-[#7A6F65]">
                    Toggle this on to test error boundary & transaction decline handling.
                  </span>
                </div>
                <input
                  type="checkbox"
                  id="simulateFailure"
                  checked={formData.simulatePaymentFailure}
                  onChange={(e) => setFormData({ ...formData, simulatePaymentFailure: e.target.checked })}
                  className="w-4 h-4 accent-[#2C241E] cursor-pointer"
                />
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 bg-[#2C241E] text-[#FAF8F5] text-xs uppercase tracking-widest font-mono font-semibold hover:bg-[#15120F] disabled:bg-[#8F847A] transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{processingStep || 'Processing Transaction...'}</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-[#E6DCCF]" />
                  <span>Authorize Test Payment · ₦{total.toLocaleString()}</span>
                </>
              )}
            </button>

          </form>
        </div>

        {/* Right Column: Authoritative Order Summary */}
        <div className="lg:col-span-5">
          <div className="sticky top-28 bg-[#FFFFFF] border border-[#E8E2D8] p-6 space-y-6 shadow-sm">
            <h2 className="font-serif text-xl font-semibold text-[#1E1B18] pb-3 border-b border-[#F0EBE3]">
              Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
            </h2>

            {/* Itemized List */}
            <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 text-xs">
                  <div className="w-14 h-14 bg-[#F4EFEA] border border-[#E8E2D8] flex-shrink-0">
                    <ProductArtwork
                      category={item.product.category}
                      name={item.product.name}
                      aspectRatio="1/1"
                      className="w-full h-full"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif font-medium text-[#1E1B18] line-clamp-1">
                        {item.product.name}
                      </h4>
                      {item.variant && (
                        <p className="text-[10px] text-[#7A6F65] font-mono">{item.variant.value}</p>
                      )}
                      <p className="text-[11px] text-[#7A6F65] font-mono mt-0.5">
                        Qty: {item.quantity} × ₦{item.unit_price.toLocaleString()}
                      </p>
                    </div>

                    <span className="font-serif font-bold text-[#1E1B18] tabular-nums self-end">
                      ₦{item.subtotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-2 pt-4 border-t border-[#F0EBE3] text-xs text-[#594E45]">
              <div className="flex justify-between">
                <span>Sanctuary Subtotal</span>
                <span className="font-serif text-sm font-semibold text-[#1E1B18] tabular-nums">
                  ₦{subtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <div>
                  <span>Delivery ({selectedState.name})</span>
                  <p className="text-[10px] text-[#8C8075]">{selectedState.estimated_days}</p>
                </div>
                <span className="font-mono tabular-nums text-[#1E1B18]">
                  ₦{deliveryFee.toLocaleString()}
                </span>
              </div>

              <div className="pt-3 border-t border-[#2C241E] flex justify-between items-baseline">
                <span className="font-serif text-base font-bold text-[#1E1B18]">Total Due</span>
                <span className="font-serif text-xl font-bold text-[#1E1B18] tabular-nums">
                  ₦{total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Trust Markers */}
            <div className="p-4 bg-[#FAF8F5] border border-[#E8E2D8] space-y-2 text-xs text-[#7A6F65]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#2C241E]" />
                <span className="font-mono text-[11px]">Resend Transactional Email Verification</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                An authoritative HTML confirmation receipt with your full order breakdown will be sent directly to your email.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
