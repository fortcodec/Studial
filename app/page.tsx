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
  Flame,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('studial-theme');
    
    if (stored === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else {
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

  const ThemeIcon = mounted ? (isDark ? Moon : Sun) : () => <div className="w-5 h-5" />;

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300 selection:bg-blue-600 selection:text-white relative overflow-x-hidden font-sans flex flex-col">
      
      {/* Background Blobs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-blue-600/20 via-indigo-500/10 to-transparent blur-3xl opacity-70 dark:opacity-40" />
        <div className="absolute top-1/3 -left-48 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-48 w-96 h-96 bg-amber-500/10 dark:bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/75 dark:bg-zinc-950/75 backdrop-blur-xl transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            <Link href="/" className="group flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
                Studial<span className="text-blue-600">.</span>
              </span>
            </Link>

            {/* Desktop Nav */}
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

            <div className="flex items-center gap-3">
              <button onClick={toggleTheme} aria-label="Toggle theme" className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                <ThemeIcon className="w-5 h-5" />
              </button>
              <Link href="/signin" className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 active:scale-95 transition-all">
                Sign In
              </Link>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl px-4 py-6 space-y-4 shadow-xl absolute w-full left-0">
            <Link href="#home" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-base font-medium text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-lg">Home</Link>
            <Link href="#features" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-base font-medium text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-lg">Features</Link>
            <Link href="#campus-gist" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-base font-medium text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-lg">Campus Gist</Link>
            <Link href="/signin" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 mt-4 text-center text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md">Sign In</Link>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <div className="flex-grow">
        {/* Hero Section */}
        <main id="home" className="relative z-10 pt-16 pb-24 md:pt-24 md:pb-36 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="relative w-full max-w-4xl mx-auto">
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
              <Link href="/signup" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition-all">
                <span>Get Started -&gt;</span>
              </Link>
              <Link href="/signin" className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-xl text-base font-semibold text-zinc-900 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 backdrop-blur-sm transition-all">
                Sign In
              </Link>
            </div>
          </div>
        </main>

        {/* Features Grid */}
        <section id="features" className="relative z-10 py-24 border-t border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-zinc-950 dark:text-white">Built for the Modern Student</h2>
              <p className="mt-4 text-zinc-600 dark:text-zinc-400">Everything you need to crush your academics and build a verified reputation on campus.</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 mb-6">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Verified Past Questions</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">Stop studying the wrong materials. Access a peer-reviewed database of past questions tailored to your exact courses.</p>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 mb-6">
                  <Coins className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Earn C-Coins</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">Get rewarded for your knowledge. Answer questions and upload study materials to earn platform currency.</p>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 mb-6">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">AI Study Assistant</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">Stuck on a complex topic? Our embedded AI breaks down difficult academic concepts into simple explanations.</p>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 mb-6">
                  <Flame className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Study Streaks</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">Build unbreakable study habits. Log in daily, maintain your streak, and climb the campus leaderboards.</p>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 mb-6">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Campus Gist</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">Stay in the loop. Get real-time updates on campus news, social events, and crucial academic announcements.</p>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Secure OTP Access</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">Your data stays safe. Experience frictionless and highly secure logins utilizing modern OTP passcode authentication.</p>
              </div>

            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4 opacity-80">
            <GraduationCap className="w-5 h-5 text-zinc-400" />
            <span className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight">Studial.</span>
          </div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            &copy; 2026 Studial. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}
