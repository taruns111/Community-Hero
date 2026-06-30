'use client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ChatWidget from '@/components/chat/ChatWidget';
import { useApp } from '@/lib/store';
import { mockUsers } from '@/lib/mockData';
import { motion } from 'framer-motion';
import { Trophy, Star, TrendingUp, Award, Medal } from 'lucide-react';

const badgeColors: Record<string, string> = {
  'First Reporter': 'from-blue-500 to-blue-700',
  'Community Hero': 'from-orange-500 to-red-600',
  'Problem Solver': 'from-green-500 to-emerald-700',
  'Neighborhood Guardian': 'from-violet-500 to-purple-700',
  'Top Contributor': 'from-yellow-500 to-orange-600',
  'Monthly Champion': 'from-pink-500 to-rose-600',
};

const badgeIcons: Record<string, string> = {
  'First Reporter': '📸',
  'Community Hero': '🦸',
  'Problem Solver': '🔧',
  'Neighborhood Guardian': '🛡️',
  'Top Contributor': '⭐',
  'Monthly Champion': '🏆',
};

export default function LeaderboardPage() {
  const { user } = useApp();

  return (
    <main className="min-h-screen bg-dark-950">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}>
            <div className="text-6xl mb-4">🏆</div>
          </motion.div>
          <h1 className="text-4xl font-display font-black text-white mb-2">
            Community <span className="gradient-text">Leaderboard</span>
          </h1>
          <p className="text-slate-400">Top civic heroes making their city better every day</p>
        </div>

        {/* Top 3 Podium */}
        <div className="flex items-end justify-center gap-4 mb-12">
          {/* 2nd place */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <img src={mockUsers[1].avatar} alt="" className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-400 mb-2" />
            <p className="text-white font-bold text-sm">{mockUsers[1].name.split(' ')[0]}</p>
            <p className="text-yellow-400 text-xs mb-3">{mockUsers[1].points.toLocaleString()} pts</p>
            <div className="w-24 bg-slate-400/20 border border-slate-400/30 rounded-t-2xl flex flex-col items-center justify-start pt-3 h-24">
              <span className="text-3xl">🥈</span>
              <span className="text-slate-300 font-black text-2xl mt-1">2</span>
            </div>
          </motion.div>

          {/* 1st place */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center"
          >
            <div className="relative">
              <img src={mockUsers[0].avatar} alt="" className="w-20 h-20 rounded-2xl object-cover border-2 border-yellow-400 mb-2" />
              <div className="absolute -top-3 -right-3 text-2xl">👑</div>
            </div>
            <p className="text-white font-bold">{mockUsers[0].name.split(' ')[0]}</p>
            <p className="text-yellow-400 text-sm font-semibold mb-3">{mockUsers[0].points.toLocaleString()} pts</p>
            <div className="w-24 bg-yellow-500/20 border border-yellow-500/40 rounded-t-2xl flex flex-col items-center justify-start pt-3 h-36">
              <span className="text-3xl">🥇</span>
              <span className="text-yellow-400 font-black text-2xl mt-1">1</span>
            </div>
          </motion.div>

          {/* 3rd place */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center"
          >
            <img src={mockUsers[2].avatar} alt="" className="w-16 h-16 rounded-2xl object-cover border-2 border-orange-600 mb-2" />
            <p className="text-white font-bold text-sm">{mockUsers[2].name.split(' ')[0]}</p>
            <p className="text-yellow-400 text-xs mb-3">{mockUsers[2].points.toLocaleString()} pts</p>
            <div className="w-24 bg-orange-600/20 border border-orange-600/30 rounded-t-2xl flex flex-col items-center justify-start pt-3 h-16">
              <span className="text-2xl">🥉</span>
              <span className="text-orange-400 font-black text-2xl mt-1">3</span>
            </div>
          </motion.div>
        </div>

        {/* Full Leaderboard Table */}
        <div className="glass-card overflow-hidden mb-8">
          <div className="p-5 border-b border-white/5">
            <h2 className="text-white font-bold">All Rankings</h2>
          </div>
          <div className="divide-y divide-white/5">
            {mockUsers.map((u, i) => (
              <motion.div
                key={u.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center gap-4 p-4 hover:bg-white/5 transition-all ${u.id === user.id ? 'bg-blue-500/10 border-l-2 border-blue-500' : ''}`}
              >
                {/* Rank */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg flex-shrink-0 ${
                  i === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                  i === 1 ? 'bg-slate-400/20 text-slate-300' :
                  i === 2 ? 'bg-orange-600/20 text-orange-400' :
                  'bg-dark-800 text-slate-500'
                }`}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                </div>

                {/* Avatar */}
                <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white font-semibold text-sm">{u.name}</p>
                    {u.id === user.id && <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">You</span>}
                    <span className="text-xs bg-dark-700 text-slate-400 px-2 py-0.5 rounded-full">Lv.{u.level}</span>
                  </div>
                  <p className="text-slate-500 text-xs mt-0.5">{u.ward} · {u.totalReports} reports</p>
                </div>

                {/* Badges */}
                <div className="hidden md:flex gap-1">
                  {u.badges.slice(0, 3).map((badge, bi) => (
                    <span key={bi} className="text-lg" title={badge}>{badgeIcons[badge] || '🏅'}</span>
                  ))}
                  {u.badges.length > 3 && <span className="text-xs text-slate-400 self-center">+{u.badges.length - 3}</span>}
                </div>

                {/* Stats */}
                <div className="text-right flex-shrink-0">
                  <p className="text-yellow-400 font-bold text-sm">{u.points.toLocaleString()}</p>
                  <p className="text-slate-500 text-xs">points</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* How to Earn */}
        <div className="glass-card p-6">
          <h2 className="text-white font-bold text-lg mb-5">How to Climb the Leaderboard</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: '📸', action: 'Report Issue', points: '+50 pts', color: 'from-blue-500/20 to-blue-600/10' },
              { icon: '✅', action: 'Verify Report', points: '+20 pts', color: 'from-green-500/20 to-green-600/10' },
              { icon: '💬', action: 'Helpful Comment', points: '+10 pts', color: 'from-orange-500/20 to-orange-600/10' },
              { icon: '🎯', action: 'Issue Resolved', points: '+100 pts', color: 'from-violet-500/20 to-violet-600/10' },
            ].map((item, i) => (
              <div key={i} className={`bg-gradient-to-br ${item.color} border border-white/5 rounded-2xl p-4 text-center`}>
                <span className="text-3xl block mb-2">{item.icon}</span>
                <p className="text-white text-sm font-medium">{item.action}</p>
                <p className="text-yellow-400 text-sm font-bold mt-1">{item.points}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
      <ChatWidget />
    </main>
  );
}
