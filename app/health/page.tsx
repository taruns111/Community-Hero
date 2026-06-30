'use client';
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ChatWidget from '@/components/chat/ChatWidget';
import { mockLocalityHealth, LocalityHealth } from '@/lib/mockData';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Filter, Info } from 'lucide-react';

function HealthRing({ score, size = 80 }: { score: number; size?: number }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#eab308' : score >= 40 ? '#f97316' : '#ef4444';

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={10} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="score-ring transition-all duration-1000"
          style={{ transformOrigin: 'center' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white font-black text-base">{score}</span>
      </div>
    </div>
  );
}

function TrendIcon({ trend }: { trend: 'up' | 'down' | 'stable' }) {
  if (trend === 'up') return <TrendingUp size={16} className="text-green-400" />;
  if (trend === 'down') return <TrendingDown size={16} className="text-red-400" />;
  return <Minus size={16} className="text-slate-400" />;
}

const scoreLabel = (score: number) => {
  if (score >= 80) return { label: 'Excellent', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' };
  if (score >= 60) return { label: 'Good', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' };
  if (score >= 40) return { label: 'Fair', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' };
  return { label: 'Poor', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' };
};

export default function HealthPage() {
  const [sortBy, setSortBy] = useState<'score' | 'name'>('score');
  const [filter, setFilter] = useState<'all' | 'excellent' | 'good' | 'poor'>('all');

  const sorted = [...mockLocalityHealth]
    .filter(l => {
      if (filter === 'excellent') return l.score >= 80;
      if (filter === 'good') return l.score >= 60 && l.score < 80;
      if (filter === 'poor') return l.score < 60;
      return true;
    })
    .sort((a, b) => sortBy === 'score' ? b.score - a.score : a.name.localeCompare(b.name));

  const avgScore = Math.round(mockLocalityHealth.reduce((s, l) => s + l.score, 0) / mockLocalityHealth.length);

  return (
    <main className="min-h-screen bg-dark-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-black text-white mb-2">
            Community <span className="gradient-text">Health Score</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            AI-generated health scores for each locality based on pending issues, resolution speed, cleanliness, citizen participation, and safety.
          </p>
        </div>

        {/* City Overall Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 mb-8 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-violet-600/5 to-blue-600/5" />
          <div className="relative z-10">
            <p className="text-slate-400 text-sm mb-4">Mumbai City Overall Health Score</p>
            <div className="flex items-center justify-center gap-6">
              <HealthRing score={avgScore} size={120} />
              <div className="text-left">
                <div className="text-5xl font-display font-black gradient-text mb-1">{avgScore}/100</div>
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-sm font-semibold ${scoreLabel(avgScore).bg} ${scoreLabel(avgScore).color}`}>
                  {scoreLabel(avgScore).label} Health
                </div>
                <p className="text-slate-400 text-sm mt-2">Based on {mockLocalityHealth.length} localities</p>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-4 mt-6 text-center">
              {[
                { label: 'Pending Issues', value: 'Moderate', color: 'text-yellow-400' },
                { label: 'Resolution Speed', value: 'Good', color: 'text-green-400' },
                { label: 'Cleanliness', value: 'Good', color: 'text-green-400' },
                { label: 'Participation', value: 'High', color: 'text-blue-400' },
                { label: 'Safety Index', value: 'Good', color: 'text-green-400' },
              ].map((f, i) => (
                <div key={i}>
                  <p className={`text-sm font-bold ${f.color}`}>{f.value}</p>
                  <p className="text-slate-500 text-xs">{f.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="flex gap-1 bg-dark-900 p-1 rounded-xl">
            {[['all', 'All'], ['excellent', '🟢 Excellent'], ['good', '🟡 Good'], ['poor', '🔴 Poor']].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilter(key as typeof filter)}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === key ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                {label}
              </button>
            ))}
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)} className="input-field w-auto text-sm">
            <option value="score">Sort by Score</option>
            <option value="name">Sort by Name</option>
          </select>
          <div className="flex items-center gap-2 text-slate-400 text-sm ml-auto">
            <Info size={14} /> Scores update daily
          </div>
        </div>

        {/* Locality Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sorted.map((locality, i) => {
            const sl = scoreLabel(locality.score);
            return (
              <motion.div
                key={locality.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-white font-bold">{locality.name}</h3>
                    <p className="text-slate-500 text-xs mt-0.5">{locality.ward}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <TrendIcon trend={locality.trend} />
                    <HealthRing score={locality.score} size={56} />
                  </div>
                </div>

                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold mb-4 ${sl.bg} ${sl.color}`}>
                  {sl.label}
                </div>

                {/* Breakdown */}
                <div className="space-y-2">
                  {[
                    { label: 'Resolution', value: locality.resolutionSpeed, color: '#3b82f6' },
                    { label: 'Cleanliness', value: locality.cleanlinessScore, color: '#22c55e' },
                    { label: 'Participation', value: locality.participationScore, color: '#f97316' },
                    { label: 'Safety', value: locality.safetyScore, color: '#8b5cf6' },
                  ].map((metric, j) => (
                    <div key={j}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">{metric.label}</span>
                        <span className="text-white font-medium">{metric.value}</span>
                      </div>
                      <div className="h-1.5 bg-dark-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${metric.value}%` }}
                          transition={{ duration: 1, delay: i * 0.05 + j * 0.1 }}
                          className="h-full rounded-full"
                          style={{ background: metric.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 pt-3 border-t border-white/5 text-xs text-slate-500">
                  {locality.pendingIssues} pending issues
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      <Footer />
      <ChatWidget />
    </main>
  );
}
