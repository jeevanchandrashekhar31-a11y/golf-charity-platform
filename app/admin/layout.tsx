import { requireAdmin } from '@/lib/auth';
import AdminSidebar from '@/components/layout/AdminSidebar';
import { Menu } from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <AdminSidebar />
      
      <div className="md:pl-64 flex flex-col min-h-screen pb-20 md:pb-0">
        <div className="md:hidden sticky top-0 bg-[#000000]/80 backdrop-blur-md z-30 border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <span className="font-syne font-bold text-xl tracking-tight text-[#10B981]">GP Admin</span>
          <Menu className="w-6 h-6 text-white" />
        </div>
        
        <main className="flex-1 w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
