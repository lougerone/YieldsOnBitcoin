"use client";
import { use } from 'react';
import App from '../../../yieldsonbitcoin'

export default function ProtocolPage({ params }) {
  const { slug } = use(params);
  return <App initialPage="app" initialView="protocol" initialProtocolSlug={slug} />
}
