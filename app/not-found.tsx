import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Giant 404 */}
        <div className="relative">
          <p className="font-syne font-black text-[160px] md:text-[220px] leading-none text-white/5 select-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-[#10B981] animate-bounce" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="font-syne text-3xl md:text-4xl font-bold text-white">
            Page Not Found
          </h1>
          <p className="text-white/60 text-lg max-w-sm mx-auto leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on the fairway.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-[#10B981] hover:bg-[#10B981]/90 text-white font-medium rounded-xl transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-transparent border border-white/20 text-white hover:bg-white/10 font-medium rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            My Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
