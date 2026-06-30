'use client';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
import { useApp } from '@/lib/store';
import { Issue } from '@/lib/mockData';
import {
  Upload, Camera, FileVideo, X, CheckCircle, Loader2,
  MapPin, ChevronRight, ChevronLeft, Cpu, AlertTriangle,
  Building, Clock, Eye, Send
} from 'lucide-react';

const MapPicker = dynamic(() => import('@/components/map/MapPicker'), { ssr: false });

const steps = ['Upload Media', 'AI Analysis', 'Set Location', 'Review & Submit'];

interface AIResult {
  category: string;
  title: string;
  description: string;
  severity: string;
  department: string;
  priority: number;
  confidence: number;
  detectedObjects: string[];
  estimatedResolution: string;
  authenticityScore: number;
  spamProbability: number;
}

export default function ReportPage() {
  const { addIssue, user } = useApp();
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const [editedResult, setEditedResult] = useState<AIResult | null>(null);
  const [location, setLocation] = useState({ lat: 19.076, lng: 72.8777, address: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    const newPreviews = acceptedFiles.map(f => URL.createObjectURL(f));
    setPreviews(newPreviews);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [], 'video/*': [] },
    maxFiles: 3,
  });

  const removeFile = (i: number) => {
    setFiles(prev => prev.filter((_, idx) => idx !== i));
    setPreviews(prev => prev.filter((_, idx) => idx !== i));
  };

  const runAIAnalysis = async () => {
    setAnalyzing(true);
    setStep(1);
    try {
      let result: AIResult;
      if (files.length > 0) {
        const file = files[0];
        const base64 = await fileToBase64(file);
        const response = await fetch('/api/analyze-issue', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64, mimeType: file.type }),
        });
        result = await response.json();
      } else {
        // Mock result for demo
        await new Promise(r => setTimeout(r, 2500));
        result = getMockResult();
      }
      setAiResult(result);
      setEditedResult(result);
    } catch {
      const mock = getMockResult();
      setAiResult(mock);
      setEditedResult(mock);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    const id = `ISS-${String(Math.floor(Math.random() * 900) + 100)}`;
    const newIssue: Issue = {
      id,
      title: editedResult?.title || 'New Issue',
      description: editedResult?.description || '',
      category: editedResult?.category as Issue['category'] || 'Pothole',
      severity: editedResult?.severity as Issue['severity'] || 'Medium',
      status: 'Reported',
      location: { ...location, ward: 'Your Ward', area: location.address || 'Your Area' },
      images: previews.length ? previews : ['https://picsum.photos/seed/new/600/400'],
      reportedBy: user.id,
      reportedByName: user.name,
      reportedByAvatar: user.avatar,
      department: editedResult?.department || 'Municipal Department',
      votes: 1,
      verifications: 0,
      rejections: 0,
      duplicateCount: 0,
      authenticityScore: editedResult?.authenticityScore || 90,
      spamProbability: editedResult?.spamProbability || 5,
      estimatedResolution: editedResult?.estimatedResolution || '3 days',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
      statusHistory: [{ status: 'Reported', timestamp: new Date().toISOString(), updatedBy: user.name, note: 'Issue reported by citizen' }],
      aiAnalysis: { confidence: editedResult?.confidence || 90, detectedObjects: editedResult?.detectedObjects || [], suggestedPriority: editedResult?.priority || 2 },
    };
    addIssue(newIssue);
    setSubmittedId(id);
    setSubmitting(false);
    setSubmitted(true);
    toast.success('🎉 Issue reported successfully! +50 points earned!');
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-dark-950">
        <Navbar />
        <div className="max-w-xl mx-auto px-6 py-20 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}>
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-500/30">
              <CheckCircle size={48} className="text-green-400" />
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h1 className="text-3xl font-display font-black text-white mb-3">Issue Reported!</h1>
            <p className="text-slate-400 mb-2">Your report <span className="text-blue-400 font-semibold">#{submittedId}</span> has been submitted successfully.</p>
            <p className="text-yellow-400 font-medium mb-8">🏆 You earned +50 points!</p>
            <div className="glass-card p-5 mb-8 text-left space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-sm font-bold">1</div>
                <p className="text-slate-300 text-sm">Community members will verify your report</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-sm font-bold">2</div>
                <p className="text-slate-300 text-sm">Report assigned to {editedResult?.department || 'concerned department'}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-sm font-bold">3</div>
                <p className="text-slate-300 text-sm">You&apos;ll receive notifications on every status update</p>
              </div>
            </div>
            <div className="flex gap-4">
              <a href="/issues" className="btn-primary flex-1 justify-center">View All Issues</a>
              <a href="/dashboard/citizen" className="btn-secondary flex-1 justify-center">My Dashboard</a>
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-dark-950">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-display font-black text-white mb-2">Report a <span className="gradient-text">Civic Issue</span></h1>
          <p className="text-slate-400">AI-powered issue reporting in under 2 minutes</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-10 relative">
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-dark-800" />
          <div
            className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-500"
            style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
          />
          {steps.map((s, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                i < step ? 'bg-green-500 text-white' :
                i === step ? 'bg-blue-500 text-white ring-4 ring-blue-500/30' :
                'bg-dark-800 text-slate-500 border border-dark-700'
              }`}>
                {i < step ? <CheckCircle size={18} /> : i + 1}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${i === step ? 'text-white' : 'text-slate-500'}`}>{s}</span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {/* Step 0: Upload */}
          {step === 0 && (
            <motion.div key="upload" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="glass-card p-8">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Upload size={20} className="text-blue-400" /> Upload Issue Media
                </h2>

                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
                    isDragActive ? 'border-blue-400 bg-blue-500/10' : 'border-dark-700 hover:border-dark-600 hover:bg-dark-800/30'
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                      <Upload size={28} className="text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold mb-1">Drop photos or videos here</p>
                      <p className="text-slate-400 text-sm">or click to browse • JPG, PNG, MP4 • Max 3 files</p>
                    </div>
                    <div className="flex gap-3">
                      <span className="flex items-center gap-1.5 text-xs text-slate-400 bg-dark-800 px-3 py-1.5 rounded-lg">
                        <Camera size={14} className="text-blue-400" /> Photo
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-slate-400 bg-dark-800 px-3 py-1.5 rounded-lg">
                        <FileVideo size={14} className="text-green-400" /> Video
                      </span>
                    </div>
                  </div>
                </div>

                {previews.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    {previews.map((p, i) => (
                      <div key={i} className="relative group aspect-square rounded-xl overflow-hidden">
                        <img src={p} alt="" className="w-full h-full object-cover" />
                        <button
                          onClick={() => removeFile(i)}
                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <X size={12} className="text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-6 flex justify-between items-center">
                  <p className="text-slate-500 text-sm">{files.length > 0 ? `${files.length} file(s) selected` : 'No files selected — AI will use demo analysis'}</p>
                  <button onClick={runAIAnalysis} className="btn-primary">
                    Analyze with AI <Cpu size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 1: AI Analysis */}
          {step === 1 && (
            <motion.div key="analysis" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="glass-card p-8">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Cpu size={20} className="text-blue-400" /> AI Analysis Results
                </h2>

                {analyzing ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-6 border-2 border-blue-500/30">
                      <Loader2 size={36} className="text-blue-400 animate-spin" />
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-2">Analyzing with Gemini AI...</h3>
                    <p className="text-slate-400 text-sm">Detecting issue type, severity, and responsible department</p>
                    <div className="flex justify-center gap-2 mt-6">
                      {['Categorizing...', 'Assessing severity...', 'Finding department...'].map((t, i) => (
                        <span key={i} className="text-xs glass px-3 py-1.5 rounded-full text-blue-300 animate-pulse" style={{ animationDelay: `${i * 0.3}s` }}>{t}</span>
                      ))}
                    </div>
                  </div>
                ) : editedResult && (
                  <div className="space-y-4">
                    {/* AI Badge */}
                    <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                      <Cpu size={20} className="text-blue-400" />
                      <div>
                        <p className="text-blue-300 text-sm font-medium">AI Analysis Complete</p>
                        <p className="text-slate-400 text-xs">Confidence: {editedResult.confidence}% • Authenticity: {editedResult.authenticityScore}%</p>
                      </div>
                      <div className="ml-auto text-right">
                        <p className="text-green-400 text-xs font-medium">Spam: {editedResult.spamProbability}%</p>
                        <p className="text-slate-500 text-xs">{editedResult.detectedObjects.slice(0, 2).join(', ')}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-slate-400 text-xs mb-1.5 block">Category</label>
                        <input
                          value={editedResult.category}
                          onChange={e => setEditedResult({ ...editedResult, category: e.target.value })}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 text-xs mb-1.5 block">Severity</label>
                        <select
                          value={editedResult.severity}
                          onChange={e => setEditedResult({ ...editedResult, severity: e.target.value })}
                          className="input-field"
                        >
                          {['Low', 'Medium', 'High', 'Critical'].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-400 text-xs mb-1.5 block">Title</label>
                      <input
                        value={editedResult.title}
                        onChange={e => setEditedResult({ ...editedResult, title: e.target.value })}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="text-slate-400 text-xs mb-1.5 block">Description (AI Generated — editable)</label>
                      <textarea
                        value={editedResult.description}
                        onChange={e => setEditedResult({ ...editedResult, description: e.target.value })}
                        rows={3}
                        className="input-field resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-dark-800 rounded-xl">
                        <Building size={18} className="text-violet-400" />
                        <div>
                          <p className="text-slate-400 text-xs">Department</p>
                          <p className="text-white font-medium text-sm">{editedResult.department}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-dark-800 rounded-xl">
                        <Clock size={18} className="text-orange-400" />
                        <div>
                          <p className="text-slate-400 text-xs">Est. Resolution</p>
                          <p className="text-white font-medium text-sm">{editedResult.estimatedResolution}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between pt-2">
                      <button onClick={() => setStep(0)} className="btn-secondary text-sm px-4 py-2.5">
                        <ChevronLeft size={16} /> Back
                      </button>
                      <button onClick={() => setStep(2)} className="btn-primary text-sm px-4 py-2.5">
                        Set Location <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <motion.div key="location" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="glass-card p-8">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <MapPin size={20} className="text-green-400" /> Pin Issue Location
                </h2>
                <p className="text-slate-400 text-sm mb-6">Click on the map to set the exact location, or use GPS auto-detect.</p>

                <MapPicker location={location} onChange={setLocation} />

                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-dark-800 rounded-xl">
                    <MapPin size={18} className="text-green-400" />
                    <div className="flex-1">
                      <p className="text-slate-400 text-xs">Selected Coordinates</p>
                      <p className="text-white text-sm font-medium">{location.lat.toFixed(6)}, {location.lng.toFixed(6)}</p>
                    </div>
                  </div>
                  <input
                    placeholder="Enter address or landmark (optional)"
                    value={location.address}
                    onChange={e => setLocation({ ...location, address: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div className="flex justify-between mt-6">
                  <button onClick={() => setStep(1)} className="btn-secondary text-sm px-4 py-2.5">
                    <ChevronLeft size={16} /> Back
                  </button>
                  <button onClick={() => setStep(3)} className="btn-primary text-sm px-4 py-2.5">
                    Review & Submit <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Review & Submit */}
          {step === 3 && (
            <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="glass-card p-8">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Eye size={20} className="text-orange-400" /> Review Your Report
                </h2>

                {previews.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    {previews.map((p, i) => (
                      <img key={i} src={p} alt="" className="w-full h-24 object-cover rounded-xl" />
                    ))}
                  </div>
                )}

                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3 p-3 bg-dark-800 rounded-xl">
                    <AlertTriangle size={18} className="text-orange-400 mt-0.5" />
                    <div>
                      <p className="text-slate-400 text-xs">Issue</p>
                      <p className="text-white font-semibold text-sm">{editedResult?.title}</p>
                      <p className="text-slate-400 text-xs mt-1">{editedResult?.category} • {editedResult?.severity} severity</p>
                    </div>
                    <div className="ml-auto">
                      <span className={`text-xs px-2 py-1 rounded-lg font-medium ${
                        editedResult?.severity === 'Critical' ? 'bg-red-500/20 text-red-400' :
                        editedResult?.severity === 'High' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {editedResult?.severity}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-dark-800 rounded-xl">
                    <MapPin size={18} className="text-green-400" />
                    <div>
                      <p className="text-slate-400 text-xs">Location</p>
                      <p className="text-white text-sm">{location.address || `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-dark-800 rounded-xl">
                    <Building size={18} className="text-violet-400" />
                    <div>
                      <p className="text-slate-400 text-xs">Department</p>
                      <p className="text-white text-sm">{editedResult?.department}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                      <p className="text-green-400 text-xs">AI Authenticity</p>
                      <p className="text-white font-bold">{editedResult?.authenticityScore}%</p>
                    </div>
                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                      <p className="text-blue-400 text-xs">AI Confidence</p>
                      <p className="text-white font-bold">{editedResult?.confidence}%</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button onClick={() => setStep(2)} className="btn-secondary text-sm px-4 py-2.5">
                    <ChevronLeft size={16} /> Back
                  </button>
                  <button onClick={handleSubmit} disabled={submitting} className="btn-primary text-sm px-6 py-2.5">
                    {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    {submitting ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

function getMockResult(): AIResult {
  return {
    category: 'Pothole',
    title: 'Large Pothole Detected – Immediate Road Safety Risk',
    description: 'AI analysis has detected a significant pothole in the uploaded image. The road surface shows clear signs of deterioration with a visible depression that poses safety risks to vehicles and pedestrians. Immediate repair is recommended to prevent accidents and further road damage.',
    severity: 'High',
    department: 'Road Maintenance',
    priority: 2,
    confidence: 93,
    detectedObjects: ['pothole', 'road surface', 'crack', 'asphalt damage'],
    estimatedResolution: '2-4 days',
    authenticityScore: 95,
    spamProbability: 3,
  };
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
  });
}
