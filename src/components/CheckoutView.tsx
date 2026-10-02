import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { paymentService } from '../services/paymentService';
import { Order, CheckoutFormData, NigerianDeliveryState } from '../types';
import { NIGERIAN_STATES } from '../data/seedData';
import { 
  ArrowLeft, 
  CreditCard, 
  ShieldCheck, 
  Truck, 
  AlertCircle, 
  Loader2, 
  Sparkles, 
  Lock,
  Building,
  Smartphone,
  CheckCircle2,
  Package
} from 'lucide-react';
import { formatNaira } from '../utils/formatters';

interface CheckoutViewProps {
  onBackToShopping: () => void;
  onOrderCompleted: (order: Order) => void;
  currency?: 'USD' | 'NGN';
  formatPrice?: (amount: number) => string;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  onBackToShopping,
  onOrderCompleted,
}) => {
  const { items, subtotal, deliveryFee, total, selectedState, setSelectedState, clearCart } = useCart();
  const { user } = useAuth();

  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    deliveryAddress: '',
    city: '',
    state: selectedState.name,
    notes: '',
    simulatePaymentFailure: false,
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer' | 'ussd'>('card');
  const [cardNumber, setCardNumber] = useState('5399 4100 8821 9042');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('408');

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleStateChange = (stateCode: string) => {
    const found = NIGERIAN_STATES.find((s) => s.code === stateCode);
    if (found) {
      setSelectedState(found);
      setFormData((prev) => ({ ...prev, state: found.name }));
    }
  };

  const handleFillDemoData = () => {
    const lagosIsland = NIGERIAN_STATES.find(s => s.code === 'LA_ISL') || NIGERIAN_STATES[0];
    setSelectedState(lagosIsland);
    setFormData({
      fullName: user?.full_name || 'Adebayo Alabi',
      email: user?.email || 'adebayo.alabi@example.ng',
      phone: '+234 803 123 4567',
      deliveryAddress: 'Plot 12, Admiralty Way, Lekki Phase 1',
      city: 'Lekki / Lagos Island',
      state: lagosIsland.name,
      notes: 'Call upon arrival at the gate.',
      simulatePaymentFailure: false,
    });
    setErrorMessage(null);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic Validation
    if (!formData.fullName.trim()) {
      setErrorMessage('Please provide the recipient full name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Please provide a valid email address for your order confirmation receipt.');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage('Please provide a Nigerian contact phone number for the dispatch rider.');
      return;
    }
    if (!formData.deliveryAddress.trim()) {
      setErrorMessage('Please provide your physical delivery street address.');
      return;
    }

    if (items.length === 0) {
      setErrorMessage('Your shopping cart is empty. Please add products first.');
      return;
    }

    setIsProcessing(true);
    setProcessingStep('1/3 Contacting Test Payment Gateway...');

    try {
      // Step 1: Simulated 3D-Secure / Card Processing
      await new Promise(r => setTimeout(r, 600));
      setProcessingStep('2/3 Verifying Test NGN Transaction Authorization...');

      const paymentResult = await paymentService.processPayment({
        orderReference: `NOVA_${Date.now()}`,
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
        setErrorMessage(orderResult.error || 'Order could not be saved to database.');
        return;
      }

      // Step 3: Clear Cart & Open Confirmation View
      clearCart();
      setIsProcessing(false);
      onOrderCompleted(orderResult.order);
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage(err.message || 'An unexpected error occurred during checkout.');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-orange-50 flex items-center justify-center text-[#EA580C]">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="font-heading font-extrabold text-2xl text-gray-900">Your Shopping Cart is Empty</h2>
        <p className="text-sm text-gray-600">You must have items in your cart to proceed through checkout.</p>
        <button
          onClick={onBackToShopping}
          className="mt-4 px-8 py-3 bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-xs"
        >
          Return to Store
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
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Shopping</span>
        </button>

        {/* 1-Click Auto-Fill Demo Button */}
        <button
          type="button"
          onClick={handleFillDemoData}
          className="px-3.5 py-1.5 bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 hover:bg-orange-100 transition-colors shadow-2xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#EA580C]" />
          <span>Auto-fill Lagos Test Delivery</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left Column: Customer & Delivery Details */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-orange-600 font-bold">
              Nova Stores · Secure Checkout
            </span>
            <h1 className="mt-1 text-2xl sm:text-3xl font-heading font-extrabold text-gray-950 tracking-tight">
              Delivery & Payment Details
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Trending lifestyle items dispatched across Lagos and all 36 Nigerian states.
            </p>
          </div>

          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-xs text-red-800">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-600" />
              <div>
                <p className="font-bold">Checkout Notice</p>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}

          <form id="checkout-form" onSubmit={handleSubmitOrder} className="space-y-6">
            
            {/* Customer Information */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs space-y-4">
              <h2 className="font-heading font-bold text-base text-gray-900 pb-2 border-b border-gray-100">
                1. Recipient Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 block">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Adebayo Alabi"
                    className="w-full text-sm p-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 block">
                    Email Address (Receipt) *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. adebayo@example.ng"
                    className="w-full text-sm p-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 block">
                  Nigerian Phone Number (For Dispatch Rider) *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+234 803 123 4567"
                  className="w-full text-sm p-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Delivery Destination */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs space-y-4">
              <h2 className="font-heading font-bold text-base text-gray-900 pb-2 border-b border-gray-100">
                2. Delivery Destination
              </h2>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 block">
                  Street Address & Flat / House Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.deliveryAddress}
                  onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                  placeholder="e.g. Plot 12, Admiralty Way, Lekki Phase 1"
                  className="w-full text-sm p-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 block">
                    City / Area *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Lekki / Victoria Island / Ikeja"
                    className="w-full text-sm p-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 block">
                    Nigerian State / Region *
                  </label>
                  <select
                    value={selectedState.code}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="w-full text-sm p-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  >
                    {NIGERIAN_STATES.map((state) => (
                      <option key={state.code} value={state.code}>
                        {state.name} — {formatNaira(state.delivery_fee)} ({state.estimated_days})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 block">
                  Delivery Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Leave with security at the gate or call upon arrival."
                  className="w-full text-sm p-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Interactive Mock Payment Gateway Section */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <h2 className="font-heading font-bold text-base text-gray-900 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-orange-600" />
                  <span>3. Payment Gateway (Test Simulation)</span>
                </h2>
                <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  Paystack / Flutterwave Pattern
                </span>
              </div>

              {/* Payment Method Selector */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 text-xs font-medium rounded-lg flex flex-col items-center gap-1 border transition-all ${
                    paymentMethod === 'card'
                      ? 'border-orange-500 bg-orange-50/60 font-bold text-orange-950 shadow-2xs'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-orange-600" />
                  <span>Card (NGN)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('transfer')}
                  className={`p-3 text-xs font-medium rounded-lg flex flex-col items-center gap-1 border transition-all ${
                    paymentMethod === 'transfer'
                      ? 'border-orange-500 bg-orange-50/60 font-bold text-orange-950 shadow-2xs'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <Building className="w-4 h-4 text-orange-600" />
                  <span>Bank Transfer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('ussd')}
                  className={`p-3 text-xs font-medium rounded-lg flex flex-col items-center gap-1 border transition-all ${
                    paymentMethod === 'ussd'
                      ? 'border-orange-500 bg-orange-50/60 font-bold text-orange-950 shadow-2xs'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-orange-600" />
                  <span>USSD (*737#)</span>
                </button>
              </div>

              {/* Interactive Card Form */}
              {paymentMethod === 'card' && (
                <div className="p-4 bg-gray-50/80 rounded-lg border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-gray-600">
                    <span>Card Details (Mock Test Mode)</span>
                    <span className="text-emerald-700 font-semibold">Mastercard / Visa / Verve</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold uppercase text-gray-600 block">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4084 0800 0000 0000"
                      className="w-full text-sm font-mono p-2.5 bg-white border border-gray-300 rounded-lg text-gray-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold uppercase text-gray-600 block">
                        Valid Thru
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full text-sm font-mono p-2.5 bg-white border border-gray-300 rounded-lg text-gray-900"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold uppercase text-gray-600 block">
                        CVV
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="408"
                        className="w-full text-sm font-mono p-2.5 bg-white border border-gray-300 rounded-lg text-gray-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'transfer' && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-xs font-mono space-y-1 text-gray-900">
                  <p className="font-bold text-gray-900">Nova Stores Mock Virtual NIP Account</p>
                  <p>Bank: Wema Bank / Providus Bank</p>
                  <p>Account Number: 9928374610</p>
                  <p className="text-[11px] text-gray-500">Click Authorize below to simulate instantaneous payment confirmation.</p>
                </div>
              )}

              {paymentMethod === 'ussd' && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-xs font-mono space-y-1 text-gray-900">
                  <p className="font-bold text-gray-900">Instant USSD Simulation</p>
                  <p>Dial code: *737*000*4928# on registered Nigerian SIM</p>
                  <p className="text-[11px] text-gray-500">Click Authorize below to simulate prompt completion.</p>
                </div>
              )}

              {/* Simulation Testing Failure Switch */}
              <div className="p-3.5 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-gray-900 block">
                    Simulate Payment Failure Mode
                  </span>
                  <span className="text-[11px] text-gray-500">
                    Toggle this on to test error boundary & transaction decline handling.
                  </span>
                </div>
                <input
                  type="checkbox"
                  id="simulateFailure"
                  checked={formData.simulatePaymentFailure}
                  onChange={(e) => setFormData({ ...formData, simulatePaymentFailure: e.target.checked })}
                  className="w-4 h-4 accent-orange-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs sm:text-sm uppercase tracking-wider font-heading font-extrabold rounded-xl disabled:bg-gray-400 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{processingStep || 'Processing Transaction...'}</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-orange-200" />
                  <span>Authorize Test Payment · {formatNaira(total)}</span>
                </>
              )}
            </button>

          </form>
        </div>

        {/* Right Column: Authoritative Order Summary */}
        <div className="lg:col-span-5">
          <div className="sticky top-28 bg-white border border-gray-200 rounded-xl p-6 space-y-6 shadow-2xs">
            <h2 className="font-heading font-extrabold text-lg text-gray-950 pb-3 border-b border-gray-100">
              Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
            </h2>

            {/* Itemized List */}
            <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 text-xs">
                  <div className="w-14 h-14 bg-gray-50 border border-gray-200 rounded-lg flex-shrink-0 p-1 flex items-center justify-center">
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 line-clamp-1">
                        {item.product.name}
                      </h4>
                      {item.variant && (
                        <p className="text-[10px] text-gray-500 font-mono">{item.variant.value}</p>
                      )}
                      <p className="text-[11px] text-gray-500 font-mono mt-0.5">
                        Qty: {item.quantity} × {formatNaira(item.unit_price)}
                      </p>
                    </div>

                    <span className="font-heading font-bold text-gray-900 tabular-nums self-end">
                      {formatNaira(item.subtotal)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-2 pt-4 border-t border-gray-100 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Cart Subtotal</span>
                <span className="font-heading text-sm font-bold text-gray-900 tabular-nums">
                  {formatNaira(subtotal)}
                </span>
              </div>

              <div className="flex justify-between">
                <div>
                  <span>Delivery ({selectedState.name})</span>
                  <p className="text-[10px] text-gray-500">{selectedState.estimated_days}</p>
                </div>
                <span className="font-mono text-gray-900 font-bold tabular-nums">
                  {formatNaira(deliveryFee)}
                </span>
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline">
                <span className="text-sm font-heading font-extrabold text-gray-900">Total NGN</span>
                <span className="text-xl font-heading font-extrabold text-[#EA580C] tabular-nums">
                  {formatNaira(total)}
                </span>
              </div>
            </div>

            {/* Trust and Delivery Guarantees */}
            <div className="pt-4 border-t border-gray-100 space-y-2 text-[11px] text-gray-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>256-Bit SSL Secured Nigerian Gateway Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-orange-600" />
                <span>Authoritative recalculation with verified stock limits</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
