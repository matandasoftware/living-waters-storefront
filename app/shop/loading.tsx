export default function ShopLoading() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8">
      <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
      <div className="mt-6 h-11 w-full animate-pulse rounded bg-gray-200" />
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-xl border">
            <div className="h-44 animate-pulse bg-gray-200" />
            <div className="space-y-2 p-4">
              <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}