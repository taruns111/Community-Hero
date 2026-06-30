'use client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ChatWidget from '@/components/chat/ChatWidget';
import { monthlyData, categoryDistribution, resolutionTrend, mockDepartments } from '@/lib/mockData';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, ScatterChart, Scatter, ZAxis
} from 'recharts';
import { TrendingUp, TrendingDown, BarChart3, Activity, Globe, Cpu } from 'lucide-react';

const COLORS = ['#ef4444', '#f97316', '#3b82f6', '#eab308', '#8b5cf6', '#22c55e', '#6b7280'];

const citizenParticipation = [
  { month: 'Jan', active: 8200, new: 650 },
  { month: 'Feb', active: 9100, new: 820 },
  { month: 'Mar', active: 9800, new: 940 },
  { month: 'Apr', active: 10400, new: 780 },
  { month: 'May', active: 11200, new: 1050 },
  { month: 'Jun', active: 12450, new: 1320 },
];

const predictiveData = [
  { area: 'Andheri', current: 56, predicted: 72, risk: 'High' },
  { area: 'Borivali', current: 47, predicted: 61, risk: 'High' },
  { area: 'Ghatkopar', current: 34, predicted: 48, risk: 'Medium' },
  { area: 'Malad', current: 38, predicted: 43, risk: 'Medium' },
  { area: 'Bandra', current: 41, predicted: 38, risk: 'Low' },
  { area: 'Powai', current: 29, predicted: 31, risk: 'Low' },
  { area: 'Dadar', current: 52, predicted: 65, risk: 'High' },
  { area: 'Chembur', current: 43, predicted: 50, risk: 'Medium' },
];

const heatmapData = [
  { x: 1, y: 1, size: 80, area: 'Dharavi' },
  { x: 2, y: 3, size: 60, area: 'Kurla' },
  { x: 3, y: 2, size: 45, area: 'Ghatkopar' },
  { x: 4, y: 4, size: 70, area: 'Andheri' },
  { x: 2, y: 5, size: 30, area: 'Borivali' },
  { x: 5, y: 1, size: 55, area: 'Chembur' },
  { x: 1, y: 4, size: 25, area: 'Bandra' },
  { x: 3, y: 5, size: 40, area: 'Malad' },
];

export default function AnalyticsDashboard() {
  return (
    <main className="min-h-screen bg-dark-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-black text-white">Analytics <span className="gradient-text">Dashboard</span></h1>
          <p className="text-slate-400 mt-1">Comprehensive civic data insights and predictive analytics</p>
        </div>

        {/* Summary KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Issues', value: '1,247', change: '+18.3%', up: true, color: 'text-blue-400' },
            { label: 'Resolution Rate', value: '89.2%', change: '+4.1%', up: true, color: 'text-green-400' },
            { label: 'Citizen Participation', value: '12,450', change: '+12.8%', up: true, color: 'text-orange-400' },
            { label: 'Avg Resolution', value: '3.2 days', change: '-0.8d', up: true, color: 'text-violet-400' },
          ].map((kpi, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-xs">{kpi.label}</span>
                <span className={`flex items-center gap-1 text-xs font-semibold ${kpi.up ? 'text-green-400' : 'text-red-400'}`}>
                  {kpi.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {kpi.change}
                </span>
              </div>
              <div className={`text-2xl font-display font-black ${kpi.color}`}>{kpi.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Row 1 */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Monthly Trend */}
          <div className="lg:col-span-2 glass-card p-6">
            <h3 className="text-white font-bold mb-5 flex items-center gap-2">
              <BarChart3 size={18} className="text-blue-400" /> Monthly Complaints & Resolution
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorReported" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10 }} />
                <Area type="monotone" dataKey="reported" stroke="#3b82f6" strokeWidth={2} fill="url(#colorReported)" name="Reported" />
                <Area type="monotone" dataKey="resolved" stroke="#22c55e" strokeWidth={2} fill="url(#colorResolved)" name="Resolved" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Category Donut */}
          <div className="glass-card p-6">
            <h3 className="text-white font-bold mb-5">Issue Categories</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={categoryDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {categoryDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {categoryDistribution.map((c, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-slate-400 flex-1">{c.name}</span>
                  <span className="text-white font-medium">{c.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Resolution Trend */}
          <div className="glass-card p-6">
            <h3 className="text-white font-bold mb-5 flex items-center gap-2">
              <TrendingUp size={18} className="text-green-400" /> Resolution Time Trend (Avg Days)
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={resolutionTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="week" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} domain={[2, 6]} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10 }} formatter={(v) => [`${v} days`, 'Avg Resolution']} />
                <Line type="monotone" dataKey="avgDays" stroke="#22c55e" strokeWidth={3} dot={{ fill: '#22c55e', r: 5 }} name="Avg Days" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Citizen Participation */}
          <div className="glass-card p-6">
            <h3 className="text-white font-bold mb-5 flex items-center gap-2">
              <Activity size={18} className="text-orange-400" /> Citizen Participation Growth
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={citizenParticipation}>
                <defs>
                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10 }} />
                <Area type="monotone" dataKey="active" stroke="#f97316" strokeWidth={2} fill="url(#colorActive)" name="Active Citizens" />
                <Bar dataKey="new" name="New Citizens" fill="#3b82f6" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Row 3 — Predictive Analytics */}
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Cpu size={18} className="text-violet-400" />
            <h3 className="text-white font-bold">Predictive Analytics — Future Hotspots</h3>
            <span className="ml-auto px-3 py-1 bg-violet-500/20 text-violet-300 text-xs rounded-full border border-violet-500/30">AI Prediction</span>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={predictiveData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="area" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10 }} />
                <Bar dataKey="current" name="Current Issues" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="predicted" name="Predicted (Next Month)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              <p className="text-slate-400 text-sm mb-4">High-risk areas requiring proactive intervention:</p>
              {predictiveData.sort((a, b) => b.predicted - a.predicted).slice(0, 5).map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded-lg font-semibold ${item.risk === 'High' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : item.risk === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>
                    {item.risk}
                  </span>
                  <span className="text-white text-sm flex-1">{item.area}</span>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>{item.current} → </span>
                    <span className={item.predicted > item.current ? 'text-red-400 font-bold' : 'text-green-400 font-bold'}>{item.predicted}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Department Radar */}
        <div className="glass-card p-6">
          <h3 className="text-white font-bold mb-5 flex items-center gap-2">
            <Globe size={18} className="text-blue-400" /> Department Performance Overview
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={mockDepartments.map(d => ({
              dept: d.shortName,
              resolved: Math.round((d.resolvedCount / d.issueCount) * 100),
              speed: Math.round(100 - (d.avgResolutionDays / 7) * 100),
              volume: Math.round((d.issueCount / 142) * 100),
            }))}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="dept" stroke="#64748b" tick={{ fontSize: 12 }} />
              <Radar name="Resolution %" dataKey="resolved" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} strokeWidth={2} />
              <Radar name="Speed" dataKey="speed" stroke="#22c55e" fill="#22c55e" fillOpacity={0.15} strokeWidth={2} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <Footer />
      <ChatWidget />
    </main>
  );
}
