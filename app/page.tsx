'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, Globe, Languages, Clipboard, ClipboardCheck, Share2, RotateCw, BookOpen, Clock, BarChart2, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence, useAnimation, useInView } from 'framer-motion';
import { useCopyToClipboard } from 'react-use';
import { toast } from 'sonner';
import TextareaAutosize from 'react-textarea-autosize';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function Home() {
  const [url, setUrl] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions] = useState([
    'https://example.com/blog1',
    'https://example.com/tutorial2',
    'https://example.com/news3',
    'https://example.com/guide4',
    'https://example.com/article5',
  ]);
  const [result, setResult] = useState<{
    englishSummary?: string;
    urduSummary?: string;
    wordCount?: number;
    title?: string;
    author?: string;
    readingTime?: number;
    keyPoints?: string[];
    sentiment?: string;
    tags?: string[];
  } | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, copyToClipboard] = useCopyToClipboard();
  const controls = useAnimation();
  const [isHovering, setIsHovering] = useState(false);
  const [activeTab, setActiveTab] = useState('english');
  const [expandedSummary, setExpandedSummary] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [typingText, setTypingText] = useState('');
  const [typingIndex, setTypingIndex] = useState(0);
  const sampleTexts = [
    "Summarize any blog in seconds...",
    "Get multilingual summaries instantly...",
    "AI-powered content analysis...",
    "Understand articles faster..."
  ];

  useEffect(() => {
    const currentText = sampleTexts[typingIndex];
    let charIndex = 0;
    let timeout: NodeJS.Timeout;
    const type = () => {
      if (charIndex <= currentText.length) {
        setTypingText(currentText.substring(0, charIndex));
        charIndex++;
        timeout = setTimeout(type, Math.random() * 50 + 50);
      } else {
        timeout = setTimeout(() => {
          setTypingIndex((prev) => (prev + 1) % sampleTexts.length);
        }, 2000);
      }
    };
    type();
    return () => clearTimeout(timeout);
  }, [typingIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      controls.start({
        y: [0, -20, 0],
        transition: { duration: 8, repeat: Infinity, ease: 'easeInOut' }
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [controls]);

  async function handleSubmit() {
    setError('');
    setResult(null);
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }
    try {
      new URL(url);
    } catch {
      setError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      if (!response.ok) {
        throw new Error(await response.text());
      }
      const data = await response.json();
      setResult(data);
      toast.success('Successfully summarized the article!', {
        description: 'The content has been analyzed and summarized',
        action: {
          label: 'View',
          onClick: () => document.getElementById('results')?.scrollIntoView()
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      toast.error('Failed to summarize the article', {
        description: 'Please try again or check the URL'
      });
    } finally {
      setLoading(false);
    }
  }

  const handleCopy = (text: string) => {
    copyToClipboard(text);
    toast('Copied to clipboard!', {
      position: 'top-center',
      icon: <ClipboardCheck size={16} />,
    });
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'Check out this article summary',
        text: `Read this summary: ${result?.title || 'Article summary'}`,
        url: window.location.href,
      });
    } catch (err) {
      toast.info('Sharing not supported, copied link instead', {
        position: 'top-center',
      });
      copyToClipboard(window.location.href);
    }
  };

  const toggleExpand = () => {
    setExpandedSummary(!expandedSummary);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-16 px-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm border border-purple-100 shadow-2xl rounded-3xl p-8 relative overflow-hidden"
        ref={ref}
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="text-center mb-8 relative"
        >
          <div className="flex justify-center items-center gap-2 mb-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="text-purple-500" size={24} />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Blog Summarizer Pro
            </h1>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="text-blue-500" size={24} />
            </motion.div>
          </div>
          <motion.p 
            className="text-sm md:text-base text-gray-500"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className="inline-block min-w-[300px]">
              {typingText}
              <motion.span 
                className="inline-block w-1 h-5 bg-purple-500 ml-1 align-middle"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </span>
          </motion.p>
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
                setUrl(e.target.value)
                setShowSuggestions(true)
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder=""
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
                      setUrl(s)
                      setShowSuggestions(false)
                    }}
                    className="px-4 py-2 hover:bg-purple-50 cursor-pointer text-sm text-gray-700"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="rounded-xl text-base py-6 px-6 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all shadow-md hover:shadow-lg relative overflow-hidden group"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {isHovering ? (
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-30"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                />
              ) : null}
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
