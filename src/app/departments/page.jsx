'use client';

import DepartmentPage from '@/app/department/[slug]/page';
import { useSearchParams } from '@/router/RouterContext';

export default function DepartmentsPage() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('dept') || searchParams.get('category') || 'electronics';
  return <DepartmentPage slugOverride={slug} />;
}
