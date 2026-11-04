'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  GraduationCap, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  BookOpen, 
  Coins, 
  Bot,
  Zap,
  Users
} from 'lucide-react';

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Rock-solid hydration & theme detection
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('studial-theme');
    
    if (stored === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else {
      // Default to dark mode for that premium fintech aesthetic
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    
    if (nextDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    localStorage.setItem('studial-theme', nextDark ? 'dark' : 'light');
  };

  // Prevent hydration mismatch flashes by not rendering icons until mounted
  const ThemeIcon = mounted ? (isDark ? Moon : Sun) : () => <div className="w-5 h-5" />;

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300 selection:bg-blue-600 selection:text-white relative overflow-x-hidden font-sans">
      
      {/* Background Subtle Gradient Blobs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-blue-600/20 via-indigo-500/10 to-transparent blur-3xl opacity-70 dark:opacity-40" />
        <div className="absolute top-1/3 -left-48 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-48 w-96 h-96 bg-amber-500/10 dark:bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      {/* Sticky Glassmorphic Header */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/75 dark:bg-zinc-950/75 backdrop-blur-xl transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
                Studial<span className="text-blue-600">.</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="#home" className="text-sm font-medium text-blue-600 dark:text-blue-400">Home</Link>
              <Link href="#features" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors">Features</Link>
              <Link href="#campus-gist" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors flex items-center gap-1.5">
                Campus Gist
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
                </span>
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <ThemeIcon className="w-5 h-5" />
              </button>

              <Link
                href="/signin"
                className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 active:scale-95 transition-all"
              >
                Sign In
              </Link>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-zinc-600 dark:text-zinc-300"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main id="home" className="relative z-10 pt-16 pb-24 md:pt-24 md:pb-36 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="relative w-full max-w-4xl mx-auto">
          
          {/* Top Left Badge */}
          <div className="hidden lg:flex absolute -top-12 -left-12 z-20 items-center gap-3 px-4 py-3 rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/90 dark:border-zinc-800/90 shadow-xl">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-zinc-900 dark:text-white">CSC201 Past Q's Uploaded</p>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">2 mins ago • Verified</p>
            </div>
          </div>

          {/* Mid Right Badge */}
          <div className="hidden lg:flex absolute top-28 -right-14 z-20 items-center gap-3 px-4 py-3 rounded-2xl bg-amber-50/85 dark:bg-amber-950/40 backdrop-blur-xl border border-amber-200/90 dark:border-amber-700/40 shadow-xl">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/60 border border-amber-300/80 dark:border-amber-600/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Coins className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-amber-900 dark:text-amber-200">+50 C-Coins Earned</p>
              <p className="text-[10px] text-amber-700/80 dark:text-amber-400/80 font-mono">Peer Solution Verified</p>
            </div>
          </div>

          {/* Bottom Right Badge */}
          <div className="hidden lg:flex absolute -bottom-10 right-8 z-20 items-center gap-3 px-4 py-3 rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/90 dark:border-zinc-800/90 shadow-xl">
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200/60 dark:border-purple-800/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Bot className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-semibold text-zinc-900 dark:text-white">Samuel AI Online</p>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">Ready for Q&A Analysis</p>
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-zinc-950 dark:text-white leading-[1.08]">
            Your Campus,{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-500 bg-clip-text text-transparent">
              Connected.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            The modern academic social network. Access verified past questions, collaborate with peers, and earn C-Coins while you excel.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition-all"
            >
              <span>Get Started -&gt;</span>
            </Link>
            <Link
              href="/signin"
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-xl text-base font-semibold text-zinc-900 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 backdrop-blur-sm transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </main>

      {/* Features Section (This creates the depth needed for scrolling) */}
      <section id="features" className="relative z-10 py-24 border-t border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-zinc-950 dark:text-white">Built for the Modern Student</h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">Everything you need to crush your academics and build a verified reputation on campus.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 mb-6">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Verified Past Questions</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">Stop studying the wrong materials. Access a crowdsourced, peer-reviewed database of past questions tailored to your exact courses.</p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 mb-6">
                <Coins className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Earn C-Coins</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">Get rewarded for your knowledge. Answer questions, upload study materials, and build study streaks to earn digital currency.</p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">AI Study Assistant</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">Stuck on a complex topic? Our embedded AI assistant breaks down difficult academic concepts into simple, easy-to-understand explanations.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
