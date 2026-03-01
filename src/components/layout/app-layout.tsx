import { Sidebar } from "./sidebar";
import Link from "next/link";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="lg:pl-64 min-h-screen">
        <div className="p-6 lg:p-8 pt-16 lg:pt-8 pb-24">
          {children}
        </div>
      </main>
      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 lg:left-64 bg-slate-900/80 backdrop-blur border-t border-white/10 z-30">
        <div className="px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">BountyOps</span>
            <span>—</span>
            <span>Built by Anand Sundar</span>
            <span>|</span>
            <Link 
              href="https://github.com/AnandSundar" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neon-teal hover:underline"
            >
              https://github.com/AnandSundar
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            Demo application. All data is fictional and for portfolio purposes only.
          </p>
        </div>
      </footer>
    </div>
  );
}
