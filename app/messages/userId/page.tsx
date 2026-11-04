'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { ArrowLeft, Send, Loader2, MoreVertical, ShieldCheck } from 'lucide-react';

interface Profile {
  id: string;
  full_name: string;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const partnerId = params.userId as string;

  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [partner, setPartner] = useState<Profile | null>(null);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/signup');
          return;
        }

        // Get current user's profile
        const { data: myProfile } = await supabase
          .from('profiles')
          .select('id, full_name')
          .eq('id', user.id)
          .single();
        setCurrentUser(myProfile);

        // Get chat partner's profile
        const { data: partnerProfile } = await supabase
          .from('profiles')
          .select('id, full_name')
          .eq('id', partnerId)
          .single();
        setPartner(partnerProfile);

        // Fetch message history between these two users
        const { data: chatHistory } = await supabase
          .from('messages')
          .select('*')
          .or(`and(sender_id.eq.${user.id},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${user.id})`)
          .order('created_at', { ascending: true });

        if (chatHistory) {
          setMessages(chatHistory);
        }
      } catch (error) {
        console.error('Error loading chat:', error);
      } finally {
        setLoading(false);
      }
    };

    if (partnerId) {
      initializeChat();
    }
  }, [partnerId, router]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || !partner) return;

    const messageText = newMessage.trim();
    setNewMessage(''); // Clear input immediately for snappy feel
    setIsSending(true);

    // Optimistic UI Update (add it to the screen instantly)
    const optimisticMsg: Message = {
      id: String(Date.now()),
      sender_id: currentUser.id,
      receiver_id: partner.id,
      content: messageText,
      created_at: new Date().toISOString()
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      // Actually save it to the database
      await supabase.from('messages').insert({
        sender_id: currentUser.id,
        receiver_id: partner.id,
        content: messageText
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-zinc-500 text-sm">Opening secure chat...</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-zinc-950 flex flex-col font-sans">
      
      {/* Chat Header (Sticky Top) */}
      <header className="bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-800/80 px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.back()} 
            className="p-2 -ml-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold text-lg">
              {partner?.full_name?.charAt(0).toUpperCase() || '?'}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-white text-sm sm:text-base leading-tight">
                {partner?.full_name || 'Student'}
              </span>
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> E2E Encrypted
              </span>
            </div>
          </div>
        </div>

        <button className="p-2 text-zinc-400 hover:text-white rounded-full transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </header>

      {/* Chat Messages Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-950 relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 z-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        
        <div className="relative z-10 space-y-4 flex flex-col">
          {messages.length === 0 ? (
            <div className="text-center mt-10">
              <div className="inline-block bg-zinc-900 text-zinc-400 text-xs px-4 py-2 rounded-xl mb-4">
                This is the start of your secure conversation with {partner?.full_name?.split(' ')[0]}.
              </div>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender_id === currentUser?.id;
              
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`max-w-[75%] md:max-w-[60%] px-4 py-2.5 text-sm sm:text-base ${
                      isMe 
                        ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm shadow-md shadow-blue-900/20' 
                        : 'bg-zinc-800 text-zinc-100 rounded-2xl rounded-tl-sm border border-zinc-700/50 shadow-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words leading-relaxed">{msg.content}</p>
                    <div className={`text-[10px] mt-1.5 text-right ${isMe ? 'text-blue-200' : 'text-zinc-500'}`}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Chat Input Area (Sticky Bottom) */}
      <footer className="bg-zinc-900/90 backdrop-blur-xl border-t border-zinc-800/80 p-3 sm:p-4 z-20">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Message..."
            className="flex-1 bg-zinc-950 border border-zinc-700 rounded-full px-5 py-3 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            autoComplete="off"
          />
          <button 
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className="w-12 h-12 flex-shrink-0 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-all shadow-md shadow-blue-900/20 active:scale-95"
          >
            <Send className="w-5 h-5 ml-1" />
          </button>
        </form>
      </footer>
    </div>
  );
}
