'use client';
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ChatWidget from '@/components/chat/ChatWidget';
import { useApp } from '@/lib/store';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area
} from 'recharts';
import {
  TrendingUp, Award, Trophy, Star, MapPin, Clock, CheckCircle,
  AlertTriangle, Eye, MessageSquare, ChevronRight, Zap, Shield
} from 'lucide-react';
import { mockUsers, monthlyData, categoryDistribution } from '@/lib/mockData';

const badgeInfo: Record<string, { icon: string; color: string; desc: string }> = {
  'First Reporter': { icon: '📸', color: 'from-blue-500 to-blue-600', desc: 'Filed your first report' },
  'Community Hero': { icon: '🦸', color: 'from-orange-500 to-red-500', desc: 'Helped 100+ citizens' },
  'Problem Solver': { icon: '🔧', color: 'from-green-500 to-emerald-600', desc: '10 issues resolved via your reports' },
  'Neighborhood Guardian': { icon: '🛡️', color: 'from-violet-500 to-purple-600', desc: 'Verified 50+ reports' },
  'Top Contributor': { icon: '⭐', color: 'from-yellow-500 to-orange-500', desc: 'Top 10 monthly contributor' },
  'Monthly Champion': { icon: '🏆', color: 'from-gold-400 to-yellow-500', desc: '#1 this month' },
};

export default function CitizenDashboard() {
  const { user, issues } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'badges'>('overview');

  const myIssues = issues.filter(i => i.reportedBy === user.id).slice(0, 10);
  const levelProgress = (user.points % 500) / 500 * 100;
  const nextLevelPoints = Math.ceil(user.points / 500) * 500;

  const activityData = [
    { day: 'Mon', reports: 2, verified: 5 },
    { day: 'Tue', reports: 1, verified: 3 },
    { day: 'Wed', reports: 3, verified: 7 },
    { day: 'Thu', reports: 0, verified: 4 },
    { day: 'Fri', reports: 2, verified: 6 },
    { day: 'Sat', reports: 4, verified: 9 },
    { day: 'Sun', reports: 1, verified: 2 },
  ];

  const COLORS = ['#3b82f6', '#22c55e', '#f97316', '#8b5cf6', '#ef4444', '#eab308'];

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const statusColor: Record<string, string> = {
    Reported: 'badge-reported',
    Verified: 'badge-verified',
    Assigned: 'badge-assigned',
    'In Progress': 'badge-progress',
    Completed: 'badge-completed',
  };

  return (
    <main className="min-h-screen bg-dark-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-start gap-5 mb-8">
          <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500/30" />
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-display font-black text-white">{user.name}</h1>
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm font-semibold rounded-full border border-blue-500/30">
                Level {user.level} Citizen
              </span>
              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm font-semibold rounded-full border border-yellow-500/30">
                Rank #{user.rank}
              </span>
            </div>
            <p className="text-slate-400 text-sm mt-1">{user.ward} • Joined {new Date(user.joinedAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-400 text-xs">{user.points.toLocaleString()} / {nextLevelPoints.toLocaleString()} pts to Level {user.level + 1}</span>
                <span className="text-blue-400 text-xs font-semibold">{levelProgress.toFixed(0)}%</span>
              </div>
              <div className="progress-bar">
                <motion.div
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${levelProgress}%` }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>
          <Link href="/report" className="btn-primary text-sm hidden sm:flex">+ Report Issue</Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Reports', value: user.totalReports, icon: '📋', color: 'text-blue-400', bg: 'from-blue-500/10 to-blue-600/5' },
            { label: 'Verified', value: user.verifiedReports, icon: '✅', color: 'text-green-400', bg: 'from-green-500/10 to-green-600/5' },
            { label: 'Resolved', value: user.resolvedReports, icon: '🎯', color: 'text-orange-400', bg: 'from-orange-500/10 to-orange-600/5' },
            { label: 'Points Earned', value: user.points.toLocaleString(), icon: '⭐', color: 'text-yellow-400', bg: 'from-yellow-500/10 to-yellow-600/5' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass-card p-5 bg-gradient-to-br ${stat.bg}`}
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className={`text-2xl font-display font-black ${stat.color}`}>{stat.value}</div>
              <div className="text-slate-400 text-sm mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-dark-900 p-1 rounded-xl mb-6 w-fit">
          {[['overview', 'Overview'], ['reports', 'My Reports'], ['badges', 'Badges']].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as typeof activeTab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === key ? 'bg-blue-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Activity Chart */}
            <div className="lg:col-span-2 glass-card p-6">
              <h3 className="text-white font-bold mb-5">Weekly Activity</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#f1f5f9' }} />
                  <Bar dataKey="reports" name="Reports" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="verified" name="Verifications" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Leaderboard Snippet */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-white font-bold">Top Citizens</h3>
                <Link href="/leaderboard" className="text-blue-400 text-xs hover:text-blue-300">View All →</Link>
              </div>
              <div className="space-y-3">
                {mockUsers.slice(0, 5).map((u, i) => (
                  <div key={u.id} className={`flex items-center gap-3 p-2 rounded-xl transition-all ${u.id === user.id ? 'bg-blue-500/10 border border-blue-500/20' : 'hover:bg-white/5'}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${i === 0 ? 'bg-yellow-500 text-black' : i === 1 ? 'bg-slate-400 text-black' : i === 2 ? 'bg-orange-600 text-white' : 'bg-dark-700 text-slate-400'}`}>
                      {i + 1}
                    </div>
                    <img src={u.avatar} alt="" className="w-8 h-8 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{u.name}</p>
                      <p className="text-slate-500 text-xs">{u.totalReports} reports</p>
                    </div>
                    <span className="text-yellow-400 text-xs font-bold">{u.points.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Category distribution */}
            <div className="glass-card p-6">
              <h3 className="text-white font-bold mb-5">City Issue Breakdown</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={categoryDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {categoryDistribution.slice(0, 4).map((c, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: c.color }} />
                    {c.name} ({c.value}%)
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="lg:col-span-2 glass-card p-6">
              <h3 className="text-white font-bold mb-5">Recent Notifications</h3>
              <div className="space-y-3">
                {[
                  { icon: '✅', text: 'Your report "Pothole on MG Road" was verified by 47 citizens', time: '2h ago', color: 'text-green-400' },
                  { icon: '📋', text: 'Issue assigned to Road Maintenance Department', time: '5h ago', color: 'text-blue-400' },
                  { icon: '🎉', text: 'Water pipeline burst at Dadar successfully resolved!', time: '1d ago', color: 'text-orange-400' },
                  { icon: '🏆', text: 'You earned the "Problem Solver" badge!', time: '2d ago', color: 'text-yellow-400' },
                ].map((n, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-dark-800 rounded-xl">
                    <span className="text-xl">{n.icon}</span>
                    <p className="text-slate-300 text-sm flex-1">{n.text}</p>
                    <span className="text-slate-500 text-xs flex-shrink-0">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="glass-card overflow-hidden">
            <div className="p-5 border-b border-white/5">
              <h3 className="text-white font-bold">My Reported Issues</h3>
            </div>
            <div className="divide-y divide-white/5">
              {myIssues.length === 0 ? (
                <div className="p-10 text-center">
                  <p className="text-slate-400">No reports yet. <Link href="/report" className="text-blue-400">Report your first issue!</Link></p>
                </div>
              ) : myIssues.map(issue => (
                <div key={issue.id} className="flex items-center gap-4 p-4 hover:bg-white/5 transition-all">
                  <img src={issue.images[0]} alt="" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm line-clamp-1">{issue.title}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                      <span>{issue.category}</span>
                      <span className="flex items-center gap-1"><MapPin size={10} />{issue.location.area}</span>
                      <span>{timeAgo(issue.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs px-2 py-1 rounded-lg ${statusColor[issue.status] || 'badge-reported'}`}>{issue.status}</span>
                    <Link href={`/issues/${issue.id}`} className="text-slate-400 hover:text-blue-400 transition-colors">
                      <ChevronRight size={18} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'badges' && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {Object.entries(badgeInfo).map(([name, info]) => {
                const unlocked = user.badges.includes(name);
                return (
                  <motion.div
                    key={name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`glass-card p-4 text-center transition-all ${unlocked ? '' : 'opacity-40 grayscale'}`}
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${info.color} flex items-center justify-center text-2xl mx-auto mb-3 ${unlocked ? 'shadow-lg' : ''}`}>
                      {info.icon}
                    </div>
                    <p className="text-white text-xs font-bold mb-1">{name}</p>
                    <p className="text-slate-400 text-xs">{info.desc}</p>
                    {unlocked && <span className="text-green-400 text-xs mt-2 block">✓ Unlocked</span>}
                  </motion.div>
                );
              })}
            </div>
            {/* Locked badges hint */}
            <div className="glass-card p-5">
              <h3 className="text-white font-bold mb-4">How to Unlock More Badges</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { icon: '📸', action: 'Report 5 issues', points: '+250 pts' },
                  { icon: '✅', action: 'Verify 50 reports', points: '+500 pts' },
                  { icon: '💬', action: 'Add 20 helpful comments', points: '+200 pts' },
                ].map((item, i) => (
                  <div key={i} className="bg-dark-800 rounded-xl p-4 flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="text-slate-300 text-sm">{item.action}</p>
                      <p className="text-yellow-400 text-xs font-semibold">{item.points}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
      <ChatWidget />
    </main>
  );
}
