import React, { useState, useEffect } from 'react';
import Input from '@/components/common/Input';
import PasswordField from './PasswordField';
import Button from '@/components/common/Button';
import { isValidEmail, validatePassword } from '@/utils/validators';
import { INDIAN_STATES } from '@/constants/indianStates';

const MERCHANT_CATEGORIES = [
  'Fashion & Apparel',
  'Home & Living',
  'Jewelry & Watches',
  'Beauty & Fragrance',
  'Electronics & Tech',
  'Craft & Artisan Works',
  'Art & Archival Objects',
];

export default function RegisterForm({ role = 'customer', onSubmit, isLoading }) {
  const isMerchant = role === 'merchant';

  const [formData, setFormData] = useState({
    // Standard User Fields
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',

    // Merchant Compliance & Business Fields
    storeName: '',
    storeCategory: 'Fashion & Apparel',
    gstin: '',
    pan: '',
    bankAccountName: '',
    bankAccountNumber: '',
    bankIfscCode: '',
    pickupAddressLine: '',
    pickupCity: '',
    pickupState: '',
    pickupPincode: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setErrors({});
  }, [role]);

  const validateField = (field, value) => {
    let err = null;
    const trimmed = String(value || '').trim();

    // Common validations
    if (field === 'firstName' && !trimmed) {
      err = isMerchant ? 'Merchant Founder / Authorised first name is required.' : 'First name is required.';
    }
    if (field === 'lastName' && !trimmed) {
      err = isMerchant ? 'Merchant Founder / Authorised last name is required.' : 'Last name is required.';
    }
    if (field === 'email') {
      if (!trimmed) err = isMerchant ? 'Business email address is required.' : 'Email address is required.';
      else if (!isValidEmail(trimmed)) err = 'Please enter a valid email format (e.g. name@domain.com).';
    }
    if (field === 'password') {
      err = validatePassword(value);
    }
    if (field === 'confirmPassword') {
      if (!value) err = 'Please confirm your password.';
      else if (value !== formData.password) err = 'Passwords do not match.';
    }

    // Merchant Compliance Validations
    if (isMerchant) {
      if (field === 'storeName' && !trimmed) {
        err = 'Store Display / Brand Name is required.';
      }
      if (field === 'gstin') {
        if (!trimmed) err = 'GSTIN (Tax Identification) is mandatory.';
        else if (trimmed.length < 15) err = 'GSTIN must be at least 15 characters (e.g. 22AAAAA0000A1Z5).';
      }
      if (field === 'pan') {
        if (!trimmed) err = 'Business / Entity PAN is mandatory.';
        else if (trimmed.length < 10) err = 'PAN must be 10 characters (e.g. ABCDE1234F).';
      }
      if (field === 'bankAccountName' && !trimmed) {
        err = 'Bank Account Holder Name is mandatory.';
      }
      if (field === 'bankAccountNumber') {
        if (!trimmed) err = 'Bank Account Number is mandatory.';
        else if (trimmed.length < 8) err = 'Enter a valid bank account number.';
      }
      if (field === 'bankIfscCode') {
        if (!trimmed) err = 'Bank IFSC / Routing Code is mandatory.';
        else if (trimmed.length < 8) err = 'IFSC code must be valid (e.g. HDFC0001234).';
      }
      if (field === 'pickupAddressLine' && !trimmed) {
        err = 'Dispatch / Pickup street address is mandatory.';
      }
      if (field === 'pickupCity' && !trimmed) {
        err = 'Pickup city is required.';
      }
      if (field === 'pickupState' && !trimmed) {
        err = 'Pickup state is required.';
      }
      if (field === 'pickupPincode') {
        if (!trimmed) err = 'Postal PIN code is required.';
        else if (!/^[1-9][0-9]{5}$/.test(trimmed)) err = 'Enter a valid 6-digit Indian PIN code (e.g. 400001).';
      }
    }


    return err;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleBlur = (field) => {
    const err = validateField(field, formData[field]);
    if (err) {
      setErrors((prev) => ({ ...prev, [field]: err }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    const fieldsToValidate = ['firstName', 'lastName', 'email', 'password', 'confirmPassword'];

    if (isMerchant) {
      fieldsToValidate.push(
        'storeName',
        'gstin',
        'pan',
        'bankAccountName',
        'bankAccountNumber',
        'bankIfscCode',
        'pickupAddressLine',
        'pickupCity',
        'pickupState',
        'pickupPincode'
      );
    }

    fieldsToValidate.forEach((field) => {
      const err = validateField(field, formData[field]);
      if (err) newErrors[field] = err;
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      // Package submission payload
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: isMerchant ? 'merchant' : 'customer',
      };

      if (isMerchant) {
        payload.storeName = formData.storeName.trim();
        payload.storeCategory = formData.storeCategory;
        payload.gstin = formData.gstin.trim().toUpperCase();
        payload.pan = formData.pan.trim().toUpperCase();
        payload.bankAccount = {
          holderName: formData.bankAccountName.trim(),
          accountNumber: formData.bankAccountNumber.trim(),
          ifscCode: formData.bankIfscCode.trim().toUpperCase(),
        };
        payload.pickupAddress = {
          addressLine: formData.pickupAddressLine.trim(),
          city: formData.pickupCity.trim(),
          state: formData.pickupState.trim(),
          pincode: formData.pickupPincode.trim(),
        };
      }

      onSubmit(payload);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* ========================================================
          MERCHANT SPECIFIC SECTION 1: STORE & TAX COMPLIANCE
      ======================================================== */}
      {isMerchant && (
        <div className="space-y-3.5 bg-[#FAF8F5] p-3.5 rounded-xs border border-[#E7E5E4] mb-3">
          <div className="border-b border-[#E7E5E4] pb-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#78716C] font-semibold block">
              1. Store Identity & Taxonomy
            </span>
          </div>

          <Input
            label="Store Display Name"
            placeholder="e.g. Laurent Craft Studio"
            value={formData.storeName}
            onChange={(e) => handleChange('storeName', e.target.value)}
            onBlur={() => handleBlur('storeName')}
            error={errors.storeName}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-[#1C1917] mb-1">
              Primary Store Category <span className="text-[#991B1B]">*</span>
            </label>
            <select
              value={formData.storeCategory}
              onChange={(e) => handleChange('storeCategory', e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-[#D6D3D1] rounded-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917] transition-colors cursor-pointer"
            >
              {MERCHANT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="border-t border-[#E7E5E4] pt-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#78716C] font-semibold block mb-2">
              2. Commercial Tax Identification
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <Input
                label="GSTIN (15-digit Tax ID)"
                placeholder="22AAAAA0000A1Z5"
                value={formData.gstin}
                onChange={(e) => handleChange('gstin', e.target.value.toUpperCase())}
                onBlur={() => handleBlur('gstin')}
                error={errors.gstin}
                required
              />
              <Input
                label="Entity / Merchant PAN"
                placeholder="ABCDE1234F"
                value={formData.pan}
                onChange={(e) => handleChange('pan', e.target.value.toUpperCase())}
                onBlur={() => handleBlur('pan')}
                error={errors.pan}
                required
              />
            </div>
          </div>

          <div className="border-t border-[#E7E5E4] pt-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#78716C] font-semibold block mb-2">
              3. Business Settlement Bank Account
            </span>
            <div className="space-y-2.5">
              <Input
                label="Bank Account Beneficiary Name"
                placeholder="Laurent Crafts Enterprise Ltd."
                value={formData.bankAccountName}
                onChange={(e) => handleChange('bankAccountName', e.target.value)}
                onBlur={() => handleBlur('bankAccountName')}
                error={errors.bankAccountName}
                required
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <Input
                  label="Account Number"
                  placeholder="9876543210123"
                  value={formData.bankAccountNumber}
                  onChange={(e) => handleChange('bankAccountNumber', e.target.value)}
                  onBlur={() => handleBlur('bankAccountNumber')}
                  error={errors.bankAccountNumber}
                  required
                />
                <Input
                  label="Bank IFSC / Branch Code"
                  placeholder="HDFC0001234"
                  value={formData.bankIfscCode}
                  onChange={(e) => handleChange('bankIfscCode', e.target.value.toUpperCase())}
                  onBlur={() => handleBlur('bankIfscCode')}
                  error={errors.bankIfscCode}
                  required
                />
              </div>
            </div>
          </div>

          <div className="border-t border-[#E7E5E4] pt-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#78716C] font-semibold block mb-2">
              4. Merchant Warehouse & Pickup Address Layout
            </span>
            <div className="space-y-2.5">
              <Input
                label="Pickup Street Address / Studio Layout"
                placeholder="Plot 42, Artisan Industrial Complex, Phase 2"
                value={formData.pickupAddressLine}
                onChange={(e) => handleChange('pickupAddressLine', e.target.value)}
                onBlur={() => handleBlur('pickupAddressLine')}
                error={errors.pickupAddressLine}
                required
              />
              <div className="grid grid-cols-3 gap-2">
                <Input
                  label="City"
                  placeholder="Mumbai"
                  value={formData.pickupCity}
                  onChange={(e) => handleChange('pickupCity', e.target.value)}
                  onBlur={() => handleBlur('pickupCity')}
                  error={errors.pickupCity}
                  required
                />
                <div className="w-full text-left">
                  <label
                    htmlFor="merchant-pickup-state"
                    className="block text-[11px] font-semibold text-[#57534E] uppercase tracking-[0.08em] mb-1.5"
                  >
                    State / UT <span className="text-[#991B1B]">*</span>
                  </label>
                  <select
                    id="merchant-pickup-state"
                    value={formData.pickupState}
                    onChange={(e) => handleChange('pickupState', e.target.value)}
                    onBlur={() => handleBlur('pickupState')}
                    className={`block w-full rounded-xs border text-xs sm:text-sm py-2 px-3 bg-white text-[#1C1917] focus:outline-none transition-colors duration-150 ${
                      errors.pickupState
                        ? 'border-[#DC2626] text-[#7F1D1D] focus:border-[#991B1B]'
                        : 'border-[#D6D3D1] hover:border-[#A8A29E] focus:border-[#1C1917]'
                    }`}
                  >
                    <option value="">Select State</option>
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                  {errors.pickupState && (
                    <p className="mt-1 text-xs text-[#DC2626] font-medium tracking-wide">
                      {errors.pickupState}
                    </p>
                  )}
                </div>
                <Input
                  label="PIN Code"
                  placeholder="400001"
                  maxLength={6}
                  value={formData.pickupPincode}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '').slice(0, 6);
                    handleChange('pickupPincode', digits);
                  }}
                  onBlur={() => handleBlur('pickupPincode')}
                  error={errors.pickupPincode}
                  required
                />
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          FOUNDER / CUSTOMER CREDENTIALS & LOGIN SECTION
      ======================================================== */}
      <div>
        {isMerchant && (
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#78716C] font-semibold block mb-2">
            5. Authorised Representative Account Credentials
          </span>
        )}
        <div className="grid grid-cols-2 gap-2.5">
          <Input
            label={isMerchant ? 'Founder / Authorised First Name' : 'First Name'}
            placeholder={isMerchant ? 'Marcus' : 'Jane'}
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            onBlur={() => handleBlur('firstName')}
            error={errors.firstName}
            required
          />
          <Input
            label={isMerchant ? 'Founder / Authorised Last Name' : 'Last Name'}
            placeholder={isMerchant ? 'Vance' : 'Doe'}
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            onBlur={() => handleBlur('lastName')}
            error={errors.lastName}
            required
          />
        </div>
      </div>

      <Input
        label={isMerchant ? 'Merchant Corporate Email' : 'Email Address'}
        type="email"
        placeholder={isMerchant ? 'merchant@laurentcrafts.com' : 'jane.doe@example.com'}
        value={formData.email}
        onChange={(e) => handleChange('email', e.target.value)}
        onBlur={() => handleBlur('email')}
        error={errors.email}
        required
      />

      <PasswordField
        label="Password"
        placeholder="Min 8 chars, 1 uppercase, 1 digit"
        value={formData.password}
        onChange={(e) => handleChange('password', e.target.value)}
        onBlur={() => handleBlur('password')}
        error={errors.password}
        required
      />

      <PasswordField
        label="Confirm Password"
        placeholder="Re-enter password"
        value={formData.confirmPassword}
        onChange={(e) => handleChange('confirmPassword', e.target.value)}
        onBlur={() => handleBlur('confirmPassword')}
        error={errors.confirmPassword}
        required
      />

      <Button
        type="submit"
        variant="primary"
        size="md"
        className="w-full mt-3 py-2.5 font-medium tracking-wide"
        isLoading={isLoading}
      >
        {isMerchant ? 'Register Store Atelier as Merchant' : 'Create Customer Account'}
      </Button>
    </form>
  );
}
