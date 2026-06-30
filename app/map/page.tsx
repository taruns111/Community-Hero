'use client';
import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/layout/Navbar';
import { useApp } from '@/lib/store';
import { IssueStatus, IssueCategory, IssueSeverity, getCategoryIcon, getSeverityColor } from '@/lib/mockData';
import Link from 'next/link';
import { Filter, MapPin, ThumbsUp, Clock, X, List, Map as MapIcon } from 'lucide-react';

const IssueMap = dynamic(() => import('@/components/map/IssueMap'), { ssr: false, loading: () => <div className="flex-1 bg-dark-900 animate-pulse rounded-xl" /> });

export default function MapPage() {
  const { issues } = useApp();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [showList, setShowList] = useState(false);

  const categories: IssueCategory[] = ['Pothole', 'Garbage', 'Water Leakage', 'Street Light', 'Drainage', 'Road Damage', 'Illegal Dumping', 'Fallen Tree', 'Traffic Signal', 'Sewage'];

  const filtered = useMemo(() => issues.filter(i => {
    if (selectedStatus !== 'all' && i.status !== selectedStatus) return false;
    if (selectedCategory !== 'all' && i.category !== selectedCategory) return false;
    return true;
  }), [issues, selectedStatus, selectedCategory]);

  const selected = selectedIssue ? issues.find(i => i.id === selectedIssue) : null;

  const statusCounts = {
    all: issues.length,
    Reported: issues.filter(i => i.status === 'Reported').length,
    'In Progress': issues.filter(i => i.status === 'In Progress').length,
    Completed: issues.filter(i => i.status === 'Completed').length,
  };

  return (
    <main className="h-screen flex flex-col bg-dark-950 overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className={`${showList ? 'w-full sm:w-80' : 'hidden sm:flex'} flex-col bg-dark-900 border-r border-white/5 overflow-hidden`}>
          {/* Filters */}
          <div className="p-4 border-b border-white/5 flex-shrink-0">
            <div className="flex items-center gap-2 mb-3">
              <Filter size={16} className="text-blue-400" />
              <h2 className="text-white font-semibold text-sm">Filter Issues</h2>
              <span className="ml-auto text-xs text-slate-400">{filtered.length} shown</span>
            </div>

            {/* Status filter */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {[
                { key: 'all', label: 'All', color: 'bg-slate-700' },
                { key: 'Reported', label: '🔴 Pending', color: 'bg-red-500/20 border-red-500/30' },
                { key: 'In Progress', label: '🟡 Active', color: 'bg-yellow-500/20 border-yellow-500/30' },
                { key: 'Completed', label: '🟢 Done', color: 'bg-green-500/20 border-green-500/30' },
              ].map(s => (
                <button
                  key={s.key}
                  onClick={() => setSelectedStatus(s.key)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                    selectedStatus === s.key
                      ? `${s.color} text-white border-current`
                      : 'text-slate-400 border-dark-700 hover:border-dark-600'
                  }`}
                >
                  {s.label} ({statusCounts[s.key as keyof typeof statusCounts] ?? 0})
                </button>
              ))}
            </div>

            {/* Category filter */}
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="input-field text-sm py-2"
            >
              <option value="all">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{getCategoryIcon(c)} {c}</option>)}
            </select>
          </div>

          {/* Issue List */}
          <div className="flex-1 overflow-y-auto">
            {filtered.slice(0, 30).map(issue => (
              <div
                key={issue.id}
                onClick={() => { setSelectedIssue(issue.id); setShowList(false); }}
                className={`p-4 border-b border-white/5 cursor-pointer transition-all hover:bg-white/5 ${selectedIssue === issue.id ? 'bg-blue-500/10 border-l-2 border-l-blue-500' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-1 ${
                    issue.status === 'Completed' ? 'bg-green-400' :
                    issue.status === 'In Progress' || issue.status === 'Assigned' ? 'bg-yellow-400' :
                    'bg-red-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-medium line-clamp-2">{issue.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-slate-500 text-xs">{issue.location.area}</span>
                      <span className="text-slate-600 text-xs">•</span>
                      <span className="text-slate-500 text-xs flex items-center gap-1"><ThumbsUp size={10} />{issue.votes}</span>
                    </div>
                    <span className={`text-xs px-1.5 py-0.5 rounded mt-1 inline-block ${getSeverityColor(issue.severity as IssueSeverity)}`}>
                      {issue.severity}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          {/* Mobile toggle */}
          <button
            onClick={() => setShowList(!showList)}
            className="sm:hidden absolute top-4 left-4 z-[500] glass px-3 py-2 rounded-xl flex items-center gap-2 text-sm text-white"
          >
            {showList ? <MapIcon size={16} /> : <List size={16} />}
            {showList ? 'Map' : 'List'}
          </button>

          {!showList && (
            <IssueMap
              issues={filtered}
              selectedId={selectedIssue}
              onSelect={setSelectedIssue}
            />
          )}

          {/* Selected Issue Popup */}
          {selected && !showList && (
            <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-[500]">
              <div className="glass-card p-4 shadow-2xl">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getCategoryIcon(selected.category as IssueCategory)}</span>
                    <span className="text-blue-400 text-xs font-medium">{selected.category}</span>
                  </div>
                  <button onClick={() => setSelectedIssue(null)} className="text-slate-400 hover:text-white">
                    <X size={16} />
                  </button>
                </div>
                <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2">{selected.title}</h3>
                <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                  <span className="flex items-center gap-1"><MapPin size={12} />{selected.location.area}</span>
                  <span className="flex items-center gap-1"><ThumbsUp size={12} />{selected.votes}</span>
                  <span className="flex items-center gap-1"><Clock size={12} />{selected.estimatedResolution}</span>
                </div>
                <div className="flex gap-2">
                  <span className={`text-xs px-2 py-1 rounded-lg border ${getSeverityColor(selected.severity as IssueSeverity)}`}>
                    {selected.severity}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-lg ${
                    selected.status === 'Completed' ? 'badge-completed' :
                    selected.status === 'In Progress' ? 'badge-progress' :
                    selected.status === 'Assigned' ? 'badge-assigned' :
                    selected.status === 'Verified' ? 'badge-verified' : 'badge-reported'
                  }`}>
                    {selected.status}
                  </span>
                  <Link href={`/issues/${selected.id}`} className="ml-auto text-xs text-blue-400 hover:text-blue-300 font-medium">
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Legend */}
          {!showList && (
            <div className="absolute top-4 right-4 z-[500] glass rounded-xl p-3">
              <p className="text-white text-xs font-semibold mb-2">Map Legend</p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-slate-400"><span className="w-3 h-3 rounded-full bg-red-400" /> Reported / Pending</div>
                <div className="flex items-center gap-2 text-xs text-slate-400"><span className="w-3 h-3 rounded-full bg-yellow-400" /> In Progress</div>
                <div className="flex items-center gap-2 text-xs text-slate-400"><span className="w-3 h-3 rounded-full bg-green-400" /> Completed</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
