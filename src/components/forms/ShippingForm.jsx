import React from 'react';
import Input from '@/components/common/Input';
import { INDIAN_STATES } from '@/constants/indianStates';
import { MapPin, ShieldCheck } from 'lucide-react';

export default function ShippingForm({ formData, onChange, errors = {} }) {
  return (
    <div className="space-y-4 text-left">
      {/* Domestic Dispatch Banner */}
      <div className="flex items-center justify-between px-3.5 py-2 rounded-xs bg-[#F5F5F4] border border-[#E7E5E4] text-[11px] text-[#57534E]">
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-[#1C1917] stroke-[1.5]" />
          <span>Consignment Destination: <strong className="text-[#1C1917] font-semibold">India (Domestic Courier Network)</strong></span>
        </div>
        <span className="font-mono text-[10px] text-[#78716C] uppercase tracking-wider hidden sm:inline">SpeedPost & BlueDart Enabled</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Full Recipient Name"
          placeholder="Aarav Sharma"
          value={formData.fullName || ''}
          onChange={(e) => onChange('fullName', e.target.value)}
          error={errors.fullName}
          required
        />
        <Input
          label="Email for Order Updates"
          type="email"
          placeholder="aarav.sharma@example.com"
          value={formData.email || ''}
          onChange={(e) => onChange('email', e.target.value)}
          error={errors.email}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Mobile Phone Number"
          type="tel"
          placeholder="+91 98765 43210"
          value={formData.phone || ''}
          onChange={(e) => onChange('phone', e.target.value)}
          error={errors.phone}
          helperText="10-digit Indian mobile number for courier SMS delivery alerts"
          required
        />
        <Input
          label="Flat, House no., Building, Street Address"
          placeholder="Flat 402, Lotus Towers, Road No. 36, Jubilee Hills"
          value={formData.address || ''}
          onChange={(e) => onChange('address', e.target.value)}
          error={errors.address}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Input
          label="City / District"
          placeholder="Hyderabad"
          value={formData.city || ''}
          onChange={(e) => onChange('city', e.target.value)}
          error={errors.city}
          required
        />

        {/* Indian State / Union Territory Dropdown */}
        <div className="w-full text-left">
          <label
            htmlFor="shipping-state"
            className="block text-[11px] font-semibold text-[#57534E] uppercase tracking-[0.08em] mb-1.5"
          >
            State / UT <span className="text-[#991B1B]">*</span>
          </label>
          <div className="relative">
            <select
              id="shipping-state"
              value={formData.state || ''}
              onChange={(e) => onChange('state', e.target.value)}
              className={`block w-full rounded-xs border text-xs sm:text-sm py-2 px-3 bg-white text-[#1C1917] focus:outline-none transition-colors duration-150 ${
                errors.state
                  ? 'border-[#DC2626] text-[#7F1D1D] focus:border-[#991B1B] focus:ring-1 focus:ring-[#991B1B]'
                  : 'border-[#D6D3D1] hover:border-[#A8A29E] focus:border-[#1C1917] focus:ring-1 focus:ring-[#1C1917]'
              }`}
            >
              <option value="">Select State / UT</option>
              {INDIAN_STATES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
          {errors.state && (
            <p className="mt-1 text-xs text-[#DC2626] font-medium tracking-wide">
              {errors.state}
            </p>
          )}
        </div>

        {/* Indian 6-digit PIN code */}
        <Input
          label="PIN Code (6 digits)"
          placeholder="500033"
          maxLength={6}
          value={formData.zip || ''}
          onChange={(e) => {
            // Only allow digits up to 6 characters
            const digits = e.target.value.replace(/\D/g, '').slice(0, 6);
            onChange('zip', digits);
          }}
          error={errors.zip}
          helperText="Standard 6-digit Indian postal code"
          required
        />
      </div>
    </div>
  );
}
