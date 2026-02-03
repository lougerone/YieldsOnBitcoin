"use client";
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import App from '../../yieldsonbitcoin'

function AllocatePageInner() {
  const searchParams = useSearchParams();
  const strategy = searchParams.get('strategy');
  const isCustom = searchParams.get('custom') === '1';
  return <App initialPage="app" initialView="allocate" initialStrategy={strategy} initialCustom={isCustom} />
}

export default function AllocatePage() {
  return (
    <Suspense fallback={<div style={{ background: "#06070B", minHeight: "100vh" }} />}>
      <AllocatePageInner />
    </Suspense>
  );
}
