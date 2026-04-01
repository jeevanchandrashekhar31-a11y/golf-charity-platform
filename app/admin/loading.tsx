import { Skeleton } from '@/components/ui/skeleton';

export default function AdminLoading() {
  return (
    <div className="p-6 md:p-10 space-y-8">
      <Skeleton className="h-10 w-72 bg-white/5 rounded-xl" />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-[#111827] border border-white/5 rounded-2xl p-6 flex items-center justify-between">
            <div className="space-y-3">
              <Skeleton className="h-3 w-32 bg-white/5 rounded" />
              <Skeleton className="h-9 w-20 bg-white/5 rounded" />
            </div>
            <Skeleton className="w-14 h-14 rounded-full bg-white/5 shrink-0" />
          </div>
        ))}
      </div>

      <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 space-y-4">
        <Skeleton className="h-5 w-40 bg-white/5 rounded" />
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex gap-4 py-3 border-b border-white/5">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-40 bg-white/5 rounded" />
              <Skeleton className="h-3 w-28 bg-white/5 rounded" />
            </div>
            <Skeleton className="h-6 w-16 bg-white/5 rounded-full shrink-0" />
            <Skeleton className="h-6 w-20 bg-white/5 rounded shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
