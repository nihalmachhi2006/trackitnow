import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Bell, Check, X, UserPlus, ArrowLeft, Send, CircleDot } from 'lucide-react';
import { chatsApi, friendsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Chat, Message, FriendRequest } from '../types';

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function Avatar({ name, url, size = 'md' }: { name: string; url?: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'h-8 w-8 text-sm', md: 'h-11 w-11 text-base', lg: 'h-12 w-12 text-lg' };
  return (
    <div className={`${sizes[size]} shrink-0 rounded-full overflow-hidden bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center font-bold text-amber-700`}>
      {url ? (
        <img src={url} alt={name} className="h-full w-full object-cover" />
      ) : (
        name.charAt(0).toUpperCase()
      )}
    </div>
  );
}

export default function Chats() {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]); // ✅ no dummy
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [openChatId, setOpenChatId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load real data
  useEffect(() => {
    chatsApi.getChats()
      .then(data => setChats(data))
      .catch(err => {
        console.error('Failed to load chats:', err);
        setChats([]);
      });

    friendsApi.getFriendRequests()
      .then(setRequests)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (openChatId) {
      chatsApi.getMessages(openChatId)
        .then(setMessages)
        .catch(() => {});

      chatsApi.markAsRead(openChatId).catch(() => {});

      setChats(prev =>
        prev.map(c =>
          c.id === openChatId ? { ...c, unread_count: 0 } : c
        )
      );
    }
  }, [openChatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleAccept = async (id: number) => {
    try {
      await friendsApi.acceptFriendRequest(id);
      setRequests(prev => prev.filter(r => r.id !== id));
    } catch {
      setRequests(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleDecline = async (id: number) => {
    try {
      await friendsApi.declineFriendRequest(id);
      setRequests(prev => prev.filter(r => r.id !== id));
    } catch {
      setRequests(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = newMsg.trim();
    if (!text || !openChatId) return;

    setSending(true);

    const optimistic: Message = {
      id: Date.now(),
      sender_id: user?.id ?? 0,
      receiver_id: 0,
      content: text,
      is_read: false,
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, optimistic]);
    setNewMsg('');

    try {
      const sent = await chatsApi.sendMessage(openChatId, text);

      setMessages(prev =>
        prev.map(m => (m.id === optimistic.id ? sent : m))
      );

      setChats(prev =>
        prev.map(c =>
          c.id === openChatId ? { ...c, last_message: sent } : c
        )
      );
    } catch (err) {
      console.error('Send failed:', err);
    }

    setSending(false);
  };

  const totalUnread = chats.reduce((sum, c) => sum + c.unread_count, 0);
  const openChat = chats.find(c => c.id === openChatId);

  return (
    <div className="px-4 py-8 md:px-8">
      <div className="mx-auto max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-3xl font-bold text-slate-900">Chats</h1>
          <p className="mt-1 text-slate-500">Messages and notifications.</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {openChat ? (
            // CHAT THREAD VIEW (unchanged UI)
            <motion.div key="thread" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              
              {/* header */}
              <div className="flex items-center gap-3 border-b border-slate-100 p-4">
                <button onClick={() => setOpenChatId(null)}
                  className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100">
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <Avatar name={openChat.friend.display_name} url={openChat.friend.avatar_url} />
                <div>
                  <p className="font-semibold text-slate-900">{openChat.friend.display_name}</p>
                  <p className="text-xs text-slate-400">@{openChat.friend.username}</p>
                </div>
              </div>

              {/* messages */}
              <div className="flex min-h-[300px] max-h-[50vh] flex-col gap-3 overflow-y-auto p-4">
                {messages.length === 0 ? (
                  <p className="py-8 text-center text-sm text-slate-400">
                    No messages yet. Say hi! 👋
                  </p>
                ) : (
                  messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                        msg.sender_id === user?.id
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-100 text-slate-900'
                      }`}>
                        <p className="text-sm">{msg.content}</p>
                        <p className="mt-1 text-[10px] opacity-70">
                          {timeAgo(msg.created_at)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* input */}
              <form onSubmit={handleSend} className="flex gap-2 border-t border-slate-100 p-3">
                <input
                  type="text"
                  value={newMsg}
                  onChange={e => setNewMsg(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                />
                <button
                  type="submit"
                  disabled={sending || !newMsg.trim()}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50">
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </motion.div>
          ) : (
            // CHAT LIST VIEW
            <motion.section key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="mb-4 flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-amber-500" />
                <h2 className="font-display font-semibold text-slate-900">Messages</h2>
                {totalUnread > 0 && (
                  <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                    <CircleDot className="h-3 w-3" />{totalUnread}
                  </span>
                )}
              </div>

              {chats.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-400">
                  No conversations yet.
                </p>
              ) : (
                <ul className="space-y-1">
                  {chats.map(chat => (
                    <li key={chat.id}>
                      <button
                        onClick={() => setOpenChatId(chat.id)}
                        className="flex w-full items-center gap-3 rounded-xl p-3 text-left hover:bg-slate-50">
                        <Avatar name={chat.friend.display_name} url={chat.friend.avatar_url} />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-slate-900">
                            {chat.friend.display_name}
                          </p>
                          <p className="truncate text-sm text-slate-400">
                            {chat.last_message?.content || 'Start chatting'}
                          </p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
