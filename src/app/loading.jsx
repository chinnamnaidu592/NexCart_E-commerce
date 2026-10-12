'use client';

import React from 'react';
import Loader from '@/components/common/Loader';

export default function Loading() {
  return <Loader message="Loading NexCart..." fullScreen={true} />;
}
