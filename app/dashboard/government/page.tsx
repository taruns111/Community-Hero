'use client';
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ChatWidget from '@/components/chat/ChatWidget';
import { useApp } from '@/lib/store';
import { mockDepartments, monthlyData, categoryDistribution, resolutionTrend } from '@/lib/mockData';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from 'recharts';
import {
  AlertTriangle, Clock, CheckCircle, TrendingUp, Filter, Download,
  ChevronRight, Eye, Users, BarChart3, MapPin
} from 'lucide-react';

const COLORS = ['#ef4444', '#f97316', '#3b82f6', '#eab308', '#8b5cf6', '#22c55e', '#6b7280'];

export default function GovernmentDashboard() {
  const { issues } = useApp();
  const [dateFilter, setDateFilter] = useState('7d');
  const [selectedDept, setSelectedDept] = useState('all');
  const [activeView, setActiveView] = useState<'overview' | 'complaints' | 'departments'>('overview');

  const stats = {
    total: issues.length,
    critical: issues.filter(i => i.severity === 'Critical').length,
    pending: issues.filter(i => i.status === 'Reported' || i.status === 'Verified').length,
    inProgress: issues.filter(i => i.status === 'In Progress' || i.status === 'Assigned').length,
    resolved: issues.filter(i => i.status === 'Completed').length,
    avgResolution: 3.2,
  };

  const priorityIssues = issues
    .filter(i => i.severity === 'Critical' || i.severity === 'High')
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 10);

  const deptPerformance = mockDepartments.map(d => ({
    name: d.shortName,
    resolved: Math.round((d.resolvedCount / d.issueCount) * 100),
    avgDays: d.avgResolutionDays,
    issues: d.issueCount,
  }));

  const wardData = [
    { ward: 'A Ward', issues: 23, resolved: 19 },
    { ward: 'H/W', issues: 41, resolved: 35 },
    { ward: 'K/W', issues: 56, resolved: 44 },
    { ward: 'P/N', issues: 38, resolved: 30 },
    { ward: 'R/N', issues: 47, resolved: 38 },
    { ward: 'L Ward', issues: 29, resolved: 24 },
    { ward: 'G/N', issues: 52, resolved: 40 },
    { ward: 'N Ward', issues: 34, resolved: 25 },
  ];

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const statusBadge = (status: string) => {
    const m: Record<string, string> = { Reported: 'badge-reported', Verified: 'badge-verified', Assigned: 'badge-assigned', 'In Progress': 'badge-progress', Completed: 'badge-completed' };
    return m[status] || 'badge-reported';
  };

  return (
    <main className="min-h-screen bg-dark-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-display font-black text-white">Government <span className="gradient-text">Dashboard</span></h1>
            <p className="text-slate-400 mt-1">Municipal Corporation of Mumbai · Real-time Overview</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Date filter */}
            <div className="flex gap-1 bg-dark-900 p-1 rounded-xl">
              {['24h', '7d', '30d', '90d'].map(d => (
                <button
                  key={d}
                  onClick={() => setDateFilter(d)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${dateFilter === d ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  {d}
                </button>
              ))}
            </div>
            <button className="btn-secondary text-sm px-4 py-2">
              <Download size={15} /> Export
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { label: 'Total', value: stats.total, icon: '📋', color: 'text-white', bg: 'bg-dark-800' },
            { label: 'Critical', value: stats.critical, icon: '🚨', color: 'text-red-400', bg: 'bg-red-500/10' },
            { label: 'Pending', value: stats.pending, icon: '⏳', color: 'text-slate-400', bg: 'bg-dark-800' },
            { label: 'Active', value: stats.inProgress, icon: '⚙️', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
            { label: 'Resolved', value: stats.resolved, icon: '✅', color: 'text-green-400', bg: 'bg-green-500/10' },
            { label: 'Avg Days', value: stats.avgResolution, icon: '📅', color: 'text-blue-400', bg: 'bg-blue-500/10' },
          ].map((kpi, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`glass-card p-4 ${kpi.bg}`}
            >
              <div className="text-xl mb-1">{kpi.icon}</div>
              <div className={`text-2xl font-display font-black ${kpi.color}`}>{kpi.value}</div>
              <div className="text-slate-400 text-xs mt-0.5">{kpi.label}</div>
            </motion.div>
          ))}
        </div>

        {/* View Tabs */}
        <div className="flex gap-1 bg-dark-900 p-1 rounded-xl mb-6 w-fit">
          {[['overview', 'Overview'], ['complaints', 'Priority Queue'], ['departments', 'Departments']].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveView(key as typeof activeView)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeView === key ? 'bg-blue-500 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeView === 'overview' && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Monthly Bar Chart */}
            <div className="glass-card p-6">
              <h3 className="text-white font-bold mb-5 flex items-center gap-2"><BarChart3 size={18} className="text-blue-400" /> Monthly Complaints vs Resolved</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10 }} />
                  <Bar dataKey="reported" name="Reported" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="resolved" name="Resolved" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Category Pie */}
            <div className="glass-card p-6">
              <h3 className="text-white font-bold mb-5">Category Distribution</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={categoryDistribution} cx="50%" cy="50%" outerRadius={85} dataKey="value" paddingAngle={3} label={({ name, value }) => `${name} ${value}%`} labelLine={false}>
                    {categoryDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Resolution Trend */}
            <div className="glass-card p-6">
              <h3 className="text-white font-bold mb-5 flex items-center gap-2"><TrendingUp size={18} className="text-green-400" /> Resolution Trend (Avg Days)</h3>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={resolutionTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="week" stroke="#64748b" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10 }} />
                  <Line type="monotone" dataKey="avgDays" stroke="#22c55e" strokeWidth={2.5} dot={{ fill: '#22c55e', r: 4 }} name="Avg Days" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Ward-wise */}
            <div className="glass-card p-6">
              <h3 className="text-white font-bold mb-5 flex items-center gap-2"><MapPin size={18} className="text-orange-400" /> Ward-wise Issues</h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={wardData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                  <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="ward" stroke="#64748b" tick={{ fontSize: 11 }} width={40} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10 }} />
                  <Bar dataKey="issues" name="Total" fill="#ef4444" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="resolved" name="Resolved" fill="#22c55e" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Priority Queue */}
        {activeView === 'complaints' && (
          <div className="glass-card overflow-hidden">
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-white font-bold flex items-center gap-2"><AlertTriangle size={18} className="text-red-400" /> Priority Complaints</h3>
              <span className="text-slate-400 text-sm">{priorityIssues.length} critical/high issues</span>
            </div>
            <div className="divide-y divide-white/5">
              {priorityIssues.map((issue, i) => (
                <div key={issue.id} className="flex items-center gap-4 p-4 hover:bg-white/5 transition-all">
                  <span className="text-slate-500 text-sm font-mono w-6">{i + 1}</span>
                  <img src={issue.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm line-clamp-1">{issue.title}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                      <span>{issue.department}</span>
                      <span className="flex items-center gap-1"><MapPin size={10} />{issue.location.area}</span>
                      <span>{timeAgo(issue.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs px-2 py-1 rounded-lg border ${issue.severity === 'Critical' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-orange-500/20 text-orange-400 border-orange-500/30'}`}>
                      {issue.severity}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-lg ${statusBadge(issue.status)}`}>{issue.status}</span>
                    <Link href={`/issues/${issue.id}`} className="text-slate-400 hover:text-blue-400">
                      <Eye size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Departments */}
        {activeView === 'departments' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <h3 className="text-white font-bold mb-5">Department Performance</h3>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={deptPerformance}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <Radar name="Resolution %" dataKey="resolved" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="glass-card overflow-hidden">
              <div className="p-5 border-b border-white/5">
                <h3 className="text-white font-bold">Department Leaderboard</h3>
              </div>
              <div className="divide-y divide-white/5">
                {mockDepartments.sort((a, b) => (b.resolvedCount / b.issueCount) - (a.resolvedCount / a.issueCount)).map((dept, i) => {
                  const rate = Math.round((dept.resolvedCount / dept.issueCount) * 100);
                  return (
                    <div key={dept.id} className="flex items-center gap-4 p-4">
                      <span className="text-2xl">{dept.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium">{dept.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1.5 bg-dark-700 rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all" style={{ width: `${rate}%`, background: dept.color }} />
                          </div>
                          <span className="text-xs font-bold" style={{ color: dept.color }}>{rate}%</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-slate-400 text-xs">{dept.resolvedCount}/{dept.issueCount}</p>
                        <p className="text-slate-500 text-xs">{dept.avgResolutionDays}d avg</p>
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
      <ChatWidget />
    </main>
  );
}
