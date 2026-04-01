import type { Metadata } from 'next';
import { Syne, DM_Sans } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
});

export const metadata: Metadata = {
  title: 'GreenPrize – Play Golf. Win Prizes. Change Lives.',
  description: 'Subscribe, enter your golf scores, win monthly prizes, and support a charity you love.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${syne.variable} ${dmSans.variable} antialiased bg-[#0A0A0F] text-[#F8FAFC]`}
      >
        {children}
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#111827',
              color: '#F8FAFC',
              border: '1px solid rgba(255,255,255,0.1)',
            }
          }}
        />
      </body>
    </html>
  );
}
