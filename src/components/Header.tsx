import { Quote as QuoteIcon } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full max-w-4xl mx-auto mb-8 text-center" id="app-header">
      <div className="inline-flex items-center justify-center gap-3 mb-3">
        <QuoteIcon className="w-6 h-6 text-[#E5E5E5]" />
        <h1 className="font-serif text-3xl font-medium tracking-wide text-[#E5E5E5]">
          Contemplation
        </h1>
      </div>
      <p className="font-sans text-xs uppercase tracking-[0.2em] text-[#A1A1AA] font-semibold">
        Curated Thought Engine • Created by Mahreen Choudhry
      </p>
    </header>
  );
}
