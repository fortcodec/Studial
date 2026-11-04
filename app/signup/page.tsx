'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  GraduationCap, 
  User, 
  Calendar, 
  School, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowUpRight, 
  CheckCircle2,
  ChevronDown,
  Sun,
  Moon
} from 'lucide-react';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedUni, setSelectedUni] = useState('');
  
  // Theme State
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(true);

  // Sync theme with landing page
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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans transition-colors duration-300">
      
      {/* Background Ambient Blobs */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/10 dark:bg-blue-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-600/10 dark:bg-violet-600/20 rounded-full blur-[100px]" />
      </div>

      {/* Main Glassmorphic Container */}
      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-2xl rounded-[2rem] border border-zinc-200 dark:border-zinc-800/60 shadow-2xl relative z-10 overflow-hidden transition-colors duration-300">
        
        {/* Left Side: The Interactive Form */}
        <div className="p-6 sm:p-10 flex flex-col justify-center">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Studial<span className="text-blue-600 dark:text-blue-500">.</span>
              </span>
            </Link>
            
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-semibold">
                v2.4 Academic
              </div>
              <button 
                onClick={toggleTheme} 
                aria-label="Toggle theme" 
                className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
              >
                <ThemeIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Form Titles & Tags */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 dark:text-white tracking-tight mb-3">
              {isSignUp ? 'Create an Account' : 'Welcome back.'}
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed">
              {isSignUp 
                ? 'Join 30,000+ Nigerian students on the ultimate campus hub. Slime with community engagement and C-Coins.'
                : 'Jump into campus discussions, club hangouts, and peer study rooms.'}
            </p>
            
            {isSignUp && (
              <div className="flex gap-2 mt-5">
                <span className="px-3 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  #1 Student Network
                </span>
                <span className="px-3 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  91% Study Retention
                </span>
              </div>
            )}
          </div>

          {/* The Form */}
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            
            {isSignUp && (
              <>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 w-5 h-5 text-zinc-400 dark:text-zinc-500" />
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    className="w-full bg-white dark:bg-zinc-950/50 border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-3 pl-12 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>

                <div className="relative">
                  <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-zinc-400 dark:text-zinc-500" />
                  <input 
                    type="date" 
                    className="w-full bg-white dark:bg-zinc-950/50 border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-3 pl-12 text-zinc-600 dark:text-zinc-400 focus:text-zinc-900 dark:focus:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all [color-scheme:light] dark:[color-scheme:dark]"
                  />
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <School className="absolute left-4 top-3.5 w-5 h-5 text-zinc-400 dark:text-zinc-500 z-10" />
                    <select 
                      value={selectedUni}
                      onChange={(e) => setSelectedUni(e.target.value)}
                      className="w-full appearance-none bg-white dark:bg-zinc-950/50 border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-3 pl-12 pr-10 text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all relative z-0"
                    >
                      <option value="" disabled>Select University</option>
                      <option value="fulokoja">Federal University Lokoja</option>
                      <option value="unizik">Nnamdi Azikiwe University</option>
                      <option value="unilag">University of Lagos</option>
                      <option value="auchi">Auchi Polytechnic</option>
                      <option value="others">Others</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-3.5 w-5 h-5 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
                  </div>

                  {/* Conditional Render for "Others" */}
                  {selectedUni === 'others' && (
                    <div className="relative animate-in fade-in slide-in-from-top-2 duration-300">
                      <School className="absolute left-4 top-3.5 w-5 h-5 text-zinc-400 dark:text-zinc-500" />
                      <input 
                        type="text" 
                        placeholder="Enter your institution name" 
                        className="w-full bg-white dark:bg-zinc-950/50 border border-blue-400 dark:border-blue-500/50 rounded-xl px-4 py-3 pl-12 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                        autoFocus
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-zinc-400 dark:text-zinc-500" />
              <input 
                type="email" 
                placeholder="Campus Email" 
                className="w-full bg-white dark:bg-zinc-950/50 border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-3 pl-12 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-zinc-400 dark:text-zinc-500" />
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Password" 
                className="w-full bg-white dark:bg-zinc-950/50 border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-3 pl-12 pr-12 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {!isSignUp && (
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 checked:bg-blue-600 checked:border-blue-600 focus:ring-blue-500/20 focus:ring-2 transition-all cursor-pointer" />
                  <span className="text-sm text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-300 transition-colors">Keep session active</span>
                </label>
                <button type="button" className="text-sm font-medium text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
                  Forgot Password?
                </button>
              </div>
            )}

            <button className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-3.5 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all">
              {isSignUp ? 'Join the Community' : 'Enter Campus'}
              <ArrowUpRight className="w-5 h-5" />
            </button>
          </form>

          {/* Toggle View Link */}
          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors flex flex-col items-center mx-auto gap-1"
            >
              <span>{isSignUp ? 'Already have an account?' : 'New to Studial?'}</span>
              <span className="text-blue-600 dark:text-blue-500 font-medium">
                {isSignUp ? 'Sign in with Password' : 'Create an Account'}
              </span>
            </button>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-xs text-zinc-500 dark:text-zinc-600">
              © {new Date().getFullYear()} Studial. All rights reserved.
            </p>
          </div>
        </div>

        {/* Right Side: Promo Banner */}
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 p-8 sm:p-12 flex flex-col justify-center relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 max-w-sm mx-auto">
            <div className="flex gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl shadow-xl">
                🔥
              </div>
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl shadow-xl -translate-y-3">
                💬
              </div>
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl shadow-xl">
                ⚡
              </div>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold mb-6 leading-tight">
              New here? Jump into the student sphere.
            </h2>
            
            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-blue-200 shrink-0 mt-0.5" />
                <span className="text-blue-50 leading-snug">Exclusive access to Nigerian university communities</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-blue-200 shrink-0 mt-0.5" />
                <span className="text-blue-50 leading-snug">Share gist, check exam past questions, & track stats</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-blue-200 shrink-0 mt-0.5" />
                <span className="text-blue-50 leading-snug">Earn C-Coins for peer engagement & study streaks</span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
