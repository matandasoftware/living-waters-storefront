export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#d9e2c3] border-t-[#556B2F]" />
      <p className="text-sm text-gray-600">Loading Living Waters…</p>
    </div>
  );
}