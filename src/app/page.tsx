import { TranslationCard } from "@/components/translation-card";
import { Globe } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-6 md:p-8 selection:bg-accent/30 selection:text-accent-foreground">
      <div className="w-full max-w-2xl space-y-8">
        <header className="text-center space-y-2">
          <div className="inline-flex items-center justify-center gap-3">
            <Globe className="h-12 w-12 text-primary" />
            <h1 className="text-5xl font-extrabold tracking-tight text-primary">
              LinguaLive
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            AI-Powered Real-Time Translation. Break language barriers effortlessly.
          </p>
        </header>
        
        <TranslationCard />
        
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} LinguaLive. Experience seamless global communication.</p>
        </footer>
      </div>
    </main>
  );
}
