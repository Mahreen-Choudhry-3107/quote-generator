import { motion, AnimatePresence } from 'motion/react';
import { DesignLayout, Quote } from '../types';

interface QuoteDisplayProps {
  quote: Quote;
  layout: DesignLayout;
}

export default function QuoteDisplay(props: QuoteDisplayProps) {
  const currentQuote = props.quote;
  const currentLayout = props.layout;

  return (
    <div 
      className="relative min-h-[300px] w-full max-w-4xl mx-auto rounded-xl border border-[#E5E5E5]/10 bg-[#0D0D0F] flex flex-col justify-center p-8 md:p-12 overflow-hidden shadow-2xl shadow-black/80"
      id="quote-display-container"
    >
      {/* Background elegant grid pattern embedded in our color scheme */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#E5E5E5_1px,transparent_1px),linear-gradient(to_bottom,#E5E5E5_1px,transparent_1px)] bg-[size:32px_32px]" />

      {/* Elegant background oversized quote symbol ornament */}
      <div className="absolute -bottom-24 -right-12 text-[260px] font-serif font-semibold text-[#E5E5E5] opacity-[0.02] pointer-events-none select-none">
        “
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuote.id + currentLayout}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative z-10 w-full flex flex-col justify-between h-full"
        >
          {/* Theme Indicator at the top */}
          <div className="flex justify-between items-center mb-6">
            <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#A1A1AA] font-semibold">
              {currentQuote.category}
            </span>
            <span className="font-sans text-[10px] tracking-[0.2em] text-[#A1A1AA]/50 uppercase font-medium">
              Style: {currentLayout}
            </span>
          </div>

          <div className="flex-grow flex flex-col justify-center">
            {currentLayout === 'editorial' && (
              <div className="text-center py-6">
                <span className="font-serif text-6xl text-[#E5E5E5]/10 select-none block leading-none font-bold -mb-4">“</span>
                <p className="font-serif text-2xl md:text-3xl lg:text-3xl italic text-[#E5E5E5] leading-relaxed max-w-2xl mx-auto px-4">
                  {currentQuote.text}
                </p>
                <div className="w-12 h-[1px] bg-[#E5E5E5]/20 mx-auto my-6" />
                <p className="font-sans text-sm tracking-widest uppercase text-[#E5E5E5] font-semibold">
                  {currentQuote.author}
                </p>
                {currentQuote.context && (
                  <p className="font-serif text-xs italic text-[#A1A1AA] mt-1">
                    {currentQuote.context}
                  </p>
                )}
              </div>
            )}

            {currentLayout === 'minimalist' && (
              <div className="text-left py-4 pl-4 md:pl-8 border-l-2 border-[#E5E5E5]/20">
                <span className="font-serif text-4xl text-[#E5E5E5]/10 block mb-2 leading-none font-bold">“</span>
                <p className="font-sans text-xl md:text-2xl font-light text-[#E5E5E5] leading-relaxed tracking-wide">
                  {currentQuote.text}
                </p>
                <div className="mt-6 flex flex-col md:flex-row md:items-center gap-2">
                  <p className="font-sans text-sm font-semibold tracking-wider text-[#A1A1AA] flex items-center">
                    <span className="w-6 h-[1px] bg-[#A1A1AA]/50 mr-2.5 inline-block" />
                    {currentQuote.author}
                  </p>
                  {currentQuote.context && (
                    <span className="hidden md:inline text-[#A1A1AA]/30 text-xs">•</span>
                  )}
                  {currentQuote.context && (
                    <p className="font-sans text-xs tracking-wide text-[#A1A1AA]/80">
                      {currentQuote.context}
                    </p>
                  )}
                </div>
              </div>
            )}

            {currentLayout === 'brutalist' && (
              <div className="font-mono text-left py-6 border border-[#E5E5E5]/15 p-6 md:p-8 bg-[#0D0D0F]">
                <div className="flex justify-between border-b border-[#E5E5E5]/10 pb-3 mb-6 text-[10px] text-[#A1A1AA] tracking-wider font-semibold">
                  <span>[RECORD_ID: {currentQuote.id}]</span>
                  <span>[CHAR_LENGTH: {currentQuote.text.length}]</span>
                </div>
                <p className="text-base md:text-lg text-[#E5E5E5] uppercase leading-relaxed font-mono">
                  &gt; {currentQuote.text}
                </p>
                <div className="mt-8 pt-4 border-t border-[#E5E5E5]/10 text-xs flex flex-col gap-1 text-[#A1A1AA]">
                  <p className="font-bold tracking-wider">[AUTHOR: {currentQuote.author.toUpperCase()}]</p>
                  {currentQuote.context && (
                    <p className="text-[11px] font-mono tracking-wide text-[#A1A1AA]/60">
                      [CONTEXT: {currentQuote.context.toUpperCase()}]
                    </p>
                  )}
                </div>
              </div>
            )}

            {currentLayout === 'focus' && (
              <div className="text-center py-8">
                <p className="font-sans text-3xl md:text-4xl lg:text-4xl font-semibold text-[#E5E5E5] leading-tight max-w-2xl mx-auto tracking-tighter">
                  "{currentQuote.text.toUpperCase()}"
                </p>
                <p className="font-sans text-sm uppercase tracking-[0.2em] text-[#A1A1AA] mt-8 font-semibold">
                  {currentQuote.author}
                </p>
                {currentQuote.context && (
                  <p className="font-sans text-[11px] tracking-wider text-[#A1A1AA]/50 mt-1">
                    {currentQuote.context}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Footer of display box */}
          <div className="mt-6 pt-4 border-t border-[#E5E5E5]/10 flex justify-between items-center text-[10px] tracking-widest text-[#A1A1AA]/50 font-sans font-semibold">
            <span>THE CONTEMPLATION ENGINE</span>
            <span>INTENTIONAL DESIGN</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
