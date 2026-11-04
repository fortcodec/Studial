'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { 
  GraduationCap, Flame, Coins, Image as ImageIcon, Paperclip, Smile, Send, 
  ArrowUp, MessageSquare, Share2, Home, BookOpen, Bot, User, 
  Search, LogOut, Loader2, Sparkles, Hash, MoreHorizontal, X, MessageCircle
} from 'lucide-react';

interface Profile {
  id: string;
  full_name: string;
  c_coins: number;
  study_streak: number;
  last_login?: string;
}

interface Post {
  id: string;
  user_id: string;
  user_name: string;
  timestamp: string;
  content: string;
  upvotes: number;
  has_upvoted: boolean;
  comments_count: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [postContent, setPostContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // UI Interactive States
  const [showReward, setShowReward] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeCommentPost, setActiveCommentPost] = useState<string | null>(null);
  
  // File Upload Refs
  const imageRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const firstName = profile?.full_name?.split(' ')[0] || 'Student';

  const fetchPosts = async (userId: string) => {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        id, content, created_at, user_id,
        profiles:user_id (full_name),
        post_likes (user_id),
        comments (id)
      `)
      .order('created_at', { ascending: false })
      .limit(20); // Limit speeds up initial load

    if (data) {
      const formattedPosts: Post[] = data.map((p: any) => ({
        id: p.id,
        user_id: p.user_id,
        user_name: p.profiles?.full_name || 'Anonymous Student',
        timestamp: new Date(p.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        content: p.content,
        upvotes: p.post_likes?.length || 0,
        has_upvoted: p.post_likes?.some((like: any) => like.user_id === userId) || false,
        comments_count: p.comments?.length || 0
      }));
      setPosts(formattedPosts);
    }
  };

  useEffect(() => {
    const initDashboard = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          router.push('/signup');
          return;
        }

        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('id, full_name, c_coins, study_streak, last_login')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        // Daily Login Reward Logic
        const today = new Date().toISOString().split('T')[0];
        if (data.last_login !== today) {
          const newCoins = data.c_coins + 2;
          const newStreak = data.study_streak + 1; // Assuming consecutive, simplified for now
          
          await supabase.from('profiles').update({ 
            last_login: today, 
            c_coins: newCoins,
            study_streak: newStreak
          }).eq('id', user.id);
          
          data.c_coins = newCoins;
          data.study_streak = newStreak;
          setShowReward(true);
          
          // Auto-hide popup after 4 seconds
          setTimeout(() => setShowReward(false), 4000);
        }

        setProfile(data);
        await fetchPosts(user.id);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    initDashboard();
  }, [router]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim() || !profile) return;
    setIsSubmitting(true);

    try {
      await supabase.from('posts').insert({ user_id: profile.id, content: postContent });
      setPostContent('');
      await fetchPosts(profile.id);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpvote = async (postId: string) => {
    if (!profile) return;

    // Optimistic UI Update for instant feedback
    setPosts(posts.map(p => {
      if (p.id === postId) {
        const isNowUpvoted = !p.has_upvoted;
        return { ...p, has_upvoted: isNowUpvoted, upvotes: isNowUpvoted ? p.upvotes + 1 : p.upvotes - 1 };
      }
      return p;
    }));

    const targetPost = posts.find(p => p.id === postId);
    if (!targetPost) return;

    try {
      if (targetPost.has_upvoted) {
        await supabase.from('post_likes').delete().match({ post_id: postId, user_id: profile.id });
      } else {
        await supabase.from('post_likes').insert({ post_id: postId, user_id: profile.id });
      }
    } catch (error) {
      await fetchPosts(profile.id);
    }
  };

  // Route to Chat Page
  const handleChatUser = (userId: string) => {
    if (userId === profile?.id) return; // Can't chat with yourself
    router.push(`/messages/${userId}`);
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col pb-20 md:pb-0 relative">
      
      {/* Daily Reward Pop-up */}
      {showReward && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-10 fade-in duration-500">
          <div className="bg-zinc-900 border border-yellow-500/30 shadow-2xl shadow-yellow-500/20 px-6 py-4 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center">
              <Coins className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Daily Check-in!</h3>
              <p className="text-zinc-400 text-sm">You earned <span className="text-yellow-400 font-bold">+2 C-Coins</span> for logging in today.</p>
            </div>
            <button onClick={() => setShowReward(false)} className="ml-4 p-2 hover:bg-zinc-800 rounded-full">
              <X className="w-4 h-4 text-zinc-500" />
            </button>
          </div>
        </div>
      )}

      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow relative z-10 flex">
        
        {/* CENTER FEED */}
        <main className="flex-1 py-6 md:py-8 md:px-8 lg:border-r lg:border-l border-zinc-800/60 max-w-3xl mx-auto w-full">
          
          <header className="flex justify-between items-center bg-zinc-900/40 backdrop-blur-2xl border border-zinc-800/60 p-4 rounded-2xl mb-6 sticky top-4 z-30">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-blue-400 font-semibold tracking-wider uppercase">V2.4 Academic</span>
              <h1 className="text-lg font-bold text-white truncate max-w-[140px] sm:max-w-[200px]">
                Welcome, {firstName}
              </h1>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-xl text-orange-400">
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500/20" />
                <span className="text-xs sm:text-sm font-bold">{profile?.study_streak || 0} Days</span>
              </div>
              <div className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1.5 rounded-xl text-yellow-400">
                <Coins className="w-4 h-4 text-yellow-500 fill-yellow-500/20" />
                <span className="text-xs sm:text-sm font-bold">{profile?.c_coins || 0} C-Coins</span>
              </div>
            </div>
          </header>

          <form onSubmit={handleCreatePost} className="bg-zinc-900/40 border border-zinc-800/60 p-4 rounded-2xl mb-6 shadow-sm">
            <textarea 
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="Share a study tip or ask a question..." 
              className="w-full bg-transparent border-0 outline-0 resize-none h-20 text-sm sm:text-base text-zinc-100 placeholder-zinc-500 focus:ring-0"
            />
            <div className="flex justify-between items-center border-t border-zinc-800/60 pt-3 mt-3">
              <div className="flex gap-1.5 sm:gap-2">
                {/* Hidden File Inputs */}
                <input type="file" hidden ref={imageRef} accept="image/*" />
                <input type="file" hidden ref={fileRef} accept=".pdf,.doc,.docx" />
                
                <button type="button" onClick={() => imageRef.current?.click()} className="p-2 rounded-xl bg-zinc-800/50 text-zinc-400 hover:text-white transition-colors">
                  <ImageIcon className="w-4.5 h-4.5" />
                </button>
                <button type="button" onClick={() => fileRef.current?.click()} className="p-2 rounded-xl bg-zinc-800/50 text-zinc-400 hover:text-white transition-colors">
                  <Paperclip className="w-4.5 h-4.5" />
                </button>
              </div>
              <button type="submit" disabled={isSubmitting || !postContent.trim()} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl px-4 py-2.5 flex items-center gap-2 active:scale-95 text-sm cursor-pointer">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Publish</span><Send className="w-4 h-4" /></>}
              </button>
            </div>
          </form>

          <div className="space-y-4">
            {posts.map((post) => (
              <article key={post.id} className="bg-zinc-900/40 border border-zinc-800/60 p-4 sm:p-5 rounded-2xl shadow-sm transition-all duration-300 relative">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3 items-center">
                    <div 
                      onClick={() => handleChatUser(post.user_id)}
                      className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold border border-zinc-700 cursor-pointer hover:bg-blue-500/30 transition-colors"
                    >
                      {post.user_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span 
                        onClick={() => handleChatUser(post.user_id)}
                        className="font-bold text-white hover:underline cursor-pointer text-sm"
                      >
                        {post.user_name}
                      </span>
                      <p className="text-xs text-zinc-500">{post.timestamp}</p>
                    </div>
                  </div>
                  
                  {/* Functional Dropdown Menu */}
                  <div className="relative">
                    <button onClick={() => setActiveDropdown(activeDropdown === post.id ? null : post.id)} className="text-zinc-500 p-1 hover:bg-zinc-800 rounded-lg">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                    {activeDropdown === post.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl z-20 py-1 animate-in fade-in zoom-in-95">
                        <button onClick={() => handleChatUser(post.user_id)} className="w-full text-left px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-700 flex items-center gap-2">
                          <MessageCircle className="w-4 h-4" /> Message User
                        </button>
                        {post.user_id === profile?.id && (
                          <button className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10">Delete Post</button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-sm text-zinc-200 leading-relaxed mb-4 whitespace-pre-wrap">{post.content}</p>

                <div className="flex gap-2 sm:gap-4 border-t border-zinc-800/40 pt-3">
                  <button onClick={() => handleUpvote(post.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${post.has_upvoted ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400' : 'bg-zinc-800/30 text-zinc-400 hover:bg-zinc-800/65'}`}>
                    <ArrowUp className={`w-4 h-4 ${post.has_upvoted ? 'text-blue-400 animate-bounce' : 'text-zinc-400'}`} />
                    <span>{post.upvotes}</span>
                  </button>
                  <button onClick={() => setActiveCommentPost(activeCommentPost === post.id ? null : post.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800/30 text-zinc-400 hover:bg-zinc-800/65 hover:text-white transition-all text-xs sm:text-sm font-semibold">
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.comments_count}</span>
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800/30 text-zinc-400 hover:bg-zinc-800/65 hover:text-white transition-all text-xs sm:text-sm font-semibold ml-auto">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Expanding Comment Box */}
                {activeCommentPost === post.id && (
                  <div className="mt-4 pt-4 border-t border-zinc-800/50 animate-in fade-in slide-in-from-top-2">
                    <div className="flex gap-2">
                      <input type="text" placeholder="Write a comment..." className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium text-sm">Post</button>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        </main>
      </div>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-950/80 backdrop-blur-2xl border-t border-zinc-800/80 z-40 flex justify-around py-3">
        <button className="flex flex-col items-center gap-1.5 text-blue-500 py-0.5 px-3"><Home className="w-5 h-5 fill-blue-500/10" /></button>
        <button className="flex flex-col items-center gap-1.5 text-zinc-500 hover:text-white py-0.5 px-3"><BookOpen className="w-5 h-5" /></button>
        <button onClick={() => router.push('/messages')} className="flex flex-col items-center gap-1.5 text-zinc-500 hover:text-white py-0.5 px-3"><MessageCircle className="w-5 h-5" /></button>
        <button className="flex flex-col items-center gap-1.5 text-zinc-500 hover:text-white py-0.5 px-3"><User className="w-5 h-5" /></button>
      </nav>
    </div>
  );
}
