'use client';
import { useParams, notFound } from 'next/navigation';
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ChatWidget from '@/components/chat/ChatWidget';
import { useApp } from '@/lib/store';
import { getCategoryIcon, getSeverityColor, IssueCategory, IssueSeverity, IssueStatus } from '@/lib/mockData';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Link from 'next/link';
import {
  MapPin, ThumbsUp, ThumbsDown, MessageSquare, Share2, Flag,
  CheckCircle, Clock, Shield, Cpu, Building, Users, AlertTriangle,
  ChevronRight, Heart, Eye, Copy, ExternalLink
} from 'lucide-react';

const statusSteps: IssueStatus[] = ['Reported', 'Verified', 'Assigned', 'In Progress', 'Completed'];

export default function IssueDetailPage() {
  const params = useParams();
  const { issues, user } = useApp();
  const issue = issues.find(i => i.id === params.id);
  const [voted, setVoted] = useState(false);
  const [verified, setVerified] = useState<'confirm' | 'reject' | null>(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(issue?.comments || []);

  if (!issue) {
    return (
      <main className="min-h-screen bg-dark-950">
        <Navbar />
        <div className="max-w-xl mx-auto px-6 py-20 text-center">
          <p className="text-6xl mb-4">🔍</p>
          <h1 className="text-2xl font-bold text-white mb-2">Issue Not Found</h1>
          <p className="text-slate-400 mb-6">This issue may have been removed or doesn&apos;t exist.</p>
          <Link href="/issues" className="btn-primary">← Back to Issues</Link>
        </div>
      </main>
    );
  }

  const currentStep = statusSteps.indexOf(issue.status as IssueStatus);

  const handleVote = () => {
    if (voted) return;
    setVoted(true);
    toast.success('+20 points earned for verifying!');
  };

  const handleVerify = (type: 'confirm' | 'reject') => {
    setVerified(type);
    toast.success(type === 'confirm' ? '✅ Report confirmed! +20 pts' : 'Report rejected. Thanks for keeping data clean.');
  };

  const handleComment = () => {
    if (!comment.trim()) return;
    const newComment = {
      id: `c-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      text: comment,
      createdAt: new Date().toISOString(),
      helpful: 0,
    };
    setComments(prev => [newComment, ...prev]);
    setComment('');
    toast.success('Comment added! +10 pts');
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
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
          <Link href="/issues" className="hover:text-blue-400 transition-colors">Issues</Link>
          <ChevronRight size={14} />
          <span className="text-white">{issue.id}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden">
              <div className="relative h-72 md:h-96">
                <img src={issue.images[0]} alt={issue.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/60 to-transparent" />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={`text-sm font-semibold px-3 py-1 rounded-xl border ${getSeverityColor(issue.severity as IssueSeverity)}`}>
                    {issue.severity}
                  </span>
                  <span className="text-sm glass px-3 py-1 rounded-xl text-white font-medium">{issue.id}</span>
                </div>
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }} className="glass px-3 py-1.5 rounded-xl text-xs text-white flex items-center gap-1 hover:bg-white/10">
                    <Copy size={12} /> Share
                  </button>
                </div>
              </div>
              {issue.images.length > 1 && (
                <div className="flex gap-2 p-4">
                  {issue.images.map((img, i) => (
                    <img key={i} src={img} alt="" className="w-20 h-16 object-cover rounded-lg border-2 border-dark-700 hover:border-blue-500 cursor-pointer transition-all" />
                  ))}
                </div>
              )}
            </motion.div>

            {/* Issue Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{getCategoryIcon(issue.category as IssueCategory)}</span>
                <span className="text-blue-400 text-sm font-medium">{issue.category}</span>
                <span className="ml-auto text-slate-500 text-sm">{timeAgo(issue.createdAt)}</span>
              </div>
              <h1 className="text-2xl font-display font-bold text-white mb-4">{issue.title}</h1>
              <p className="text-slate-400 leading-relaxed mb-4">{issue.description}</p>

              {/* Duplicate warning */}
              {issue.duplicateCount > 0 && (
                <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl mb-4">
                  <Users size={18} className="text-blue-400 flex-shrink-0" />
                  <p className="text-blue-300 text-sm">
                    This issue has already been reported by <strong>{issue.duplicateCount} citizens</strong>. Your vote adds to the priority count.
                  </p>
                </div>
              )}

              {/* Vote & Actions */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleVote}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    voted ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'glass hover:bg-blue-500/10 text-slate-300'
                  }`}
                >
                  <ThumbsUp size={16} className={voted ? 'fill-blue-400' : ''} />
                  {issue.votes + (voted ? 1 : 0)} Upvotes
                </button>
                <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                  <Eye size={16} /> {issue.verifications} verifications
                </div>
                <button className="glass px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-white flex items-center gap-1.5 ml-auto">
                  <Flag size={14} /> Report
                </button>
              </div>
            </motion.div>

            {/* Status Timeline */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
              <h2 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                <Clock size={18} className="text-blue-400" /> Progress Timeline
              </h2>

              {/* Visual progress */}
              <div className="flex items-center justify-between mb-6 relative">
                <div className="absolute top-4 left-8 right-8 h-0.5 bg-dark-800" />
                <div className="absolute top-4 left-8 h-0.5 bg-gradient-to-r from-green-500 to-blue-500 transition-all" style={{ width: `${(currentStep / (statusSteps.length - 1)) * (100 - 16 / statusSteps.length)}%` }} />
                {statusSteps.map((s, i) => (
                  <div key={i} className="relative z-10 flex flex-col items-center gap-1.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      i < currentStep ? 'bg-green-500 text-white' :
                      i === currentStep ? 'bg-blue-500 text-white ring-4 ring-blue-500/30' :
                      'bg-dark-800 text-slate-500'
                    }`}>
                      {i < currentStep ? <CheckCircle size={14} /> : i + 1}
                    </div>
                    <span className={`text-xs font-medium text-center hidden sm:block ${i <= currentStep ? 'text-white' : 'text-slate-500'}`}>
                      {s}
                    </span>
                  </div>
                ))}
              </div>

              {/* History */}
              <div className="space-y-3">
                {issue.statusHistory.map((h, i) => (
                  <div key={i} className="flex gap-4 relative timeline-item pl-10">
                    <div className="absolute left-0 w-8 h-8 rounded-full bg-dark-800 border border-dark-700 flex items-center justify-center flex-shrink-0">
                      <CheckCircle size={14} className={i === 0 ? 'text-blue-400' : 'text-green-400'} />
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-white text-sm font-semibold">{h.status}</p>
                      {h.note && <p className="text-slate-400 text-xs mt-0.5">{h.note}</p>}
                      <p className="text-slate-500 text-xs mt-1">{timeAgo(h.timestamp)} · by {h.updatedBy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Community Verification */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
              <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <Shield size={18} className="text-green-400" /> Community Verification
              </h2>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 bg-dark-800 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                    style={{ width: `${(issue.verifications / (issue.verifications + issue.rejections + 1)) * 100}%` }}
                  />
                </div>
                <span className="text-green-400 text-sm font-bold">{issue.verifications} ✓</span>
                <span className="text-red-400 text-sm font-bold">{issue.rejections} ✗</span>
              </div>
              {issue.verifications >= 10 && (
                <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-xl mb-4">
                  <CheckCircle size={18} className="text-green-400" />
                  <p className="text-green-300 text-sm font-medium">✓ Verified Community Report</p>
                </div>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => handleVerify('confirm')}
                  disabled={verified !== null}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    verified === 'confirm'
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : verified ? 'opacity-50 cursor-not-allowed glass text-slate-400' : 'bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20'
                  }`}
                >
                  <ThumbsUp size={16} /> Confirm Issue
                </button>
                <button
                  onClick={() => handleVerify('reject')}
                  disabled={verified !== null}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    verified === 'reject'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : verified ? 'opacity-50 cursor-not-allowed glass text-slate-400' : 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                  }`}
                >
                  <ThumbsDown size={16} /> Reject Report
                </button>
              </div>
            </motion.div>

            {/* Comments */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
              <h2 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                <MessageSquare size={18} className="text-orange-400" /> Comments ({comments.length})
              </h2>

              {/* Add comment */}
              <div className="flex gap-3 mb-6">
                <img src={user.avatar} alt="" className="w-9 h-9 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1">
                  <textarea
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="Share what you know about this issue..."
                    rows={2}
                    className="input-field resize-none text-sm mb-2"
                  />
                  <button onClick={handleComment} className="btn-primary text-sm px-4 py-2 ml-auto block">
                    Post Comment
                  </button>
                </div>
              </div>

              {/* Comments list */}
              <div className="space-y-4">
                {comments.map(c => (
                  <div key={c.id} className="flex gap-3">
                    <img src={c.userAvatar} alt="" className="w-8 h-8 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1">
                      <div className="bg-dark-800 rounded-xl p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white text-sm font-semibold">{c.userName}</span>
                          <span className="text-slate-500 text-xs">{timeAgo(c.createdAt)}</span>
                        </div>
                        <p className="text-slate-300 text-sm">{c.text}</p>
                      </div>
                      <button className="text-xs text-slate-500 hover:text-blue-400 mt-1.5 flex items-center gap-1">
                        <Heart size={11} /> {c.helpful} helpful
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* AI Analysis Card */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <Cpu size={16} className="text-blue-400" /> AI Analysis
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Confidence</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-dark-700 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${issue.aiAnalysis.confidence}%` }} />
                    </div>
                    <span className="text-blue-400 text-sm font-bold">{issue.aiAnalysis.confidence}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Authenticity</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-dark-700 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${issue.authenticityScore}%` }} />
                    </div>
                    <span className="text-green-400 text-sm font-bold">{issue.authenticityScore}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Spam Risk</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-dark-700 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 rounded-full" style={{ width: `${issue.spamProbability}%` }} />
                    </div>
                    <span className="text-orange-400 text-sm font-bold">{issue.spamProbability}%</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-white/5">
                  <p className="text-slate-400 text-xs mb-1.5">Detected Objects</p>
                  <div className="flex flex-wrap gap-1.5">
                    {issue.aiAnalysis.detectedObjects.map((obj, i) => (
                      <span key={i} className="text-xs bg-dark-800 text-slate-300 px-2 py-1 rounded-lg">{obj}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Details Card */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5 space-y-4">
              <h3 className="text-white font-bold">Issue Details</h3>
              <div className="space-y-3">
                {[
                  { icon: <AlertTriangle size={15} className="text-orange-400" />, label: 'Severity', value: issue.severity },
                  { icon: <Clock size={15} className="text-blue-400" />, label: 'Est. Resolution', value: issue.estimatedResolution },
                  { icon: <Building size={15} className="text-violet-400" />, label: 'Department', value: issue.department },
                  { icon: <MapPin size={15} className="text-green-400" />, label: 'Location', value: issue.location.area },
                  { icon: <Users size={15} className="text-yellow-400" />, label: 'Ward', value: issue.location.ward },
                ].map((row, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {row.icon}
                    <span className="text-slate-400 text-sm flex-1">{row.label}</span>
                    <span className="text-white text-sm font-medium">{row.value}</span>
                  </div>
                ))}
                {issue.assignedTo && (
                  <div className="flex items-center gap-3">
                    <CheckCircle size={15} className="text-green-400" />
                    <span className="text-slate-400 text-sm flex-1">Assigned To</span>
                    <span className="text-green-400 text-sm font-medium">{issue.assignedTo}</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Reporter */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5">
              <h3 className="text-white font-bold mb-4">Reported By</h3>
              <div className="flex items-center gap-3">
                <img src={issue.reportedByAvatar} alt="" className="w-10 h-10 rounded-xl object-cover" />
                <div>
                  <p className="text-white font-semibold text-sm">{issue.reportedByName}</p>
                  <p className="text-slate-400 text-xs">{timeAgo(issue.createdAt)}</p>
                </div>
              </div>
            </motion.div>

            {/* Map preview */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="glass-card p-4">
              <h3 className="text-white font-bold mb-3">Location</h3>
              <div className="bg-dark-800 rounded-xl overflow-hidden h-32 flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={28} className="text-blue-400 mx-auto mb-2" />
                  <p className="text-white text-sm font-medium">{issue.location.area}</p>
                  <p className="text-slate-400 text-xs">{issue.location.lat.toFixed(4)}, {issue.location.lng.toFixed(4)}</p>
                </div>
              </div>
              <Link href="/map" className="flex items-center justify-center gap-2 mt-3 text-blue-400 text-sm hover:text-blue-300 transition-colors">
                <ExternalLink size={14} /> View on Map
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
      <ChatWidget />
    </main>
  );
}
