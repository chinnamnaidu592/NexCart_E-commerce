'use client';

import React from 'react';
import DepartmentPage from './[slug]/page';
import { useSearchParams } from '@/router/RouterContext';

export default function GenericDepartmentPage() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('dept') || searchParams.get('category') || 'electronics';
  return <DepartmentPage slugOverride={slug} />;
}
