// A10: Mishandling of Exceptional Conditions
'use client';

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-red-400 mb-4">Something went wrong</h2>
        <p className="text-slate-400 mb-6">We encountered an unexpected error. Please try again.</p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
