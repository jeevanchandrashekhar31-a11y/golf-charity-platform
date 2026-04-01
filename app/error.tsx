'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-10 h-10 text-red-400" />
        </div>

        <div className="space-y-3">
          <h1 className="font-syne text-4xl font-black text-white">Something went wrong</h1>
          <p className="text-white/60 text-lg leading-relaxed">
            An unexpected error occurred. Our team has been notified and is working on a fix.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <p className="text-red-400/80 text-sm font-mono bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-left break-all">
              {error.message}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-[#10B981] hover:bg-[#10B981]/90 text-white font-medium rounded-xl transition-colors"
          >
            <RefreshCcw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-transparent border border-white/20 text-white hover:bg-white/10 font-medium rounded-xl transition-colors"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
