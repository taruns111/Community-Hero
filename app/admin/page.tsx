'use client';
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useApp } from '@/lib/store';
import { mockUsers, mockIssues } from '@/lib/mockData';
import { motion } from 'framer-motion';
import { Users, AlertTriangle, Settings, Shield, Eye, Trash2, CheckCircle, XCircle, BarChart3, Activity } from 'lucide-react';

export default function AdminPage() {
  const { issues } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'content' | 'system'>('overview');

  const pendingMod = issues.filter(i => i.spamProbability > 15).slice(0, 5);

  const systemStats = [
    { label: 'Uptime', value: '99.9%', color: 'text-green-400', icon: '✅' },
    { label: 'API Latency', value: '48ms', color: 'text-blue-400', icon: '⚡' },
    { label: 'AI Requests/Day', value: '2,847', color: 'text-violet-400', icon: '🤖' },
    { label: 'Storage Used', value: '42.3 GB', color: 'text-orange-400', icon: '💾' },
  ];

  return (
    <main className="min-h-screen bg-dark-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-black text-white">Admin <span className="gradient-text">Panel</span></h1>
            <p className="text-slate-400 text-sm">System management and content moderation</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Users', value: mockUsers.length, icon: <Users size={20} />, color: 'text-blue-400', bg: 'from-blue-500/10 to-blue-600/5' },
            { label: 'Total Issues', value: issues.length, icon: <AlertTriangle size={20} />, color: 'text-orange-400', bg: 'from-orange-500/10 to-orange-600/5' },
            { label: 'Flagged Reports', value: pendingMod.length, icon: <Eye size={20} />, color: 'text-red-400', bg: 'from-red-500/10 to-red-600/5' },
            { label: 'System Health', value: '99.9%', icon: <Activity size={20} />, color: 'text-green-400', bg: 'from-green-500/10 to-green-600/5' },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className={`glass-card p-5 bg-gradient-to-br ${stat.bg}`}>
              <div className={`${stat.color} mb-3`}>{stat.icon}</div>
              <div className={`text-2xl font-display font-black ${stat.color}`}>{stat.value}</div>
              <div className="text-slate-400 text-sm mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-dark-900 p-1 rounded-xl mb-6 w-fit">
          {[['overview', 'Overview'], ['users', 'Users'], ['content', 'Moderation'], ['system', 'System']].map(([k, l]) => (
            <button key={k} onClick={() => setActiveTab(k as typeof activeTab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === k ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'}`}>
              {l}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <h3 className="text-white font-bold mb-5">Recent Activity Log</h3>
              <div className="space-y-3">
                {[
                  { action: 'New user registered', user: 'Arjun Das', time: '5m ago', type: 'user' },
                  { action: 'Issue #ISS-050 submitted', user: 'Kavita J', time: '12m ago', type: 'report' },
                  { action: 'Report flagged for spam', user: 'AI System', time: '28m ago', type: 'flag' },
                  { action: 'Department assigned', user: 'Officer Mehta', time: '1h ago', type: 'govt' },
                  { action: 'Issue #ISS-004 resolved', user: 'Emergency Team', time: '3h ago', type: 'resolve' },
                ].map((log, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-dark-800 rounded-xl">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${log.type === 'user' ? 'bg-blue-500/20' : log.type === 'flag' ? 'bg-red-500/20' : log.type === 'resolve' ? 'bg-green-500/20' : 'bg-violet-500/20'}`}>
                      {log.type === 'user' ? '👤' : log.type === 'flag' ? '🚩' : log.type === 'resolve' ? '✅' : '📋'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm">{log.action}</p>
                      <p className="text-slate-500 text-xs">by {log.user}</p>
                    </div>
                    <span className="text-slate-500 text-xs">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-white font-bold mb-5">System Health</h3>
              <div className="grid grid-cols-2 gap-4">
                {systemStats.map((s, i) => (
                  <div key={i} className="bg-dark-800 rounded-xl p-4 text-center">
                    <span className="text-2xl block mb-2">{s.icon}</span>
                    <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-slate-400 text-xs mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-3">
                {[
                  { service: 'Gemini AI API', status: 'operational', latency: '48ms' },
                  { service: 'OpenStreetMap', status: 'operational', latency: '12ms' },
                  { service: 'Firebase Auth', status: 'operational', latency: '85ms' },
                  { service: 'Image Storage', status: 'operational', latency: '230ms' },
                ].map((svc, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 bg-dark-800 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-slate-300 text-sm flex-1">{svc.service}</span>
                    <span className="text-green-400 text-xs">{svc.status}</span>
                    <span className="text-slate-500 text-xs">{svc.latency}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="glass-card overflow-hidden">
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-white font-bold">User Management</h3>
              <span className="text-slate-400 text-sm">{mockUsers.length} registered users</span>
            </div>
            <div className="divide-y divide-white/5">
              {mockUsers.map((u, i) => (
                <div key={u.id} className="flex items-center gap-4 p-4 hover:bg-white/5 transition-all">
                  <img src={u.avatar} alt="" className="w-10 h-10 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm">{u.name}</p>
                    <p className="text-slate-500 text-xs">{u.email} · {u.ward}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-dark-700 text-slate-300 px-2 py-1 rounded-lg">Lv.{u.level}</span>
                    <span className="text-xs text-slate-400">{u.totalReports} reports</span>
                    <span className="text-xs text-yellow-400 font-bold">{u.points.toLocaleString()}pts</span>
                    <button className="text-slate-500 hover:text-blue-400 transition-colors ml-2"><Eye size={14} /></button>
                    <button className="text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="glass-card overflow-hidden">
            <div className="p-5 border-b border-white/5">
              <h3 className="text-white font-bold flex items-center gap-2"><AlertTriangle size={18} className="text-orange-400" /> Content Moderation Queue</h3>
              <p className="text-slate-400 text-sm mt-1">Reports flagged by AI for spam or authenticity issues</p>
            </div>
            <div className="divide-y divide-white/5">
              {pendingMod.map(issue => (
                <div key={issue.id} className="flex items-center gap-4 p-4">
                  <img src={issue.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium line-clamp-1">{issue.title}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                      <span className="text-orange-400">Spam: {issue.spamProbability}%</span>
                      <span>Auth: {issue.authenticityScore}%</span>
                      <span>{issue.category}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1 px-3 py-1.5 bg-green-500/15 text-green-400 border border-green-500/30 rounded-lg text-xs hover:bg-green-500/25">
                      <CheckCircle size={12} /> Approve
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1.5 bg-red-500/15 text-red-400 border border-red-500/30 rounded-lg text-xs hover:bg-red-500/25">
                      <XCircle size={12} /> Remove
                    </button>
                  </div>
                </div>
              ))}
              {pendingMod.length === 0 && (
                <div className="p-10 text-center text-slate-400">
                  <CheckCircle size={32} className="text-green-400 mx-auto mb-3" />
                  <p>No items pending moderation</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <h3 className="text-white font-bold mb-5 flex items-center gap-2"><Settings size={18} className="text-blue-400" /> System Configuration</h3>
              <div className="space-y-4">
                {[
                  { setting: 'Min verifications for auto-escalation', value: '10', type: 'number' },
                  { setting: 'Spam probability threshold (%)', value: '15', type: 'number' },
                  { setting: 'Max report images', value: '3', type: 'number' },
                  { setting: 'Critical issue SLA (hours)', value: '4', type: 'number' },
                  { setting: 'AI analysis enabled', value: 'true', type: 'toggle' },
                  { setting: 'Duplicate detection radius (m)', value: '500', type: 'number' },
                ].map((cfg, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-dark-800 rounded-xl">
                    <span className="text-slate-300 text-sm">{cfg.setting}</span>
                    {cfg.type === 'toggle' ? (
                      <div className="w-10 h-5 bg-green-500 rounded-full relative cursor-pointer">
                        <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5" />
                      </div>
                    ) : (
                      <input defaultValue={cfg.value} className="w-20 bg-dark-700 text-white text-sm text-center rounded-lg px-2 py-1 border border-dark-600 focus:border-blue-500 outline-none" />
                    )}
                  </div>
                ))}
              </div>
              <button className="btn-primary w-full mt-4 justify-center text-sm">Save Configuration</button>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-white font-bold mb-5">API Usage</h3>
              <div className="space-y-4">
                {[
                  { api: 'Gemini Vision API', used: 2847, limit: 5000, color: '#3b82f6' },
                  { api: 'Gemini Chat API', used: 1203, limit: 2000, color: '#22c55e' },
                  { api: 'Firebase Auth', used: 480, limit: 10000, color: '#f97316' },
                  { api: 'OpenStreetMap Tiles', used: 45200, limit: 100000, color: '#8b5cf6' },
                ].map((api, i) => {
                  const pct = Math.round((api.used / api.limit) * 100);
                  return (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-slate-300">{api.api}</span>
                        <span className="text-slate-400">{api.used.toLocaleString()} / {api.limit.toLocaleString()}</span>
                      </div>
                      <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: api.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
