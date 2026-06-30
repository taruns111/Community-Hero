import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import { FaGithub, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-dark-950 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-sm font-bold">⚡</div>
              <span className="font-display font-bold text-lg"><span className="gradient-text">Civic</span><span className="text-white">AI</span></span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              AI-powered civic engagement platform empowering citizens to build better communities through technology.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="#" className="w-8 h-8 glass rounded-lg flex items-center justify-center text-slate-400 hover:text-blue-400 transition-colors"><FaTwitter size={14} /></a>
              <a href="#" className="w-8 h-8 glass rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors"><FaGithub size={14} /></a>
              <a href="#" className="w-8 h-8 glass rounded-lg flex items-center justify-center text-slate-400 hover:text-orange-400 transition-colors"><Mail size={14} /></a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Platform</h4>
            <ul className="space-y-2.5">
              {[['Report Issue', '/report'], ['View Map', '/map'], ['Browse Issues', '/issues'], ['Leaderboard', '/leaderboard'], ['Health Scores', '/health']].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-slate-400 hover:text-blue-400 text-sm transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Dashboards */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Dashboards</h4>
            <ul className="space-y-2.5">
              {[['Citizen Dashboard', '/dashboard/citizen'], ['Government Dashboard', '/dashboard/government'], ['Analytics', '/dashboard/analytics'], ['Admin Panel', '/admin']].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-slate-400 hover:text-blue-400 text-sm transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-slate-400 text-sm">
                <MapPin size={14} className="text-blue-400 flex-shrink-0" />
                Mumbai, Maharashtra, India
              </li>
              <li className="flex items-center gap-2 text-slate-400 text-sm">
                <Phone size={14} className="text-green-400 flex-shrink-0" />
                +91 1800-CIVICAI
              </li>
              <li className="flex items-center gap-2 text-slate-400 text-sm">
                <Mail size={14} className="text-orange-400 flex-shrink-0" />
                support@civicai.in
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs">© 2026 CivicAI. Built with ❤️ for better communities.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">Terms of Service</Link>
            <Link href="#" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
