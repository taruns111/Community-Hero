'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2, User, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', ward: '', role: 'citizen' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    toast.success('🎉 Account created! Welcome to CivicAI!');
    window.location.href = '/dashboard/citizen';
  };

  return (
    <main className="min-h-screen bg-dark-950">
      <Navbar />
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8">
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-2xl mx-auto mb-4">⚡</div>
              <h1 className="text-2xl font-display font-black text-white mb-1">Join CivicAI</h1>
              <p className="text-slate-400 text-sm">Already have an account? <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 font-medium">Sign in</Link></p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-slate-300 text-sm font-medium mb-1.5 block">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Rahul Sharma" className="input-field pl-10" required />
                </div>
              </div>
              <div>
                <label className="text-slate-300 text-sm font-medium mb-1.5 block">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" className="input-field pl-10" required />
                </div>
              </div>
              <div>
                <label className="text-slate-300 text-sm font-medium mb-1.5 block">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Min 8 characters" className="input-field pl-10 pr-10" required minLength={8} />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-slate-300 text-sm font-medium mb-1.5 block">Your Ward / Area</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" value={form.ward} onChange={e => setForm({ ...form, ward: e.target.value })} placeholder="e.g. Andheri West, Mumbai" className="input-field pl-10" />
                </div>
              </div>
              <div>
                <label className="text-slate-300 text-sm font-medium mb-1.5 block">Register as</label>
                <div className="grid grid-cols-2 gap-3">
                  {[['citizen', '👤 Citizen'], ['government', '🏛️ Government Officer']].map(([val, label]) => (
                    <button key={val} type="button" onClick={() => setForm({ ...form, role: val })}
                      className={`py-2.5 rounded-xl text-sm font-medium border transition-all ${form.role === val ? 'bg-blue-500/20 text-blue-400 border-blue-500/40' : 'text-slate-400 border-dark-700 hover:border-dark-600'}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-slate-500 text-xs">By signing up, you agree to our Terms of Service and Privacy Policy.</p>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 text-base">
                {loading ? <Loader2 size={18} className="animate-spin" /> : null}
                {loading ? 'Creating Account...' : 'Create Free Account'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
