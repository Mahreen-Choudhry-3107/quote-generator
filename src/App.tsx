import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Volume2, 
  Undo, 
  Search, 
  PenTool, 
  BookOpen, 
  Calendar
} from 'lucide-react';
import { Quote, DesignLayout } from './types';
import { CURATED_QUOTES, CATEGORIES } from './data';
import Header from './components/Header';
import QuoteDisplay from './components/QuoteDisplay';
import CustomQuoteForm from './components/CustomQuoteForm';

export default function App() {
  // Compute quote of the day based on the calendar day
  const getQuoteOfTheDay = (): Quote => {
    const day = new Date().getDate();
    const index = day % CURATED_QUOTES.length;
    return CURATED_QUOTES[index];
  };

  // State Declarations
  const [activeQuote, setActiveQuote] = useState<Quote>(getQuoteOfTheDay());
  const [activeLayout, setActiveLayout] = useState<DesignLayout>('editorial');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Themes');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Custom inscriptions stored locally in memory for this session
  const [customQuotes, setCustomQuotes] = useState<Quote[]>([]);
  
  // History stack for undo capability
  const [history, setHistory] = useState<Quote[]>([]);
  
  // Interactive UI Feedbacks
  const [copied, setCopied] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  
  // Navigation tabs for the control panel: 'explore' or 'inscribe'
  const [activeTab, setActiveTab] = useState<'explore' | 'inscribe'>('explore');

  // Cancel any ongoing speech when the active quote changes or the component unmounts
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [activeQuote]);

  // Handle TTS
  const handleTTS = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = `${activeQuote.text} by ${activeQuote.author}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    // Choose a high quality English voice if available
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith('en-') || v.lang.startsWith('en_'));
    if (voice) {
      utterance.voice = voice;
    }
    
    utterance.rate = 0.9; // Slightly slower for elegant posture
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Get combined quote source
  const allQuotes = [
    ...customQuotes,
    ...CURATED_QUOTES
  ];

  // Filters quotes based on current active filters
  const getFilteredQuotes = (): Quote[] => {
    return allQuotes.filter((q) => {
      const matchCategory = selectedCategory === 'All Themes' || q.category === selectedCategory;
      const matchSearch = searchQuery.trim() === '' || 
        q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  };

  // Generates a random quote from the filtered array
  const handleNextQuote = () => {
    const filtered = getFilteredQuotes();
    if (filtered.length === 0) {
      return;
    }
    
    // Push the current quote to history before navigating
    setHistory((prev) => [...prev, activeQuote]);

    // Find a random index that is different from current if possible
    if (filtered.length > 1) {
      let nextQuote = activeQuote;
      while (nextQuote.id === activeQuote.id) {
        const randomIndex = Math.floor(Math.random() * filtered.length);
        nextQuote = filtered[randomIndex];
      }
      setActiveQuote(nextQuote);
    } else {
      setActiveQuote(filtered[0]);
    }
  };

  // Undo navigation
  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setHistory((prev) => prev.slice(0, prev.length - 1));
    setActiveQuote(previous);
  };

  // Clipboard copy
  const handleCopyToClipboard = () => {
    const formattedText = `"${activeQuote.text}" — ${activeQuote.author}${activeQuote.context ? ` (${activeQuote.context})` : ''}`;
    navigator.clipboard.writeText(formattedText)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
  };

  // Inserts a custom quote and sets it active immediately
  const handleCustomQuoteSubmit = (custom: { text: string; author: string; category: string; context?: string }) => {
    const newQuote: Quote = {
      id: `custom-${Date.now()}`,
      text: custom.text,
      author: custom.author,
      category: custom.category,
      context: custom.context
    };

    setCustomQuotes((prev) => [newQuote, ...prev]);
    
    // Save to history and set as active quote immediately
    setHistory((prev) => [...prev, activeQuote]);
    setActiveQuote(newQuote);
    
    // Automatically switch layout view
    setActiveTab('explore');
  };

  // Select Quote of the day quickly
  const handleResetToDay = () => {
    const quoteOfTheDay = getQuoteOfTheDay();
    if (activeQuote.id !== quoteOfTheDay.id) {
      setHistory((prev) => [...prev, activeQuote]);
      setActiveQuote(quoteOfTheDay);
    }
  };

  const filteredPool = getFilteredQuotes();

  return (
    <div 
      className="min-h-screen bg-[#0D0D0F] text-[#E5E5E5] flex flex-col justify-between py-12 px-4 select-none relative font-sans"
      id="root-viewport"
    >
      <div className="flex-grow flex flex-col justify-center items-center w-full max-w-5xl mx-auto">
        
        {/* Header containing name and Mahreen Choudhry credit */}
        <Header />

        {/* Master Preset Customizers */}
        <div className="w-full max-w-4xl mx-auto flex justify-center items-center gap-2 mb-6" id="preset-selector">
          <span className="font-sans text-[10px] uppercase tracking-widest text-[#A1A1AA]/70 hidden md:inline mr-2 font-semibold">
            Layout Preset:
          </span>
          <div className="flex bg-[#0D0D0F] border border-[#E5E5E5]/10 p-1 rounded-lg">
            {(['editorial', 'minimalist', 'brutalist', 'focus'] as DesignLayout[]).map((layout) => (
              <button
                key={layout}
                onClick={() => setActiveLayout(layout)}
                className={`px-4 py-1.5 rounded-md text-[10px] uppercase font-bold tracking-widest transition-all cursor-pointer ${
                  activeLayout === layout 
                    ? 'bg-[#E5E5E5] text-[#0D0D0F]' 
                    : 'text-[#A1A1AA]/60 hover:text-[#E5E5E5]'
                }`}
                id={`layout-${layout}`}
              >
                {layout}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Display Canvas */}
        <QuoteDisplay quote={activeQuote} layout={activeLayout} />

        {/* Primary Interaction Controller Bar */}
        <div className="w-full max-w-4xl mx-auto flex items-center justify-between gap-4 mt-6 mb-12" id="primary-controls">
          <div className="flex items-center gap-2">
            <button
              onClick={handleUndo}
              disabled={history.length === 0}
              className={`p-3 rounded-lg border flex items-center justify-center transition-all ${
                history.length === 0
                  ? 'border-[#E5E5E5]/5 text-[#A1A1AA]/20 cursor-not-allowed'
                  : 'border-[#E5E5E5]/10 text-[#A1A1AA] hover:text-[#E5E5E5] hover:bg-[#E5E5E5]/5 cursor-pointer'
              }`}
              title="Return to Previous Quote"
              id="btn-undo"
            >
              <Undo className="w-4 h-4" />
            </button>

            <button
              onClick={handleResetToDay}
              className="px-3.5 py-3 rounded-lg border border-[#E5E5E5]/10 text-[#A1A1AA] hover:text-[#E5E5E5] hover:bg-[#E5E5E5]/5 flex items-center gap-2 text-xs uppercase tracking-widest transition-all cursor-pointer font-semibold"
              title="Load Calendar Quote of Day"
              id="btn-quote-of-day"
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline font-sans font-semibold text-[10px]">Today</span>
            </button>
          </div>

          {/* Sophisticated Dark button-generate styles */}
          <button
            onClick={handleNextQuote}
            disabled={filteredPool.length === 0}
            className={`px-8 py-3.5 bg-transparent border border-[#E5E5E5] text-[#E5E5E5] rounded-lg text-xs uppercase tracking-[0.15em] font-bold font-sans flex items-center gap-2.5 transition-all shadow-xl shadow-black/40 ${
              filteredPool.length === 0 
                ? 'opacity-40 cursor-not-allowed' 
                : 'hover:bg-[#E5E5E5] hover:text-[#0D0D0F] hover:translate-y-[-1px] cursor-pointer'
            }`}
            id="btn-next-quote"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>New Reflection</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTTS}
              className={`p-3 rounded-lg border border-[#E5E5E5]/10 flex items-center justify-center transition-all cursor-pointer ${
                isSpeaking 
                  ? 'bg-[#E5E5E5]/15 text-[#E5E5E5] animate-pulse border-[#E5E5E5]/40' 
                  : 'text-[#A1A1AA] hover:text-[#E5E5E5] hover:bg-[#E5E5E5]/5'
              }`}
              title={isSpeaking ? "Mute Narration" : "Listen via Audio"}
              id="btn-speak"
            >
              <Volume2 className="w-4 h-4" />
            </button>

            <button
              onClick={handleCopyToClipboard}
              className="p-3 rounded-lg border border-[#E5E5E5]/10 text-[#A1A1AA] hover:text-[#E5E5E5] hover:bg-[#E5E5E5]/5 flex items-center justify-center transition-all cursor-pointer relative"
              title="Copy details to clipboard"
              id="btn-copy"
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.div
                    key="copied"
                    initial={{ scale: 0.75, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.75, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Check className="w-4 h-4 text-[#E5E5E5]" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ scale: 0.75, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.75, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Copy className="w-4 h-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Controls and Search / Creation Panel Drawer */}
        <div className="w-full max-w-4xl mx-auto border-t border-[#E5E5E5]/10 pt-8 mb-6" id="drawer-control-panel">
          
          <div className="flex border-b border-[#E5E5E5]/10 mb-6 pb-2 justify-center gap-8">
            <button
              onClick={() => setActiveTab('explore')}
              className={`pb-2 text-xs uppercase tracking-widest font-sans flex items-center gap-2 border-b-2 transition-all cursor-pointer font-semibold ${
                activeTab === 'explore' 
                  ? 'text-[#E5E5E5] border-[#E5E5E5]' 
                  : 'text-[#A1A1AA]/50 border-transparent hover:text-[#E5E5E5]'
              }`}
              id="tab-explore"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Explore Archives
            </button>
            <button
              onClick={() => setActiveTab('inscribe')}
              className={`pb-2 text-xs uppercase tracking-widest font-sans flex items-center gap-2 border-b-2 transition-all cursor-pointer font-semibold ${
                activeTab === 'inscribe' 
                  ? 'text-[#E5E5E5] border-[#E5E5E5]' 
                  : 'text-[#A1A1AA]/50 border-transparent hover:text-[#E5E5E5]'
              }`}
              id="tab-inscribe"
            >
              <PenTool className="w-3.5 h-3.5" />
              Personal Inscribed Wisdom
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'explore' ? (
              <motion.div
                key="explore-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Category Chips and Filters */}
                <div className="flex flex-wrap gap-2 justify-center" id="category-panel">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        const updatedFiltered = allQuotes.filter(q => cat === 'All Themes' || q.category === cat);
                        if (updatedFiltered.length > 0 && !updatedFiltered.find(q => q.id === activeQuote.id)) {
                          setActiveQuote(updatedFiltered[Math.floor(Math.random() * updatedFiltered.length)]);
                        }
                      }}
                      className={`px-3.5 py-1.5 rounded-full text-[10px] tracking-wider uppercase border font-sans font-bold transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-[#E5E5E5] text-[#0D0D0F] border-[#E5E5E5]'
                          : 'border-[#E5E5E5]/10 text-[#A1A1AA] hover:text-[#E5E5E5] hover:border-[#E5E5E5]/30'
                      }`}
                      id={`cat-chip-${cat.replace(/\s+/g, '-').toLowerCase()}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Keyword search bar to filter inside pool */}
                <div className="relative w-full max-w-md mx-auto">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[#A1A1AA]/40">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                    }}
                    placeholder="Search by Author or Wisdom..."
                    className="w-full bg-[#0D0D0F] border border-[#E5E5E5]/10 text-xs rounded-lg p-3 pl-10 text-[#E5E5E5] placeholder-[#A1A1AA]/30 focus:outline-none focus:border-[#E5E5E5]/40 focus:ring-1 focus:ring-[#E5E5E5]/20 transition-all font-sans"
                    id="search-input"
                  />
                  {searchQuery && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-[10px] text-[#A1A1AA]/50 font-semibold font-mono">
                      Found {filteredPool.length} Match{filteredPool.length === 1 ? '' : 'es'}
                    </span>
                  )}
                </div>

                {filteredPool.length === 0 && (
                  <div className="text-center py-6 text-xs text-[#A1A1AA]/50 font-sans" id="no-quotes-notice">
                    No matching contemplations found inside this theme catalog.
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="inscribe-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <CustomQuoteForm onCustomQuoteSubmit={handleCustomQuoteSubmit} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Exquisite Footer adhering strictly to the dual-color requirement */}
      <footer className="w-full text-center mt-12 border-t border-[#E5E5E5]/10 pt-6 text-[11px] font-sans tracking-widest text-[#A1A1AA]/50 font-semibold" id="app-footer">
        <p>THE CONTINUAL FLOW OF REFINED THOUGHT</p>
        <p className="mt-1">
          CREATED BY <span className="text-[#E5E5E5] font-bold">MAHREEN CHOUDHRY</span>
        </p>
      </footer>
    </div>
  );
}
