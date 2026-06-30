'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/store';
import {
  Bell, Moon, Sun, Menu, X, Map, BarChart3, Users,
  Plus, ChevronDown, LogOut, Settings, User, Shield,
  Activity, Home, Trophy, Heart
} from 'lucide-react';

export default function Navbar() {
  const { user, notifications, unreadCount, darkMode, toggleDarkMode, markAllNotificationsRead } = useApp();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home', icon: <Home size={16} /> },
    { href: '/issues', label: 'Issues', icon: <Activity size={16} /> },
    { href: '/map', label: 'Map', icon: <Map size={16} /> },
    { href: '/leaderboard', label: 'Leaderboard', icon: <Trophy size={16} /> },
    { href: '/health', label: 'Health Score', icon: <Heart size={16} /> },
  ];

  const dashboardLinks = [
    { href: '/dashboard/citizen', label: 'My Dashboard', icon: <User size={14} /> },
    { href: '/dashboard/government', label: 'Gov Dashboard', icon: <Shield size={14} /> },
    { href: '/dashboard/analytics', label: 'Analytics', icon: <BarChart3 size={14} /> },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <nav className="glass-nav fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-sm font-bold shadow-lg group-hover:scale-110 transition-transform">
                ⚡
              </div>
              <span className="font-display font-bold text-lg">
                <span className="gradient-text">Civic</span>
                <span className="text-white">AI</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive(link.href)
                      ? 'bg-blue-500/15 text-blue-400'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}

              {/* Dashboards Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                  <BarChart3 size={16} />
                  Dashboards
                  <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 glass-card py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  {dashboardLinks.map(link => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              {/* Report Button */}
              <Link
                href="/report"
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl text-sm font-semibold hover:from-blue-500 hover:to-blue-400 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5"
              >
                <Plus size={16} />
                Report Issue
              </Link>

              {/* Dark Mode */}
              <button
                onClick={toggleDarkMode}
                className="w-9 h-9 rounded-xl glass flex items-center justify-center text-slate-400 hover:text-white transition-all hover:bg-white/10"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* Notifications */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                  className="w-9 h-9 rounded-xl glass flex items-center justify-center text-slate-400 hover:text-white transition-all hover:bg-white/10 relative"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white font-bold">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="dropdown"
                    >
                      <div className="flex items-center justify-between p-4 border-b border-white/10">
                        <h3 className="font-semibold text-white">Notifications</h3>
                        <button onClick={markAllNotificationsRead} className="text-xs text-blue-400 hover:text-blue-300">
                          Mark all read
                        </button>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.map(n => (
                          <div key={n.id} className={`flex gap-3 p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-all ${!n.read ? 'bg-blue-500/5' : ''}`}>
                            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!n.read ? 'bg-blue-400' : 'bg-transparent'}`} />
                            <div>
                              <p className="text-sm font-medium text-white">{n.title}</p>
                              <p className="text-xs text-slate-400 mt-0.5">{n.message}</p>
                              <p className="text-xs text-slate-500 mt-1">{n.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl glass hover:bg-white/10 transition-all"
                >
                  <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-lg object-cover" />
                  <span className="hidden sm:block text-sm font-medium text-slate-300">{user.name.split(' ')[0]}</span>
                  <ChevronDown size={14} className="text-slate-500" />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="dropdown"
                    >
                      <div className="p-4 border-b border-white/10">
                        <div className="flex items-center gap-3">
                          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-xl object-cover" />
                          <div>
                            <p className="font-semibold text-white text-sm">{user.name}</p>
                            <p className="text-xs text-slate-400">{user.email}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                                Level {user.level}
                              </span>
                              <span className="text-xs text-yellow-400">⭐ {user.points.toLocaleString()} pts</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <Link href="/dashboard/citizen" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                          <User size={14} /> My Dashboard
                        </Link>
                        <Link href="/admin" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                          <Settings size={14} /> Admin Panel
                        </Link>
                        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                          <LogOut size={14} /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden w-9 h-9 rounded-xl glass flex items-center justify-center text-slate-400 hover:text-white"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/5 bg-dark-950/95 backdrop-blur-xl"
            >
              <div className="p-4 space-y-1">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive(link.href)
                        ? 'bg-blue-500/15 text-blue-400'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.icon} {link.label}
                  </Link>
                ))}
                <div className="pt-2 border-t border-white/5">
                  {dashboardLinks.map(link => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                    >
                      {link.icon} {link.label}
                    </Link>
                  ))}
                </div>
                <Link
                  href="/report"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl text-sm font-semibold mt-2"
                >
                  <Plus size={16} /> Report Issue
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}
