import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0F] pt-20 pb-10 border-t border-white/5">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <Link href="/" className="font-syne font-bold text-2xl tracking-tight text-[#F8FAFC] flex items-center gap-2 mb-4">
              GreenPrize
              <div className="w-2 h-2 rounded-full bg-[#10B981] mb-1" />
            </Link>
            <p className="text-white/50 text-sm leading-relaxed">
              Where golf meets giving. Play your standard round, enter your scores, support amazing causes, and win big.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-6">Platform</h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li><Link href="#how-it-works" className="hover:text-white transition-colors">How it Works</Link></li>
              <li><Link href="#charities" className="hover:text-white transition-colors">Charities</Link></li>
              <li><Link href="/subscribe" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">My Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li><Link href="#" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Rules of Play</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-white/40">
          <p>© {new Date().getFullYear()} GreenPrize. All rights reserved.</p>
          <p className="mt-4 md:mt-0">Built for a better world.</p>
        </div>
      </div>
    </footer>
  );
}
