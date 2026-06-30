'use client';
import { useState, useMemo } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ChatWidget from '@/components/chat/ChatWidget';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { IssueCategory, IssueSeverity, IssueStatus, getCategoryIcon, getSeverityColor } from '@/lib/mockData';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, ThumbsUp, Clock, Eye, ChevronDown, SortAsc, Plus } from 'lucide-react';

export default function IssuesPage() {
  const { issues } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [showFilters, setShowFilters] = useState(false);

  const categories: IssueCategory[] = ['Pothole', 'Garbage', 'Water Leakage', 'Street Light', 'Drainage', 'Road Damage', 'Illegal Dumping', 'Fallen Tree', 'Traffic Signal', 'Sewage', 'Graffiti', 'Noise Pollution'];
  const statuses: IssueStatus[] = ['Reported', 'Verified', 'Assigned', 'In Progress', 'Completed'];
  const severities: IssueSeverity[] = ['Low', 'Medium', 'High', 'Critical'];

  const filtered = useMemo(() => {
    let result = [...issues];
    if (search) result = result.filter(i => i.title.toLowerCase().includes(search.toLowerCase()) || i.description.toLowerCase().includes(search.toLowerCase()) || i.category.toLowerCase().includes(search.toLowerCase()));
    if (statusFilter !== 'all') result = result.filter(i => i.status === statusFilter);
    if (categoryFilter !== 'all') result = result.filter(i => i.category === categoryFilter);
    if (severityFilter !== 'all') result = result.filter(i => i.severity === severityFilter);
    switch (sortBy) {
      case 'newest': result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      case 'votes': result.sort((a, b) => b.votes - a.votes); break;
      case 'severity': result.sort((a, b) => ['Critical', 'High', 'Medium', 'Low'].indexOf(a.severity) - ['Critical', 'High', 'Medium', 'Low'].indexOf(b.severity)); break;
    }
    return result;
  }, [issues, search, statusFilter, categoryFilter, severityFilter, sortBy]);

  const getStatusBadge = (status: IssueStatus) => {
    const classes: Record<IssueStatus, string> = {
      Reported: 'badge-reported',
      Verified: 'badge-verified',
      Assigned: 'badge-assigned',
      'In Progress': 'badge-progress',
      Completed: 'badge-completed',
      Rejected: 'badge-rejected',
    };
    return classes[status];
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <main className="min-h-screen bg-dark-950">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-black text-white">Community <span className="gradient-text">Issues</span></h1>
            <p className="text-slate-400 mt-1">{filtered.length} issues found</p>
          </div>
          <Link href="/report" className="btn-primary text-sm">
            <Plus size={16} /> Report New
          </Link>
        </div>

        {/* Search + Filters */}
        <div className="glass-card p-4 mb-6">
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-48">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                placeholder="Search issues, categories, locations..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-field pl-9"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn-secondary text-sm px-4 py-2.5 ${showFilters ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' : ''}`}
            >
              <Filter size={16} /> Filters {showFilters && <ChevronDown size={14} className="rotate-180" />}
            </button>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="input-field w-auto text-sm">
              <option value="newest">Newest First</option>
              <option value="votes">Most Votes</option>
              <option value="severity">By Severity</option>
            </select>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 md:grid-cols-3 gap-3"
            >
              <div>
                <label className="text-slate-400 text-xs mb-1.5 block">Status</label>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-field text-sm">
                  <option value="all">All Status</option>
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1.5 block">Category</label>
                <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="input-field text-sm">
                  <option value="all">All Categories</option>
                  {categories.map(c => <option key={c} value={c}>{getCategoryIcon(c)} {c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1.5 block">Severity</label>
                <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value)} className="input-field text-sm">
                  <option value="all">All Severities</option>
                  {severities.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </motion.div>
          )}
        </div>

        {/* Quick status filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: 'all', label: 'All' },
            { key: 'Reported', label: '🔴 Reported' },
            { key: 'Verified', label: '🔵 Verified' },
            { key: 'In Progress', label: '🟡 In Progress' },
            { key: 'Completed', label: '🟢 Resolved' },
          ].map(s => (
            <button
              key={s.key}
              onClick={() => setStatusFilter(s.key)}
              className={`text-sm px-4 py-1.5 rounded-full border transition-all ${
                statusFilter === s.key
                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                  : 'text-slate-400 border-dark-700 hover:border-dark-600 hover:text-white'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Issues Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-white font-semibold text-lg mb-2">No issues found</p>
            <p className="text-slate-400 text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((issue, i) => (
              <motion.div
                key={issue.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.5) }}
              >
                <Link href={`/issues/${issue.id}`} className="glass-card block overflow-hidden group h-full">
                  {/* Image */}
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={issue.images[0]}
                      alt={issue.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent" />
                    <div className="absolute top-2 left-2 right-2 flex items-start justify-between">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg border ${getSeverityColor(issue.severity as IssueSeverity)}`}>
                        {issue.severity}
                      </span>
                      {issue.duplicateCount > 0 && (
                        <span className="text-xs glass px-2 py-0.5 rounded-lg text-blue-300">
                          +{issue.duplicateCount} similar
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between">
                      <span className="text-xs text-white font-medium">{issue.id}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-lg ${getStatusBadge(issue.status as IssueStatus)}`}>
                        {issue.status}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-base">{getCategoryIcon(issue.category as IssueCategory)}</span>
                      <span className="text-blue-400 text-xs font-medium">{issue.category}</span>
                    </div>
                    <h3 className="text-white font-semibold text-sm line-clamp-2 mb-3">{issue.title}</h3>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1"><MapPin size={11} />{issue.location.area}</div>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-0.5"><ThumbsUp size={11} />{issue.votes}</span>
                        <span className="flex items-center gap-0.5"><Eye size={11} />{issue.verifications}</span>
                        <span>{timeAgo(issue.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Footer />
      <ChatWidget />
    </main>
  );
}
