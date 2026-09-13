'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ExtraitsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/catalogue');
  }, [router]);

  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <p className="text-slate-600 font-medium">Redirection vers le catalogue en cours...</p>
    </div>
  );
}
