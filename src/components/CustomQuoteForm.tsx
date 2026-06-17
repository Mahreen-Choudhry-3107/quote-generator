import { useState, FormEvent } from 'react';

interface CustomQuoteFormProps {
  onCustomQuoteSubmit: (custom: { text: string; author: string; category: string; context?: string }) => void;
}

export default function CustomQuoteForm(props: CustomQuoteFormProps) {
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('Personal Inscription');
  const [context, setContext] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (text.trim() === '') {
      setErrorMsg('Please enter quote text.');
      return;
    }
    setErrorMsg('');
    props.onCustomQuoteSubmit({
      text: text.trim(),
      author: author.trim() === '' ? 'Anonymous' : author.trim(),
      category: category,
      context: context.trim() === '' ? undefined : context.trim(),
    });
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="w-full max-w-4xl mx-auto rounded-xl border border-[#E5E5E5]/10 bg-[#0D0D0F] p-6 md:p-8"
      id="custom-quote-form"
    >
      <div className="mb-6">
        <h3 className="font-serif text-lg text-[#E5E5E5] mb-1 font-medium">Inscribe Your Own Wisdom</h3>
        <p className="font-sans text-xs text-[#A1A1AA]">
          Compose your personal philosophy or favorite saying to inspect it in our editorial templates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="md:col-span-2">
          <label className="block text-[10px] uppercase tracking-widest text-[#A1A1AA] mb-1 font-sans font-semibold">
            Quote Text *
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your quote here..."
            rows={2}
            className="w-full bg-[#0D0D0F] border border-[#E5E5E5]/10 rounded-lg p-3 text-sm text-[#E5E5E5] placeholder-[#A1A1AA]/30 focus:outline-none focus:border-[#E5E5E5]/50 focus:ring-1 focus:ring-[#E5E5E5]/30 transition-all font-sans"
            id="custom-quote-text"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest text-[#A1A1AA] mb-1 font-sans font-semibold">
            Author Name
          </label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="e.g. Mahreen Choudhry"
            className="w-full bg-[#0D0D0F] border border-[#E5E5E5]/10 rounded-lg p-3 text-sm text-[#E5E5E5] placeholder-[#A1A1AA]/30 focus:outline-none focus:border-[#E5E5E5]/50 focus:ring-1 focus:ring-[#E5E5E5]/30 transition-all font-sans"
            id="custom-quote-author"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest text-[#A1A1AA] mb-1 font-sans font-semibold">
            Origin / Context
          </label>
          <input
            type="text"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="e.g. Personal Reflections, 2026"
            className="w-full bg-[#0D0D0F] border border-[#E5E5E5]/10 rounded-lg p-3 text-sm text-[#E5E5E5] placeholder-[#A1A1AA]/30 focus:outline-none focus:border-[#E5E5E5]/50 focus:ring-1 focus:ring-[#E5E5E5]/30 transition-all font-sans"
            id="custom-quote-context"
          />
        </div>
      </div>

      {errorMsg && (
        <p className="text-xs text-[#E5E5E5]/80 mb-3 bg-[#E5E5E5]/5 p-2 rounded border border-[#E5E5E5]/10 font-sans">
          {errorMsg}
        </p>
      )}

      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={() => {
            setText("The power to create beautiful things lies in finding simple, meaningful structures.");
            setAuthor("Mahreen Choudhry");
            setContext("On Architectural Simplicity, 2026");
            setCategory("Personal Inscription");
          }}
          className="px-4 py-2 border border-[#E5E5E5]/10 hover:bg-[#E5E5E5]/5 text-xs tracking-wider uppercase rounded-lg text-[#A1A1AA] hover:text-[#E5E5E5] transition-all font-sans cursor-pointer"
        >
          Load Sample
        </button>
        <button
          type="submit"
          className="px-5 py-2 bg-transparent border border-[#E5E5E5] text-[#E5E5E5] hover:bg-[#E5E5E5] hover:text-[#0D0D0F] text-xs font-semibold tracking-wider uppercase rounded-lg transition-all font-sans cursor-pointer shadow-lg shadow-black/30"
        >
          Render Custom Layout
        </button>
      </div>
    </form>
  );
}
