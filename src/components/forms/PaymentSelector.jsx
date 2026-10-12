import React from 'react';
import Input from '@/components/common/Input';
import { CreditCard, Smartphone, Banknote, ShieldCheck } from 'lucide-react';

export default function PaymentSelector({
  selectedMethod,
  onSelectMethod,
  cardData,
  onChangeCardData,
  errors = {},
}) {
  const methods = [
    {
      id: 'card',
      title: 'Credit / Debit Card',
      desc: 'Encrypted transfer via Visa, Mastercard, AMEX',
      icon: CreditCard,
    },
    {
      id: 'upi',
      title: 'Instant UPI / QR Code',
      desc: 'Direct scan via authorized bank app',
      icon: Smartphone,
    },
    {
      id: 'cod',
      title: 'Cash on Delivery (COD)',
      desc: 'Physical remittance upon parcel arrival',
      icon: Banknote,
    },
  ];

  return (
    <div className="space-y-5">
      {/* Method tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {methods.map((m) => {
          const isSelected = selectedMethod === m.id;
          const Icon = m.icon;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onSelectMethod(m.id)}
              className={`p-5 rounded-sm border text-left cursor-pointer transition-all ${
                isSelected
                  ? 'border-[#1C1917] bg-[#F5F5F4]'
                  : 'border-[#E7E5E4] hover:border-[#A8A29E] bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-xs ${isSelected ? 'text-[#1C1917]' : 'text-[#78716C]'}`}>
                  <Icon className="w-4 h-4 stroke-[1.5]" />
                </div>
                <div
                  className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    isSelected ? 'border-[#1C1917]' : 'border-[#D6D3D1]'
                  }`}
                >
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#1C1917]" />}
                </div>
              </div>
              <p className="text-xs font-semibold text-[#1C1917]">{m.title}</p>
              <p className="text-[11px] text-[#78716C] mt-1 leading-snug">{m.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Conditional Card inputs */}
      {selectedMethod === 'card' && (
        <div className="p-5 sm:p-6 rounded-sm bg-[#F5F5F4] border border-[#E7E5E4] space-y-4 animate-in fade-in duration-200">
          <Input
            label="Card Number"
            placeholder="4532 •••• •••• 8821"
            value={cardData.cardNumber || ''}
            onChange={(e) => onChangeCardData('cardNumber', e.target.value)}
            error={errors.cardNumber}
            maxLength={19}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Expiry Date (MM/YY)"
              placeholder="12/28"
              value={cardData.expiry || ''}
              onChange={(e) => onChangeCardData('expiry', e.target.value)}
              error={errors.expiry}
              maxLength={5}
              required
            />
            <Input
              label="Security Code (CVV)"
              placeholder="123"
              type="password"
              value={cardData.cvv || ''}
              onChange={(e) => onChangeCardData('cvv', e.target.value)}
              error={errors.cvv}
              maxLength={4}
              required
            />
          </div>

          <div className="flex items-center gap-2 pt-1 text-[11px] text-[#78716C]">
            <ShieldCheck className="w-4 h-4 stroke-[1.5]" />
            <span>Simulated test sandbox. Encrypted tokenization active.</span>
          </div>
        </div>
      )}

      {selectedMethod === 'upi' && (
        <div className="p-4 rounded-sm bg-[#F5F5F4] border border-[#E7E5E4] text-xs text-[#57534E] flex items-center gap-3">
          <Smartphone className="w-4 h-4 text-[#1C1917] stroke-[1.5] shrink-0" />
          <span>A secure transaction prompt will be transmitted to your registered UPI device upon order confirmation.</span>
        </div>
      )}

      {selectedMethod === 'cod' && (
        <div className="p-4 rounded-sm bg-[#F5F5F4] border border-[#E7E5E4] text-xs text-[#57534E] flex items-center gap-3">
          <Banknote className="w-4 h-4 text-[#1C1917] stroke-[1.5] shrink-0" />
          <span>Please prepare exact tender upon delivery for certified courier verification.</span>
        </div>
      )}
    </div>
  );
}
