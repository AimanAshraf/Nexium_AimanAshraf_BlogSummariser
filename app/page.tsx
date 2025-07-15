'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, Zap } from 'lucide-react';
import { motion, useAnimation, useInView } from 'framer-motion';

export default function Home() {
  const [url, setUrl] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions] = useState([
    'https://example.com/blog1',
    'https://example.com/tutorial2',
    'https://example.com/news3',
    'https://example.com/guide4',
    'https://example.com/article5'
  ]);
  const [loading, setLoading] = useState(false);
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const handleSubmit = async () => {
    if (!url.trim()) return;
    setLoading(true);
    await new Promise((res) => setTimeout(res, 1000));
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-16 px-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm border border-purple-100 shadow-2xl rounded-3xl p-16 relative overflow-visible min-h-[450px]"
        ref={ref}
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="text-center mb-8 relative"
        >
          <div className="flex justify-center items-center gap-2 mb-2">
            <Sparkles className="text-purple-500" size={24} />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Blog Summarizer Pro
            </h1>
            <Sparkles className="text-blue-500" size={24} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 mb-6 relative"
        >
          <div className="relative flex-1">
            <motion.label
              htmlFor="url-input"
              className={`absolute left-4 transition-all duration-200 pointer-events-none text-purple-500 ${
                url ? 'text-xs top-2' : 'text-sm top-4'
              }`}
            >
              Paste blog URL
            </motion.label>
            <Input
              id="url-input"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder={url ? '' : 'Paste blog URL'}
              disabled={loading}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-full pt-6 pb-2 px-4 text-base rounded-xl border-2 border-purple-200 focus:border-purple-400 focus-visible:ring-0"
            />
            {showSuggestions && (
              <ul className="absolute z-10 mt-2 w-full bg-white border border-purple-200 rounded-lg shadow-md">
                {suggestions.map((s, i) => (
                  <li
                    key={i}
                    onClick={() => {
                      setUrl(s);
                      setShowSuggestions(false);
                    }}
                    className="px-4 py-2 hover:bg-purple-50 cursor-pointer text-sm text-gray-700"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="rounded-xl text-base py-6 px-6 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all shadow-md hover:shadow-lg relative overflow-hidden group"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  <span className="relative">Processing...</span>
                </>
              ) : (
                <>
                  <Zap className="mr-2" size={20} />
                  <span className="relative">Summarize Now</span>
                </>
              )}
              <motion.span
                className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10"
                initial={{ x: -100 }}
                animate={{ x: 100 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
