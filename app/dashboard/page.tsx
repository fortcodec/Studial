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

interface Profile {
  id: string;
  full_name: string;
  c_coins: number;
  study_streak: number;
}

interface Post {
  id: string;
  user_id: string;
  user_name: string;
  timestamp: string;
  content: string;
  upvotes: number;
  has_upvoted: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [postContent, setPostContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Parse first name for the header
  const firstName = profile?.full_name?.split(' ')[0] || 'Student';

  const fetchPosts = async (userId: string) => {
    // Fetch posts, join with profiles for the name, and join with likes for the count
    const { data, error } = await supabase
      .from('posts')
      .select(`
        id,
        content,
        created_at,
        user_id,
        profiles:user_id (full_name),
        post_likes (user_id)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
      return;
    }

    // Format the raw data into our Post interface
    if (data) {
      const formattedPosts: Post[] = data.map((p: any) => ({
        id: p.id,
        user_id: p.user_id,
        user_name: p.profiles?.full_name || 'Anonymous Student',
        timestamp: new Date(p.created_at).toLocaleDateString() + ' ' + new Date(p.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        content: p.content,
        upvotes: p.post_likes?.length || 0,
        has_upvoted: p.post_likes?.some((like: any) => like.user_id === userId) || false,
      }));
      setPosts(formattedPosts);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          router.push('/signup');
          return;
        }

        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('id, full_name, c_coins, study_streak')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(data);
        
        // Fetch real posts once we know who is logged in
        await fetchPosts(user.id);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim() || !profile) return;
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('posts')
        .insert({ user_id: profile.id, content: postContent });

      if (error) throw error;
      
      setPostContent('');
      await fetchPosts(profile.id); // Refresh the feed
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpvote = async (postId: string) => {
    if (!profile) return;

    // Optimistic UI update (feels instant to the user)
    setPosts(posts.map(p => {
      if (p.id === postId) {
        const isNowUpvoted = !p.has_upvoted;
        return {
          ...p,
          has_upvoted: isNowUpvoted,
          upvotes: isNowUpvoted ? p.upvotes + 1 : p.upvotes - 1
        };
      }
      return p;
    }));

    // Find the specific post to check its real state
    const targetPost = posts.find(p => p.id === postId);
    if (!targetPost) return;

    try {
      if (targetPost.has_upvoted) {
        // User already upvoted, so we remove the like
        await supabase.from('post_likes').delete().match({ post_id: postId, user_id: profile.id });
      } else {
        // Add the like
        await supabase.from('post_likes').insert({ post_id: postId, user_id: profile.id });
      }
    } catch (error) {
      console.error('Error toggling upvote:', error);
      await fetchPosts(profile.id); // Revert to database truth if it failed
    }
  };

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
              <button className="w-full flex items-center gap-4.5 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-blue-400 font-semibold transition-all cursor-pointer">
                <Home className="w-5 h-5" />
                <span>Home Feed</span>
              </button>
              <button className="w-full flex items-center gap-4.5 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900/50 transition-all cursor-pointer">
                <BookOpen className="w-5 h-5" />
                <span>Past Qs</span>
              </button>
              <button className="w-full flex items-center gap-4.5 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900/50 transition-all cursor-pointer">
                <Bot className="w-5 h-5" />
                <span>Samuel AI</span>
              </button>
              <button className="w-full flex items-center gap-4.5 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900/50 transition-all cursor-pointer">
                <User className="w-5 h-5" />
                <span>Profile</span>
              </button>
            </nav>
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-4.5 px-4 py-3.5 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
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
                Welcome, {firstName}
              </h1>
            </div>

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

          {/* The Scrollable Stream of Real Posts */}
          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="text-center py-10 text-zinc-500">No posts yet. Be the first to start the conversation!</div>
            ) : (
              posts.map((post) => (
                <article key={post.id} className="bg-zinc-900/40 border border-zinc-800/60 p-4 sm:p-5 rounded-2xl shadow-sm transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold border-2 border-zinc-800 shrink-0">
                        {post.user_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white hover:underline cursor-pointer text-sm sm:text-base">{post.user_name}</span>
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
                      <span>Comment</span>
                    </button>
                    <button className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800/30 text-zinc-400 hover:bg-zinc-800/65 hover:text-white transition-all text-xs sm:text-sm font-semibold cursor-pointer">
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>

        </main>

        {/* ===================== RIGHT SIDEBAR (Desktop Only) ===================== */}
        <aside className="hidden lg:flex flex-col w-80 shrink-0 py-8 sticky top-0 h-screen border-l border-zinc-800/60 pl-6 space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search feed, groups..." 
              className="w-full bg-zinc-900/40 border border-zinc-800/60 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

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
        <button className="flex flex-col items-center gap-1.5 text-zinc-500 hover:text-white transition-colors py-0.5 px-3">
          <User className="w-5 h-5" />
          <span className="text-[10px] font-bold tracking-wide">Profile</span>
        </button>
      </nav>

    </div>
  );
}

