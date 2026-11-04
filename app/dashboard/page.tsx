'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { 
  GraduationCap, Flame, Coins, Image, Paperclip, Smile, Send, 
  ArrowUp, MessageSquare, Share2, Home, BookOpen, Bot, User, 
  Search, Bell, LogOut, Loader2, Sparkles, Plus, Award, Hash, MoreHorizontal
} from 'lucide-react';

// TS Interfaces for type safety & preventing editor complaints
interface Profile {
  full_name: string;
  c_coins: number;
  study_streak: number;
  university?: string;
}

interface Post {
  id: string;
  user_name: string;
  user_avatar: string;
  timestamp: string;
  content: string;
  is_verified?: boolean;
  attachments?: string[];
  upvotes: number;
  comments_count: number;
  has_upvoted?: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  
  // Create Post state
  const [postContent, setPostContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hardcoded initial Mock Posts based on image mockup
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      user_name: 'Adebayo S.',
      user_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop',
      timestamp: '18 mins ago',
      content: 'Verified CSC201 Past Questions now uploaded! Check them out and share with any 200L computer science buddies.',
      is_verified: true,
      attachments: ['csc201_exam_2024.pdf', 'csc201_study_guide.pdf'],
      upvotes: 24,
      comments_count: 5,
    },
    {
      id: '2',
      user_name: 'Dinaume',
      user_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop',
      timestamp: '1 hour ago',
      content: 'Anyone has UNILAG GST101 study group link? Trying to get access to these verify materials asap!',
      upvotes: 12,
      comments_count: 8,
    }
  ]);

  // Fetch logged in user and profile
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          router.push('/signup'); // Force send to auth page if they aren't logged in
          return;
        }

        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('full_name, c_coins, study_streak, university')
          .eq('id', user.id)
          .single();

        if (profileError) {
          // Fallback mockup stats if Supabase profile table trigger failed during manual testing
          setProfile({
            full_name: user.user_metadata?.full_name || 'Student',
            c_coins: 450,
            study_streak: 12,
          });
        } else {
          setProfile(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  // Submit Post logic
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    setIsSubmitting(true);
    // Mimicking creation inside component state
    const newPost: Post = {
      id: String(Date.now()),
      user_name: profile?.full_name || 'Me',
      user_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop',
      timestamp: 'Just now',
      content: postContent,
      upvotes: 0,
      comments_count: 0
    };

    setTimeout(() => {
      setPosts([newPost, ...posts]);
      setPostContent('');
      setIsSubmitting(false);
    }, 600);
  };

  // Upvote logic
  const handleUpvote = (postId: string) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        const hasUpvoted = !p.has_upvoted;
        return {
          ...p,
          has_upvoted,
          upvotes: hasUpvoted ? p.upvotes + 1 : p.upvotes - 1
        };
      }
      return p;
    }));
  };

  // Handle Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/signup');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-zinc-500 text-sm font-medium">Entering campus dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col pb-20 md:pb-0">
      
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Outer wrapper */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow relative z-10 flex">
        
        {/* ===================== LEFT SIDEBAR (Desktop Only) ===================== */}
        <aside className="hidden md:flex flex-col w-64 shrink-0 py-8 sticky top-0 h-screen border-r border-zinc-800/60 pr-6 justify-between">
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Studial<span className="text-blue-500">.</span>
              </span>
            </Link>

            <nav className="space-y-1.5">
              <button className="w-full flex items-center gap-4.5 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-blue-400 font-semibold transition-all">
                <Home className="w-5 h-5" />
                <span>Home Feed</span>
              </button>
              <button className="w-full flex items-center gap-4.5 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900/50 transition-all">
                <BookOpen className="w-5 h-5" />
                <span>Past Qs</span>
              </button>
              <button className="w-full flex items-center gap-4.5 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900/50 transition-all">
                <Bot className="w-5 h-5" />
                <span>Samuel AI</span>
              </button>
              <button className="w-full flex items-center gap-4.5 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900/50 transition-all">
                <User className="w-5 h-5" />
                <span>Profile</span>
              </button>
            </nav>
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-4.5 px-4 py-3.5 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
          >
            <LogOut className="w-5 h-5 animate-pulse" />
            <span className="font-semibold text-sm">Sign Out</span>
          </button>
        </aside>

        {/* ===================== CENTER FEED ===================== */}
        <main className="flex-1 py-6 md:py-8 md:px-8 border-r border-zinc-800/60">
          
          {/* Top Info Bar / Responsive Header */}
          <header className="flex justify-between items-center bg-zinc-900/40 backdrop-blur-2xl border border-zinc-800/60 p-4 rounded-2xl mb-6">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-blue-400 font-semibold tracking-wider uppercase">V2.4 Academic</span>
              <h1 className="text-lg font-bold text-white truncate max-w-[140px] sm:max-w-[200px]">
                {profile?.full_name || 'New Student'}
              </h1>
            </div>

            {/* Micro Stats */}
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-xl text-orange-400">
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500/20 animate-pulse" />
                <span className="text-xs sm:text-sm font-bold">{profile?.study_streak || 0} Days</span>
              </div>
              <div className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1.5 rounded-xl text-yellow-400">
                <Coins className="w-4 h-4 text-yellow-500 fill-yellow-500/20" />
                <span className="text-xs sm:text-sm font-bold">{profile?.c_coins || 0} C-Coins</span>
              </div>
            </div>
          </header>

          {/* Create Post Card */}
          <form onSubmit={handleCreatePost} className="bg-zinc-900/40 border border-zinc-800/60 p-4 rounded-2xl mb-6 shadow-sm">
            <textarea 
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="Share a study tip or ask a question..." 
              className="w-full bg-transparent border-0 outline-0 resize-none h-20 text-sm sm:text-base text-zinc-100 placeholder-zinc-500 focus:ring-0"
            />
            
            <div className="flex justify-between items-center border-t border-zinc-800/60 pt-3 mt-3">
              <div className="flex gap-1.5 sm:gap-2">
                <button type="button" className="p-2 rounded-xl bg-zinc-800/50 text-zinc-400 hover:text-white transition-colors cursor-pointer">
                  <Image className="w-4.5 h-4.5" />
                </button>
                <button type="button" className="p-2 rounded-xl bg-zinc-800/50 text-zinc-400 hover:text-white transition-colors cursor-pointer">
                  <Paperclip className="w-4.5 h-4.5" />
                </button>
                <button type="button" className="p-2 rounded-xl bg-zinc-800/50 text-zinc-400 hover:text-white transition-colors cursor-pointer">
                  <Smile className="w-4.5 h-4.5" />
                </button>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting || !postContent.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl px-4 py-2.5 flex items-center justify-center gap-2 active:scale-95 transition-all text-sm shadow-md shadow-blue-600/10 cursor-pointer"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Publish</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* The Scrollable Stream of Posts */}
          <div className="space-y-4">
            {posts.map((post) => (
              <article key={post.id} className="bg-zinc-900/40 border border-zinc-800/60 p-4 sm:p-5 rounded-2xl shadow-sm transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3">
                    <img 
                      src={post.user_avatar} 
                      alt="" 
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-zinc-800 shrink-0" 
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white hover:underline cursor-pointer text-sm sm:text-base">{post.user_name}</span>
                        {post.is_verified && (
                          <div className="px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider">
                            Verified
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-zinc-500">{post.timestamp}</span>
                    </div>
                  </div>
                  <button className="text-zinc-500 hover:text-zinc-300 transition-colors p-1 hover:bg-zinc-800/50 rounded-lg cursor-pointer">
                    <MoreHorizontal className="w-4.5 h-4.5" />
                  </button>
                </div>

                <p className="text-sm sm:text-base text-zinc-200 leading-relaxed mb-4 whitespace-pre-wrap">
                  {post.content}
                </p>

                {/* Upload attachment display if present */}
                {post.attachments && post.attachments.length > 0 && (
                  <div className="grid sm:grid-cols-2 gap-2 mb-4">
                    {post.attachments.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                        <div className="flex items-center gap-2.5 truncate">
                          <BookOpen className="w-5 h-5 text-zinc-400 shrink-0" />
                          <span className="text-xs sm:text-sm text-zinc-300 font-medium truncate">{file}</span>
                        </div>
                        <span className="text-[10px] bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-1 rounded-md font-bold uppercase tracking-wider select-none shrink-0 ml-2">
                          PDF
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 sm:gap-4 border-t border-zinc-800/40 pt-3">
                  <button 
                    onClick={() => handleUpvote(post.id)}
                    className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${post.has_upvoted ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.05)]' : 'bg-zinc-800/30 border border-transparent hover:bg-zinc-800/65 text-zinc-400'}`}
                  >
                    <ArrowUp className={`w-4 h-4 ${post.has_upvoted ? 'text-blue-400 animate-bounce' : 'text-zinc-400'}`} />
                    <span>{post.upvotes} Upvotes</span>
                  </button>
                  <button className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800/30 text-zinc-400 hover:bg-zinc-800/65 hover:text-white transition-all text-xs sm:text-sm font-semibold cursor-pointer">
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.comments_count} Comments</span>
                  </button>
                  <button className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800/30 text-zinc-400 hover:bg-zinc-800/65 hover:text-white transition-all text-xs sm:text-sm font-semibold cursor-pointer">
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>
              </article>
            ))}
          </div>

        </main>

        {/* ===================== RIGHT SIDEBAR (Desktop Only) ===================== */}
        <aside className="hidden lg:flex flex-col w-80 shrink-0 py-8 sticky top-0 h-screen border-l border-zinc-800/60 pl-6 space-y-6">
          
          {/* Quick Find Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search feed, groups..." 
              className="w-full bg-zinc-900/40 border border-zinc-800/60 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Campus Trending Block */}
          <section className="bg-zinc-900/40 border border-zinc-800/60 p-5 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
                <Hash className="w-4 h-4 text-blue-500" />
                <span>Campus Trending</span>
              </h2>
              <Sparkles className="w-4.5 h-4.5 text-blue-400" />
            </div>

            <div className="space-y-1">
              <p className="text-xl font-extrabold text-white leading-tight">#ASUStrike</p>
              <p className="text-xs text-zinc-500 font-medium">Trending across all Nigerian campus hubs</p>
            </div>
            
            <div className="mt-4 pt-3 border-t border-zinc-800/40 flex items-center justify-between text-xs text-zinc-400">
              <span className="font-medium">1,450 students talking</span>
              <span className="text-blue-500 font-semibold cursor-pointer hover:underline">Join &rarr;</span>
            </div>
          </section>

          {/* Network Banner */}
          <section className="bg-gradient-to-br from-indigo-500 to-violet-600 p-5 rounded-2xl text-white relative overflow-hidden shadow-lg shadow-indigo-500/10">
            <div className="absolute top-0 right-0 translate-y-1 translate-x-1 w-20 h-20 bg-white/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex gap-1.5 items-center mb-2 bg-white/10 border border-white/20 w-fit px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
              <Award className="w-3 h-3" />
              <span>Network Badge</span>
            </div>
            <h3 className="text-lg font-extrabold leading-tight mb-1">#1 Student Network</h3>
            <p className="text-xs text-indigo-100 font-medium leading-relaxed">Boost stats with verify documents to raise metrics and compete with peer study groups.</p>
          </section>

          <footer className="text-center pt-4">
            <p className="text-[10px] text-zinc-600 tracking-wide">&copy; 2026 Studial. All rights reserved.</p>
          </footer>

        </aside>

      </div>

      {/* ===================== BOTTOM NAV (Mobile/Android Only) ===================== */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-950/80 backdrop-blur-2xl border-t border-zinc-800/80 z-40 flex justify-around py-3">
        <button className="flex flex-col items-center gap-1.5 text-blue-500 bg-transparent py-0.5 px-3">
          <Home className="w-5 h-5 fill-blue-500/10" />
          <span className="text-[10px] font-bold tracking-wide">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-zinc-500 hover:text-white transition-colors py-0.5 px-3">
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] font-bold tracking-wide">Past Qs</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-zinc-500 hover:text-white transition-colors py-0.5 px-3">
          <Bot className="w-5 h-5" />
          <span className="text-[10px] font-bold tracking-wide">Samuel AI</span>
        </button>
        <button 
          onClick={() => router.push('/profile')} 
          className="flex flex-col items-center gap-1.5 text-zinc-500 hover:text-white transition-colors py-0.5 px-3"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-bold tracking-wide">Profile</span>
        </button>
      </nav>

    </div>
  );
}