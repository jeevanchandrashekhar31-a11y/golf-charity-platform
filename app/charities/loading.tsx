import { Skeleton } from '@/components/ui/skeleton';

export default function CharitiesLoading() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <Skeleton className="h-12 w-96 bg-white/5 rounded-xl mx-auto" />
          <Skeleton className="h-5 w-2/3 bg-white/5 rounded mx-auto" />
          <Skeleton className="h-5 w-1/2 bg-white/5 rounded mx-auto" />
        </div>

        {/* Filters skeleton */}
        <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 mb-8 flex flex-col md:flex-row gap-6 items-center justify-between">
          <Skeleton className="h-12 w-full md:max-w-md bg-white/5 rounded-xl" />
          <div className="flex gap-2 flex-wrap">
            {[...Array(7)].map((_, i) => (
              <Skeleton key={i} className="h-9 w-24 bg-white/5 rounded-full" />
            ))}
          </div>
        </div>

        {/* Grid skeleton */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[#111827] border border-white/5 rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-start">
                <Skeleton className="w-16 h-16 rounded-full bg-white/5" />
                <Skeleton className="h-6 w-20 rounded-full bg-white/5" />
              </div>
              <Skeleton className="h-6 w-3/4 bg-white/5 rounded" />
              <Skeleton className="h-4 w-full bg-white/5 rounded" />
              <Skeleton className="h-4 w-4/5 bg-white/5 rounded" />
              <Skeleton className="h-4 w-2/3 bg-white/5 rounded" />
              <div className="pt-4 border-t border-white/5 space-y-2">
                <Skeleton className="h-3 w-32 bg-white/5 rounded" />
                <Skeleton className="h-8 w-24 bg-white/5 rounded" />
              </div>
              <Skeleton className="h-12 w-full bg-white/5 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
