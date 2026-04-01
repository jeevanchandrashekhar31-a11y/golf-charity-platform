import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLoading() {
  return (
    <div className="max-w-6xl mx-auto py-10 px-6 mt-16 md:mt-0 pb-32 space-y-8">
      {/* Header */}
      <Skeleton className="h-10 w-64 bg-white/5 rounded-xl" />

      {/* Stats row */}
      <div className="grid md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-[#111827] border border-white/5 rounded-2xl p-6 space-y-4">
            <Skeleton className="h-4 w-32 bg-white/5 rounded" />
            <Skeleton className="h-10 w-24 bg-white/5 rounded" />
            <Skeleton className="h-3 w-full bg-white/5 rounded" />
          </div>
        ))}
      </div>

      {/* Cards row */}
      <div className="grid md:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-[#111827] border border-white/5 rounded-2xl p-6 space-y-4">
            <Skeleton className="h-5 w-40 bg-white/5 rounded" />
            <Skeleton className="h-4 w-full bg-white/5 rounded" />
            <Skeleton className="h-4 w-3/4 bg-white/5 rounded" />
            <Skeleton className="h-10 w-32 bg-white/5 rounded-xl mt-4" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 space-y-4">
        <Skeleton className="h-5 w-48 bg-white/5 rounded" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-3 border-b border-white/5">
            <Skeleton className="h-10 w-10 rounded-full bg-white/5 shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-32 bg-white/5 rounded" />
              <Skeleton className="h-3 w-24 bg-white/5 rounded" />
            </div>
            <Skeleton className="h-6 w-16 bg-white/5 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
