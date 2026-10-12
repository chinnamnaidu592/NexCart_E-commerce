'use client';

import React, { useState } from 'react';
import ShippingForm from '@/components/forms/ShippingForm';
import PaymentSelector from '@/components/forms/PaymentSelector';
import CartSummary from '@/components/cart/CartSummary';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import Button from '@/components/common/Button';
import EmptyState from '@/components/common/EmptyState';
import Link from '@/components/common/Link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { orderService } from '@/services/orderService';
import { useRouter } from '@/router/RouterContext';
import { isValidEmail, isValidPhone, isValidPinCode, isValidZip, isValidCardNumber, isValidCardExpiry, isValidCvv } from '@/utils/validators';
import { formatCurrency } from '@/utils/formatters';
import { CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, subtotal, promoDiscount, shippingFee, tax, total, promoCode, clearCart, guestSessionId } = useCart();

  const [shippingData, setShippingData] = useState({
    fullName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardData, setCardData] = useState({ cardNumber: '', expiry: '', cvv: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  const validate = () => {
    const errs = {};
    if (!shippingData.fullName.trim()) errs.fullName = 'Full recipient name is required.';
    if (!shippingData.email.trim() || !isValidEmail(shippingData.email)) errs.email = 'Valid email address is required.';
    if (!shippingData.phone.trim() || !isValidPhone(shippingData.phone)) errs.phone = 'Valid 10-digit mobile number required.';
    if (!shippingData.address.trim()) errs.address = 'Flat / house number and street address are required.';
    if (!shippingData.city.trim()) errs.city = 'City / District is required.';
    if (!shippingData.state.trim()) errs.state = 'Please select a State / UT.';
    if (!shippingData.zip.trim() || (!isValidPinCode(shippingData.zip) && !isValidZip(shippingData.zip))) {
      errs.zip = 'Valid 6-digit Indian PIN code required (e.g. 500033).';
    }


    if (paymentMethod === 'card') {
      if (!isValidCardNumber(cardData.cardNumber)) errs.cardNumber = 'Valid 15-16 digit card number required.';
      if (!isValidCardExpiry(cardData.expiry)) errs.expiry = 'Valid MM/YY expiry required.';
      if (!isValidCvv(cardData.cvv)) errs.cvv = 'Valid 3-4 digit CVV required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the errors in the form.');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        userId: user?.id || null,
        guestSessionId: user ? null : (guestSessionId || 'guest_session'),
        customerName: shippingData.fullName,
        customerEmail: shippingData.email,
        items,
        subtotal,
        discount: promoDiscount,
        shippingFee,
        tax,
        total,
        promoCode,
        shippingAddress: shippingData,
        paymentMethod,
      };

      const newOrder = await orderService.placeOrder(orderPayload);
      clearCart();
      setPlacedOrder(newOrder);
      toast.success('Order placed successfully! Confirmation email sent.');
    } catch (err) {
      toast.error(err.message || 'Failed to place order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Order Success Screen
  if (placedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-14 h-14 rounded-sm bg-[#F0FDF4] border border-[#DCFCE7] text-[#166534] flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-7 h-7 stroke-[1.5]" />
        </div>
        <span className="text-[11px] font-semibold text-[#78716C] uppercase tracking-[0.2em] block mb-2">
          Fulfillment Confirmed
        </span>
        <h1 className="font-sans text-3xl sm:text-4xl font-normal text-[#1C1917] tracking-tight">
          Manifest Registered
        </h1>
        <p className="text-sm text-[#57534E] mt-3 leading-relaxed">
          Thank you, <span className="font-semibold text-[#1C1917]">{placedOrder.customerName}</span>. Your dispatch reference{' '}
          <span className="font-mono font-medium text-[#1C1917] px-1.5 py-0.5 bg-[#F5F5F4] border border-[#E7E5E4]">{placedOrder.orderNumber}</span> has been confirmed.
        </p>

        <div className="mt-10 bg-white rounded-sm border border-[#E7E5E4] p-7 text-left space-y-4">
          <div className="flex justify-between pb-4 border-b border-[#F5F5F4] text-xs">
            <span className="text-[#78716C] uppercase tracking-wider font-semibold">Total Remitted</span>
            <span className="font-sans text-2xl font-normal text-[#1C1917] tabular-nums">{formatCurrency(placedOrder.total)}</span>
          </div>
          <div className="text-xs space-y-1.5 text-[#57534E]">
            <p className="font-semibold text-[#1C1917] uppercase tracking-wider text-[11px]">Consignment Destination:</p>
            <p className="leading-relaxed font-sans">{placedOrder.shippingAddress.address}, {placedOrder.shippingAddress.city}, {placedOrder.shippingAddress.state} – {placedOrder.shippingAddress.zip}, India</p>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/profile">
            <Button variant="outline" size="md" className="w-full sm:w-auto">
              Track Consignment in Profile
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="primary" size="md" className="w-full sm:w-auto">
              Continue Browsing Collection
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumbs items={[{ label: 'Basket', href: '/cart' }, { label: 'Checkout' }]} />
        <EmptyState
          icon={ShoppingBag}
          title="Your basket is vacant"
          description="Allocate items to your acquisition basket before initiating settlement."
          actionText="Explore Catalog"
          actionHref="/products"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16 text-left">
      <Breadcrumbs items={[{ label: 'Basket', href: '/cart' }, { label: 'Settlement & Checkout' }]} />

      <div className="pb-4 pt-2 border-b border-[#E7E5E4]">
        <span className="text-[10px] font-mono font-medium text-[#78716C] uppercase tracking-[0.2em] block mb-1">
          Final Settlement
        </span>
        <h1 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-normal text-[#1C1917] tracking-tight leading-tight">
          Checkout & Dispatch Verification
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-sm border border-[#E7E5E4] p-7 sm:p-8">
            <h2 className="font-sans text-xl font-normal text-[#1C1917] mb-6 pb-3 border-b border-[#F5F5F4]">
              01. Consignment Address
            </h2>
            <ShippingForm
              formData={shippingData}
              onChange={(f, v) => {
                setShippingData((prev) => ({ ...prev, [f]: v }));
                if (errors[f]) setErrors((prev) => ({ ...prev, [f]: null }));
              }}
              errors={errors}
            />
          </div>

          <div className="bg-white rounded-sm border border-[#E7E5E4] p-7 sm:p-8">
            <h2 className="font-sans text-xl font-normal text-[#1C1917] mb-6 pb-3 border-b border-[#F5F5F4]">
              02. Remittance Method
            </h2>
            <PaymentSelector
              selectedMethod={paymentMethod}
              onSelectMethod={setPaymentMethod}
              cardData={cardData}
              onChangeCardData={(f, v) => {
                setCardData((prev) => ({ ...prev, [f]: v }));
                if (errors[f]) setErrors((prev) => ({ ...prev, [f]: null }));
              }}
              errors={errors}
            />
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-28 space-y-4">
            <CartSummary
              subtotal={subtotal}
              promoDiscount={promoDiscount}
              shippingFee={shippingFee}
              tax={tax}
              total={total}
              promoCode={promoCode}
              showCheckoutButton={false}
            />
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isSubmitting}
              onClick={handlePlaceOrder}
            >
              Authorize Settlement ({formatCurrency(total)})
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
