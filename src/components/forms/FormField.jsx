import React from 'react';
import Input from '@/components/common/Input';

export default function FormField({ label, error, required, ...props }) {
  return <Input label={label} error={error} required={required} {...props} />;
}
