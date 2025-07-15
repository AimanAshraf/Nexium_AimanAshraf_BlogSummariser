
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

  // Typing animation effect
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

  // Floating bubbles background effect
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
        text: Read this summary: ${result?.title || 'Article summary'},
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
      {/* Animated background elements */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className={absolute rounded-full opacity-20 z-[-1] ${
            i % 3 === 0 ? 'bg-purple-300' : i % 3 === 1 ? 'bg-blue-300' : 'bg-pink-300'
          }}
          style={{
            width: Math.random() * 100 + 50,
            height: Math.random() * 100 + 50,
            left: ${Math.random() * 100}%,
            top: ${Math.random() * 100}%,
          }}
          animate={{
            y: [0, (Math.random() - 0.5) * 100],
            x: [0, (Math.random() - 0.5) * 50],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm border border-purple-100 shadow-2xl rounded-3xl p-8 relative overflow-hidden"
        ref={ref}
      >
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-purple-200/30 z-[-1]"
            style={{
              width: Math.random() * 10 + 2,
              height: Math.random() * 10 + 2,
              left: ${Math.random() * 100}%,
              top: ${Math.random() * 100}%,
            }}
            animate={{
              y: [0, (Math.random() - 0.5) * 100],
              x: [0, (Math.random() - 0.5) * 50],
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Header with animated gradient */}
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

        {/* Input & Button with floating label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 mb-6 relative"
        >
         <div className="relative flex-1">
  <motion.label
    htmlFor="url-input"
    className={absolute left-4 transition-all duration-200 pointer-events-none text-purple-500 ${
      url ? 'text-xs top-2' : 'text-sm top-4'
    }}
  >
    Paste blog URL
  </motion.label>
  <Input
    id="url-input"
    value={url}
    onChange={(e) => setUrl(e.target.value)}
    placeholder=""
    disabled={loading}
    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
    className="w-full pt-6 pb-2 px-4 text-base rounded-xl border-2 border-purple-200 focus:border-purple-400 focus-visible:ring-0"
  />
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
              {isHovering && (
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-30"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                />
              )}
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

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 mb-4 text-red-800 bg-red-100 rounded-lg border border-red-200 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Animation */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-10"
            >
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  rotate: { repeat: Infinity, duration: 2, ease: 'linear' },
                  scale: { repeat: Infinity, duration: 1.5, ease: 'easeInOut' },
                }}
                className="relative"
              >
                <Loader2 size={48} className="text-purple-500" />
                <motion.div 
                  className="absolute -inset-2 border-4 border-purple-200 rounded-full"
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: 'easeInOut'
                  }}
                />
              </motion.div>
              <motion.div
                className="mt-6 space-y-2 text-center"
                animate={{
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                <p className="text-purple-600 font-medium">Analyzing blog content...</p>
                <p className="text-sm text-gray-500">This may take a few moments</p>
              </motion.div>
              <motion.div 
                className="w-full max-w-md h-2 bg-purple-100 rounded-full mt-6 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Summarized Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8 mt-6"
              id="results"
            >
              {/* Article Metadata */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="p-5 bg-gray-50 rounded-xl border border-gray-200"
              >
                <h2 className="text-xl font-bold text-gray-800 mb-2">{result.title || 'Untitled Article'}</h2>
                {result.author && <p className="text-gray-600 mb-1">By {result.author}</p>}
                <div className="flex flex-wrap gap-4 mt-3 text-sm">
                  <div className="flex items-center text-purple-600">
                    <Globe className="mr-1" size={16} />
                    {new URL(url).hostname}
                  </div>
                  <div className="flex items-center text-blue-600">
                    <BookOpen className="mr-1" size={16} />
                    {result.wordCount} words
                  </div>
                  {result.readingTime && (
                    <div className="flex items-center text-green-600">
                      <Clock className="mr-1" size={16} />
                      {result.readingTime} min read
                    </div>
                  )}
                  {result.sentiment && (
                    <div className="flex items-center text-amber-600">
                      <BarChart2 className="mr-1" size={16} />
                      {result.sentiment} sentiment
                    </div>
                  )}
                </div>
                {result.tags && result.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {result.tags.map((tag, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Key Points */}
              {result.keyPoints && result.keyPoints.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-5 bg-amber-50 rounded-xl border border-amber-100"
                >
                  <h2 className="font-semibold text-amber-700 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    Key Points
                  </h2>
                  <ul className="space-y-2">
                    {result.keyPoints.map((point, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-start"
                      >
                        <span className="text-amber-500 mr-2">•</span>
                        <span className="text-gray-700">{point}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Summary Tabs */}
              <Tabs defaultValue="english" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 h-auto rounded-xl">
                  <TabsTrigger 
                    value="english" 
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-3 rounded-lg"
                    onClick={() => setActiveTab('english')}
                  >
                    <span className={flex items-center ${activeTab === 'english' ? 'text-purple-600' : 'text-gray-500'}}>
                      <Globe className="mr-2" size={16} />
                      English
                    </span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="urdu" 
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-3 rounded-lg"
                    onClick={() => setActiveTab('urdu')}
                  >
                    <span className={flex items-center ${activeTab === 'urdu' ? 'text-purple-600' : 'text-gray-500'}}>
                      <Languages className="mr-2" size={16} />
                      اردو
                    </span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="english">
                  <motion.div
                    initial={{ x: -20 }}
                    animate={{ x: 0 }}
                    whileHover={{ 
                      scale: 1.01, 
                      boxShadow: '0 10px 25px -5px rgba(147, 197, 253, 0.4)'
                    }}
                    className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-2 flex gap-1">
                      <button 
                        onClick={() => handleCopy(result.englishSummary || '')}
                        className="p-2 rounded-full hover:bg-blue-100 transition-colors"
                        title="Copy summary"
                      >
                        {copied.value === result.englishSummary ? (
                          <ClipboardCheck className="text-blue-600" size={18} />
                        ) : (
                          <Clipboard className="text-blue-400" size={18} />
                        )}
                      </button>
                    </div>
                    <h2 className="font-semibold text-blue-700 mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389 21.034 21.034 0 01-.954-1.165A19.9 19.9 0 015 13V9a1 1 0 011-1h1V5a1 1 0 011-1zm2 10a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1z" clipRule="evenodd" />
                      </svg>
                      English Summary
                    </h2>
                    <TextareaAutosize
                      readOnly
                      value={result.englishSummary}
                      className="w-full text-gray-700 leading-relaxed whitespace-pre-line bg-transparent resize-none border-none focus:ring-0"
                      style={{ height: expandedSummary ? undefined : 100 }}
                    />
                    <button 
                      onClick={toggleExpand}
                      className="text-blue-500 text-sm mt-2 flex items-center hover:underline"
                    >
                      {expandedSummary ? (
                        <>
                          <ChevronUp size={16} className="mr-1" />
                          Show More
                        </>
                      ) : (
                        <>
                          <ChevronDown size={16} className="mr-1" />
                          Show Less
                        </>
                      )}
                    </button>
                  </motion.div>
                </TabsContent>
                
                <TabsContent value="urdu">
                  <motion.div
                    initial={{ x: 20 }}
                    animate={{ x: 0 }}
                    whileHover={{ 
                      scale: 1.01, 
                      boxShadow: '0 10px 25px -5px rgba(110, 231, 183, 0.4)'
                    }}
                    className="p-6 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl border border-green-100 relative overflow-hidden"
                    dir="rtl"
                  >
                    <div className="absolute top-0 left-0 p-2 flex gap-1">
                      <button 
                        onClick={() => handleCopy(result.urduSummary || '')}
                        className="p-2 rounded-full hover:bg-green-100 transition-colors"
                        title="Copy summary"
                      >
                        {copied.value === result.urduSummary ? (
                          <ClipboardCheck className="text-green-600" size={18} />
                        ) : (
                          <Clipboard className="text-green-400" size={18} />
                        )}
                      </button>
                    </div>
                    <h2 className="font-semibold text-green-700 mb-3 flex items-center justify-end">
                      <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389 21.034 21.034 0 01-.954-1.165A19.9 19.9 0 015 13V9a1 1 0 011-1h1V5a1 1 0 011-1zm2 10a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1z" clipRule="evenodd" />
                      </svg>
                      اردو خلاصہ
                    </h2>
                    <TextareaAutosize
                      readOnly
                      value={result.urduSummary}
                      className="w-full text-gray-700 leading-relaxed whitespace-pre-line bg-transparent resize-none border-none focus:ring-0 text-right"
                      style={{ height: expandedSummary ? undefined : 100 }}
                    />
                    <button 
                      onClick={toggleExpand}
                      className="text-green-500 text-sm mt-2 flex items-center hover:underline"
                      dir="ltr"
                    >
                      {expandedSummary ? (
                        <>
                          <ChevronUp size={16} className="mr-1" />
                          Show More
                        </>
                      ) : (
                        <>
                          <ChevronDown size={16} className="mr-1" />
                          Show Less
                        </>
                      )}
                    </button>
                  </motion.div>
                </TabsContent>
              </Tabs>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap justify-center gap-4 pt-4"
              >
                <Button
                  variant="outline"
                  className="rounded-full border-purple-200 hover:bg-purple-50 gap-2"
                  onClick={() => {
                    setUrl('');
                    setResult(null);
                  }}
                >
                  <RotateCw size={16} />
                  New Summary
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full border-blue-200 hover:bg-blue-50 gap-2"
                  onClick={handleShare}
                >
                  <Share2 size={16} />
                  Share Results
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Idle Prompt */}
        {!loading && !result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12 text-center"
          >
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="inline-block p-4 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full shadow-md"
            >
              <Sparkles className="text-purple-400" size={32} />
            </motion.div>
            <motion.p 
              className="mt-4 text-gray-400"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Paste a blog URL above to generate AI-powered summaries!
            </motion.p>
            <motion.div
              className="mt-6 grid grid-cols-3 gap-4 max-w-md mx-auto opacity-60"
              animate={controls}
            >
              {['News', 'Tutorial', 'Blog', 'Article', 'Research', 'Story'].map((type) => (
                <motion.div
                  key={type}
                  whileHover={{ scale: 1.05 }}
                  className="px-3 py-2 bg-purple-50 rounded-lg text-xs text-purple-600 shadow-inner"
                >
                  {type}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center text-xs text-gray-400 mt-10 flex flex-col items-center"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="mb-2 flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm"
        >
          <span className="h-2 w-2 bg-purple-500 rounded-full animate-pulse"></span>
          <span>🚀 Powered by Next.js & Tailwind CSS</span>
        </motion.div>
        <p className="max-w-md mx-auto">
          Results may vary based on content complexity.
        </p>
      </motion.footer>
    </div>
  );
}


