'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { 
  ShieldAlert, Users, FileText, Activity, Settings, 
  LogOut, TrendingUp, AlertCircle, Database, Search, 
  Loader2, Sparkles, Ban
} from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  totalPosts: number;
  totalComments: number;
}

interface UserProfile {
  id: string;
  full_name: string;
  c_coins: number;
  study_streak: number;
  created_at: string;
}

export default function PremiumAdminPanel() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats>({ totalUsers: 0, totalPosts: 0, totalComments: 0 });
  const [recentUsers, setRecentUsers] = useState<UserProfile[]>([]);
  const [adminName, setAdminName] = useState('');

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/signup');
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('full_name, is_admin')
          .eq('id', user.id)
          .single();

        if (error || !profile?.is_admin) {
          router.push('/dashboard'); 
          return;
        }

        // Safely set admin name with fallback
        setAdminName(profile?.full_name || 'Super Admin');

        const [usersReq, postsReq, commentsReq] = await Promise.all([
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          supabase.from('posts').select('id', { count: 'exact', head: true }),
          supabase.from('comments').select('id', { count: 'exact', head: true })
        ]);

        setStats({
          totalUsers: usersReq.count || 0,
          totalPosts: postsReq.count || 0,
          totalComments: commentsReq.count || 0,
        });

        const { data: latestUsers } = await supabase
          .from('profiles')
          .select('id, full_name, c_coins, study_streak, created_at')
          .order('created_at', { ascending: false })
          .limit(5);

        if (latestUsers) setRecentUsers(latestUsers);

      } catch (error) {
        console.error('Admin Verification Failed:', error);
      } finally {
        setLoading(false);
      }
    };

    verifyAdmin();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/signup');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full animate-pulse" />
          <ShieldAlert className="w-12 h-12 text-blue-500 animate-bounce relative z-10" />
        </div>
        <p className="text-zinc-400 font-medium tracking-widest uppercase text-xs">Authenticating Clearance...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex relative overflow-hidden">
      
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-900/10 rounded-full blur-[150px]" />
      </div>

      <aside className="w-72 bg-zinc-900/40 backdrop-blur-3xl border-r border-zinc-800/50 hidden lg:flex flex-col relative z-10 shadow-2xl shadow-black">
        <div className="p-8 border-b border-zinc-800/50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white">Fort<span className="text-blue-500">Codec</span></h1>
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Admin Protocol</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold transition-all">
            <Activity className="w-5 h-5" />
            <span>Command Center</span>
          </button>
          <button className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all">
            <Users className="w-5 h-5" />
            <span>User Management</span>
          </button>
          <button className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all">
            <FileText className="w-5 h-5" />
            <span>Content Moderation</span>
          </button>
          <button className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all">
            <Settings className="w-5 h-5" />
            <span>System Settings</span>
          </button>
        </nav>

        <div className="p-4 border-t border-zinc-800/50">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 shrink-0">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">{adminName}</p>
                <p className="text-[10px] text-emerald-500 uppercase tracking-wider font-bold">Super Admin</p>
              </div>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all font-semibold text-sm">
            <LogOut className="w-4 h-4" />
            Terminate Session
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto relative z-10">
        {/* Mobile Header - Shows on small screens so you can still log out */}
        <div className="lg:hidden p-4 border-b border-zinc-800/50 flex justify-between items-center bg-zinc-900/40 backdrop-blur-xl sticky top-0 z-20">
           <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-blue-500" />
            <span className="font-extrabold text-white">FortCodec Admin</span>
          </div>
          <button onClick={handleLogout} className="p-2 text-red-400 bg-red-500/10 rounded-lg">
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-10 space-y-8">
          
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">System Overview</h2>
              <p className="text-zinc-400 mt-1 text-sm sm:text-base">Real-time metrics for the Studial network.</p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-4 top-3 w-5 h-5 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search users, IDs..." 
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-2.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/60 p-6 rounded-2xl relative overflow-hidden group hover:border-blue-500/30 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-500">
                  <Users className="w-6 h-6" />
                </div>
                <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded-lg">
                  <TrendingUp className="w-3 h-3" /> +12%
                </span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white relative z-10">{stats.totalUsers.toLocaleString() || 0}</h3>
              <p className="text-zinc-500 text-sm font-medium mt-1 relative z-10">Registered Students</p>
            </div>

            <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/60 p-6 rounded-2xl relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors" />
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
                  <Database className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white relative z-10">{stats.totalPosts.toLocaleString() || 0}</h3>
              <p className="text-zinc-500 text-sm font-medium mt-1 relative z-10">Total Feed Posts</p>
            </div>

            <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/60 p-6 rounded-2xl relative overflow-hidden group hover:border-violet-500/30 transition-colors sm:col-span-2 md:col-span-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-full blur-2xl group-hover:bg-violet-500/10 transition-colors" />
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-3 bg-violet-500/10 rounded-xl border border-violet-500/20 text-violet-400">
                  <MessageSquare className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white relative z-10">{stats.totalComments.toLocaleString() || 0}</h3>
              <p className="text-zinc-500 text-sm font-medium mt-1 relative z-10">Active Comments</p>
            </div>
          </div>

          <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/60 rounded-2xl overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-zinc-800/60 flex justify-between items-center bg-zinc-900/50">
              <div className="flex items-center gap-2 sm:gap-3">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 shrink-0" />
                <h3 className="text-base sm:text-lg font-bold text-white">Recent Registrations</h3>
              </div>
              <button className="text-xs sm:text-sm font-semibold text-blue-500 hover:text-blue-400">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-zinc-800/50 text-zinc-400 text-[10px] sm:text-xs uppercase tracking-widest bg-zinc-950/30">
                    <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold">Student Name</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold">C-Coins Balance</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold">Study Streak</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/30 text-xs sm:text-sm">
                  {recentUsers.map((user) => {
                    const safeName = user.full_name || 'Student';
                    const initial = safeName.charAt(0).toUpperCase();
                    
                    return (
                      <tr key={user.id} className="hover:bg-zinc-800/20 transition-colors group">
                        <td className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-zinc-200 flex items-center gap-3">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] sm:text-xs font-bold text-zinc-400 border border-zinc-700 shrink-0">
                            {initial}
                          </div>
                          <span className="truncate">{safeName}</span>
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                          <span className="inline-flex items-center gap-1.5 bg-yellow-500/10 text-yellow-500 px-2 py-1 sm:px-2.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-bold border border-yellow-500/20">
                            {user.c_coins || 0}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                          <span className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-400 px-2 py-1 sm:px-2.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-bold border border-orange-500/20">
                            <Flame className="w-3 h-3" /> {user.study_streak || 0}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-right">
                          <button className="p-1.5 sm:p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors inline-flex items-center justify-center">
                            <Ban className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {recentUsers.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-zinc-500 text-sm">No users found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
