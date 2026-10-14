import React, { useState, useEffect } from 'react';
import Input from '@/components/common/Input';
import PasswordField from './PasswordField';
import Button from '@/components/common/Button';
import { AlertCircle } from 'lucide-react';

export default function LoginForm({
  role = 'customer',
  onRoleChange,
  onSubmit,
  isLoading,
  errorMessage = '',
  onClearError,
}) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  // Reset form errors if role toggles
  useEffect(() => {
    setErrors({});
    if (onClearError) onClearError();
  }, [role]);

  const validate = () => {
    const errs = {};
    if (!identifier.trim()) {
      errs.identifier = 'Email or username is required.';
    }
    if (!password) {
      errs.password = 'Password is required.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(identifier, password, role);
    }
  };

  const handleIdentifierChange = (val) => {
    setIdentifier(val);
    if (errors.identifier) setErrors({ ...errors, identifier: null });
    if (errorMessage && onClearError) onClearError();
  };

  const handlePasswordChange = (val) => {
    setPassword(val);
    if (errors.password) setErrors({ ...errors, password: null });
    if (errorMessage && onClearError) onClearError();
  };

  const isMerchant = role === 'merchant';
  const isAdmin = role === 'admin';
  const submitButtonText = isMerchant
    ? 'Login to Store Dashboard'
    : isAdmin
      ? 'Login to Admin Dashboard'
      : 'Login as Customer';
  const roleLabel = isMerchant ? 'Merchant' : isAdmin ? 'Admin' : 'Customer';
  const otherRoles = [
    { role: 'customer', label: 'Customer' },
    { role: 'merchant', label: 'Merchant' },
    { role: 'admin', label: 'Admin' },
  ].filter((option) => option.role !== role);

  const isEmailMissingError =
    errorMessage && errorMessage.toLowerCase().includes('email does not exist');
  const isPasswordWrongError =
    errorMessage && errorMessage.toLowerCase().includes('incorrect password');

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Prominent API Error Alert Message */}
      {errorMessage && (
        <div
          role="alert"
          className="p-3 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xs flex items-start gap-2.5 text-xs text-[#991B1B] animate-in fade-in duration-200"
        >
          <AlertCircle className="w-4 h-4 shrink-0 text-[#DC2626] mt-0.5" />
          <span className="font-medium leading-relaxed">{errorMessage}</span>
        </div>
      )}

      <Input
        label={
          isMerchant
            ? 'Merchant ID or Store Email'
            : isAdmin
              ? 'Admin Username or Email'
              : 'Username or Email'
        }
        type="text"
        placeholder={
          isMerchant
            ? 'e.g. merchant or partner@nexcart.com'
            : isAdmin
              ? 'e.g. emilys or emilys@example.com'
              : 'e.g. michaelw or michaelw@example.com'
        }
        value={identifier}
        onChange={(e) => handleIdentifierChange(e.target.value)}
        error={errors.identifier || (isEmailMissingError ? errorMessage : null)}
        required
      />

      <PasswordField
        label="Password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => handlePasswordChange(e.target.value)}
        error={errors.password || (isPasswordWrongError ? errorMessage : null)}
        required
      />

      {/* Primary Submit CTA */}
      <Button
        type="submit"
        variant="primary"
        size="md"
        className="w-full mt-1 py-2.5 font-medium tracking-wide"
        isLoading={isLoading}
      >
        {submitButtonText}
      </Button>

      {/* In-Form Fallback Switcher */}
      <div className="pt-2 text-center text-xs text-[#78716C]">
        <span>Sign in as {roleLabel} or switch to </span>
        {otherRoles.map((option, index) => (
          <React.Fragment key={option.role}>
            {index > 0 && <span> / </span>}
            <button
              type="button"
              onClick={() => onRoleChange && onRoleChange(option.role)}
              className="font-semibold text-[#1C1917] hover:underline cursor-pointer transition-colors"
            >
              {option.label}
            </button>
          </React.Fragment>
        ))}
      </div>
    </form>
  );
}
