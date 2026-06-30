'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { FaGoogle } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    toast.success('Welcome back! Redirecting...');
    window.location.href = '/dashboard/citizen';
  };

  const handleDemo = () => {
    setEmail('rahul@example.com');
    setPassword('demo1234');
    toast('Demo credentials filled! Click Sign In.', { icon: '💡' });
  };

  return (
    <main className="min-h-screen bg-dark-950">
      <Navbar />
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-8 items-center">
          {/* Left — Illustration */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-violet-600/20 rounded-3xl blur-2xl" />
              <div className="relative glass-card p-8">
                <div className="text-5xl mb-4">⚡</div>
                <h2 className="text-3xl font-display font-black text-white mb-3">
                  Welcome Back,<br />
                  <span className="gradient-text">Community Hero</span>
                </h2>
                <p className="text-slate-400 mb-8">Sign in to report issues, track progress, and earn rewards for making your city better.</p>
                <div className="space-y-3">
                  {[
                    { icon: '📸', text: 'Report civic issues with AI analysis' },
                    { icon: '🗺️', text: 'Track issues on real-time maps' },
                    { icon: '🏆', text: 'Earn points and unlock badges' },
                    { icon: '📊', text: 'Monitor city health scores' },
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                      <span className="text-xl">{f.icon}</span>
                      {f.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="glass-card p-8">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-display font-black text-white mb-1">Sign In</h1>
                <p className="text-slate-400 text-sm">Don&apos;t have an account? <Link href="/auth/register" className="text-blue-400 hover:text-blue-300 font-medium">Sign up free</Link></p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-slate-300 text-sm font-medium mb-1.5 block">Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="input-field pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-slate-300 text-sm font-medium">Password</label>
                    <a href="#" className="text-blue-400 text-xs hover:text-blue-300">Forgot password?</a>
                  </div>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="input-field pl-10 pr-10"
                      required
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 text-base">
                  {loading ? <Loader2 size={18} className="animate-spin" /> : null}
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-dark-700" />
                <span className="text-slate-500 text-xs">or continue with</span>
                <div className="flex-1 h-px bg-dark-700" />
              </div>

              <div className="flex gap-3">
                <button className="flex-1 btn-secondary justify-center gap-2 text-sm py-2.5">
                  <FaGoogle size={16} className="text-blue-400" /> Google
                </button>
                <button onClick={handleDemo} className="flex-1 btn-secondary justify-center gap-2 text-sm py-2.5">
                  🎭 Demo Login
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
