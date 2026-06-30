'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ChatWidget from '@/components/chat/ChatWidget';
import {
  Camera, MapPin, BarChart3, Shield, Zap, Users, CheckCircle,
  Star, ChevronDown, ArrowRight, Cpu, Globe, Award, TrendingUp,
  AlertTriangle, Clock, ThumbsUp
} from 'lucide-react';
import { mockIssues, categoryDistribution } from '@/lib/mockData';

// Animated counter hook
function useCounter(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end, duration]);

  return { count, ref };
}

function StatCounter({ value, suffix = '', label, prefix = '' }: { value: number; suffix?: string; label: string; prefix?: string }) {
  const { count, ref } = useCounter(value);
  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-display font-black gradient-text mb-2">
        {prefix}<span ref={ref}>{count.toLocaleString()}</span>{suffix}
      </div>
      <p className="text-slate-400 text-sm font-medium">{label}</p>
    </div>
  );
}

const features = [
  {
    icon: <Cpu size={24} />,
    color: 'from-blue-500 to-blue-600',
    glow: 'glow-blue',
    title: 'AI-Powered Analysis',
    description: 'Google Gemini Vision automatically categorizes issues, assigns severity, and suggests the responsible department the moment you upload a photo.',
  },
  {
    icon: <MapPin size={24} />,
    color: 'from-green-500 to-emerald-600',
    glow: 'glow-green',
    title: 'Interactive Geo-Mapping',
    description: 'Every issue is pinned on an interactive OpenStreetMap with color-coded markers. View pending, in-progress, and resolved issues around you.',
  },
  {
    icon: <Shield size={24} />,
    color: 'from-violet-500 to-purple-600',
    glow: '',
    title: 'Community Verification',
    description: 'Nearby citizens can confirm or reject reports. Once enough verifications are received, reports are auto-escalated to authorities.',
  },
  {
    icon: <AlertTriangle size={24} />,
    color: 'from-orange-500 to-amber-500',
    glow: 'glow-orange',
    title: 'Fake Report Detection',
    description: 'AI assigns an authenticity score to every report, detecting spam, edited images, wrong locations, and fake complaints with 95%+ accuracy.',
  },
  {
    icon: <BarChart3 size={24} />,
    color: 'from-pink-500 to-rose-500',
    glow: '',
    title: 'Real-Time Analytics',
    description: 'Live dashboards track resolution trends, department performance, ward-wise issues, and predictive hotspot analysis for smarter governance.',
  },
  {
    icon: <Award size={24} />,
    color: 'from-yellow-500 to-orange-500',
    glow: 'glow-orange',
    title: 'Gamification & Rewards',
    description: 'Earn points and unlock badges for reporting, verifying, and commenting. Compete on city leaderboards and become a Community Hero.',
  },
];

const steps = [
  {
    step: '01',
    icon: <Camera size={28} />,
    title: 'Capture & Upload',
    description: 'Take a photo or video of the issue. Our AI instantly analyzes and categorizes it.',
    color: 'text-blue-400',
    bg: 'from-blue-500/20 to-blue-600/10',
  },
  {
    step: '02',
    icon: <MapPin size={28} />,
    title: 'Pin Your Location',
    description: 'GPS auto-locates you. Pin the exact issue location on our interactive map.',
    color: 'text-green-400',
    bg: 'from-green-500/20 to-green-600/10',
  },
  {
    step: '03',
    icon: <CheckCircle size={28} />,
    title: 'Track & Resolve',
    description: 'Follow real-time progress as authorities are notified and your issue gets resolved.',
    color: 'text-orange-400',
    bg: 'from-orange-500/20 to-orange-600/10',
  },
];

const testimonials = [
  { name: 'Rahul Sharma', role: 'Community Leader, Andheri', avatar: 'https://randomuser.me/api/portraits/men/1.jpg', text: 'CivicAI is incredible! I reported a pothole and it was fixed in 2 days. The AI analysis is spot-on and the progress tracking kept me updated every step of the way.', rating: 5 },
  { name: 'Sunita Patel', role: 'Teacher, Malad', avatar: 'https://randomuser.me/api/portraits/women/4.jpg', text: 'The garbage bin near our school was overflowing for weeks. One report on CivicAI, and the municipality responded within 24 hours. This platform is a game-changer!', rating: 5 },
  { name: 'Arjun Das', role: 'Software Engineer, Bandra', avatar: 'https://randomuser.me/api/portraits/men/6.jpg', text: 'As someone who cares about civic issues, CivicAI gives me the power to actually do something. The gamification keeps me engaged and the maps are beautiful.', rating: 5 },
];

const faqs = [
  { q: 'Is CivicAI free to use?', a: 'Yes, CivicAI is completely free for citizens. Sign up and start reporting issues in your community today.' },
  { q: 'Which cities are supported?', a: 'Currently active in Mumbai, with expansion to Delhi, Bangalore, Chennai, and Pune planned for Q3 2026.' },
  { q: 'How does AI analyze my report?', a: 'We use Google Gemini Vision to analyze uploaded images. It detects the issue type, severity, affected infrastructure, and suggests the responsible department — all in seconds.' },
  { q: 'How long does it take for issues to be resolved?', a: 'Resolution time varies by severity. Critical issues (burst pipes, dangerous potholes) are typically addressed within 4-24 hours. Standard issues average 3.2 days based on platform data.' },
  { q: 'Can I verify issues reported by others?', a: 'Yes! You can confirm or reject any issue in your area, upload additional photos, and add comments. Community verification speeds up the resolution process.' },
  { q: 'How do I earn badges and points?', a: 'Report issues (+50 pts), verify reports (+20 pts), leave helpful comments (+10 pts), and earn bonus points when your reported issues are resolved. Unlock special badges as you level up.' },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const resolvedCount = mockIssues.filter(i => i.status === 'Completed').length;

  return (
    <main className="min-h-screen bg-dark-950">
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-hero">
        {/* Background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute top-1/2 -left-40 w-80 h-80 bg-violet-600/15 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl" />
          {/* Grid */}
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(59,130,246,0.08) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm font-medium text-blue-300 mb-6"
            >
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              🚀 AI-Powered Smart City Platform
            </motion.div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6">
              <span className="text-white">Fix Your City</span>
              <br />
              <span className="gradient-text">with AI Power</span>
            </h1>

            <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-lg">
              Report potholes, garbage, water leaks, and more in seconds. AI analyzes your report instantly. 
              Track real-time progress until your community issue is resolved.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <Link href="/report" className="btn-primary text-base px-8 py-4">
                <Camera size={20} />
                Report an Issue
              </Link>
              <Link href="/map" className="btn-secondary text-base px-8 py-4">
                <MapPin size={20} />
                View Issues Map
              </Link>
            </div>

            {/* Quick stats */}
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle size={16} className="text-green-400" />
                <span>{resolvedCount}+ issues resolved</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users size={16} className="text-blue-400" />
                <span>12,450+ active citizens</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={16} className="text-orange-400" />
                <span>Avg 3.2 day resolution</span>
              </div>
            </div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative w-full max-w-md animate-float">
              {/* Main phone card */}
              <div className="glass-card p-6 rounded-3xl relative">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-xl">⚡</div>
                  <div>
                    <p className="text-white font-semibold text-sm">CivicAI Analysis</p>
                    <p className="text-green-400 text-xs">✓ Issue Detected</p>
                  </div>
                </div>
                <div className="bg-dark-900/80 rounded-xl p-4 mb-4 border border-white/5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">🕳️</span>
                    <div>
                      <p className="text-white font-semibold text-sm">Pothole Detected</p>
                      <p className="text-slate-400 text-xs">MG Road, Andheri West</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                      <p className="text-red-400 text-xs font-medium">Severity</p>
                      <p className="text-white font-bold text-sm">Critical</p>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                      <p className="text-blue-400 text-xs font-medium">Department</p>
                      <p className="text-white font-bold text-sm">Roads</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                      <p className="text-green-400 text-xs font-medium">Authenticity</p>
                      <p className="text-white font-bold text-sm">96%</p>
                    </div>
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                      <p className="text-orange-400 text-xs font-medium">Resolution</p>
                      <p className="text-white font-bold text-sm">2-3 days</p>
                    </div>
                  </div>
                </div>
                <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: '75%' }}
                    transition={{ delay: 1, duration: 1.5, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full"
                  />
                </div>
                <p className="text-slate-400 text-xs mt-1.5">AI Confidence: 96% • Processing complete</p>
              </div>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }}
                className="absolute -right-8 top-4 glass rounded-xl px-3 py-2 flex items-center gap-2 shadow-lg"
              >
                <span className="text-yellow-400 text-base">🏆</span>
                <div><p className="text-white text-xs font-bold">+50 Points</p><p className="text-slate-400 text-xs">Issue reported!</p></div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }} transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
                className="absolute -left-8 bottom-8 glass rounded-xl px-3 py-2 flex items-center gap-2 shadow-lg"
              >
                <span className="text-green-400 text-base">✅</span>
                <div><p className="text-white text-xs font-bold">Verified!</p><p className="text-slate-400 text-xs">47 citizens confirmed</p></div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500">
          <p className="text-xs">Scroll to explore</p>
          <ChevronDown size={20} className="animate-bounce" />
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="py-20 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCounter value={12450} suffix="+" label="Active Citizens" />
            <StatCounter value={1247} suffix="+" label="Issues Reported" />
            <StatCounter value={89} suffix="%" label="Resolution Rate" />
            <StatCounter value={3} suffix=".2d" label="Avg Resolution Time" />
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="text-center mb-16"
        >
          <span className="text-blue-400 text-sm font-semibold tracking-wider uppercase">Simple Process</span>
          <h2 className="text-4xl md:text-5xl font-display font-black text-white mt-2 mb-4">
            How <span className="gradient-text">CivicAI</span> Works
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">Three simple steps to transform your community</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="absolute top-16 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500/30 to-blue-500/0 hidden md:block" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.2 }}
              className="glass-card p-8 text-center relative"
            >
              <div className="absolute top-4 right-4 text-6xl font-black text-white/5">{step.step}</div>
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.bg} flex items-center justify-center mx-auto mb-6 ${step.color}`}>
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-24 bg-dark-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="text-center mb-16"
          >
            <span className="text-orange-400 text-sm font-semibold tracking-wider uppercase">Powerful Features</span>
            <h2 className="text-4xl md:text-5xl font-display font-black text-white mt-2 mb-4">
              Everything You <span className="gradient-text-orange">Need</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              A complete ecosystem for civic issue management powered by artificial intelligence
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="glass-card p-6 group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== RECENT ISSUES PREVIEW ===== */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-10">
          <div>
            <span className="text-green-400 text-sm font-semibold tracking-wider uppercase">Live Feed</span>
            <h2 className="text-3xl font-display font-black text-white mt-1">Recent Community Reports</h2>
          </div>
          <Link href="/issues" className="btn-secondary text-sm px-4 py-2">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {mockIssues.slice(0, 3).map((issue, i) => (
            <motion.div
              key={issue.id}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            >
              <Link href={`/issues/${issue.id}`} className="glass-card block overflow-hidden group">
                <div className="relative h-44 overflow-hidden rounded-t-2xl">
                  <img
                    src={issue.images[0]}
                    alt={issue.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-lg border ${
                      issue.severity === 'Critical' ? 'bg-red-500/30 text-red-300 border-red-500/40' :
                      issue.severity === 'High' ? 'bg-orange-500/30 text-orange-300 border-orange-500/40' :
                      'bg-yellow-500/30 text-yellow-300 border-yellow-500/40'
                    }`}>
                      {issue.severity}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 glass text-xs px-2 py-1 rounded-lg text-white font-medium">
                    #{issue.id}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{['🕳️', '🗑️', '💡'][i]}</span>
                    <span className="text-blue-400 text-xs font-medium">{issue.category}</span>
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2">{issue.title}</h3>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1"><MapPin size={12} />{issue.location.area}</div>
                    <div className="flex items-center gap-1"><ThumbsUp size={12} />{issue.votes}</div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-24 bg-dark-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="text-center mb-16"
          >
            <span className="text-violet-400 text-sm font-semibold tracking-wider uppercase">Community Voices</span>
            <h2 className="text-4xl font-display font-black text-white mt-2">What Citizens Say</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="glass-card p-6"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={16} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-5 italic">&quot;{t.text}&quot;</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-slate-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-24 max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="text-center mb-12"
        >
          <h2 className="text-4xl font-display font-black text-white">Frequently Asked <span className="gradient-text">Questions</span></h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="glass-card overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="text-white font-medium text-sm">{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-slate-400 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                />
              </button>
              {openFaq === i && (
                <motion.div
                  initial={{ height: 0 }} animate={{ height: 'auto' }}
                  className="px-5 pb-5"
                >
                  <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600" />
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          <div className="relative z-10 text-center py-20 px-8">
            <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-4">
              Ready to Be a Community Hero?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Join 12,450+ citizens already making their communities better. Every report matters.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/auth/register" className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-base hover:bg-blue-50 transition-all hover:-translate-y-0.5 shadow-xl">
                Start Reporting for Free
              </Link>
              <Link href="/issues" className="px-8 py-4 bg-white/20 text-white rounded-xl font-bold text-base border border-white/30 hover:bg-white/30 transition-all hover:-translate-y-0.5">
                Explore Issues
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
      <ChatWidget />
    </main>
  );
}
