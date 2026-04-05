import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogoUploader } from './components/LogoUploader';
import { MockupPreview } from './components/MockupPreview';
import { AIImageGenerator } from './components/AIImageGenerator';
import { Sparkles, ShoppingBag, Layers, Palette, Info, HelpCircle, Github } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [customBackgroundUrl, setCustomBackgroundUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'ai'>('upload');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate initial load for a smooth entry
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl animate-pulse">
            <Layers className="w-7 h-7" />
          </div>
          <div className="h-1 w-32 bg-slate-200 rounded-full overflow-hidden">
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="h-full w-full bg-slate-900"
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3 group cursor-pointer">
          <motion.div 
            whileHover={{ rotate: 5, scale: 1.05 }}
            className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg"
          >
            <Layers className="w-5 h-5" />
          </motion.div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-none">Mockup Studio</h1>
            <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-slate-400 mt-1">AI-Powered Visualization</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-6">
            {['Showcase', 'Templates', 'Docs'].map((item) => (
              <a 
                key={item} 
                href="#" 
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider"
              >
                {item}
              </a>
            ))}
          </nav>
          <div className="h-4 w-px bg-slate-200" />
          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
              <Github className="w-4 h-4" />
            </button>
            <button className="btn-primary py-1.5 px-4 text-xs">
              Go Pro
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Controls */}
        <div className="lg:col-span-4 space-y-8">
          <section className="bg-white rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <div className="flex bg-slate-50/50 p-1.5 m-2 rounded-2xl border border-slate-100">
              <button
                onClick={() => setActiveTab('upload')}
                className={cn(
                  "flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-2 rounded-xl transition-all",
                  activeTab === 'upload' 
                    ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200" 
                    : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                )}
              >
                <Palette className="w-3.5 h-3.5" />
                LOGO ASSET
              </button>
              <button
                onClick={() => setActiveTab('ai')}
                className={cn(
                  "flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-2 rounded-xl transition-all",
                  activeTab === 'ai' 
                    ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200" 
                    : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                )}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                AI SCENE
              </button>
            </div>

            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'upload' ? (
                    <LogoUploader 
                      onLogoUpload={setLogoUrl} 
                      currentLogo={logoUrl} 
                      onClear={() => setLogoUrl(null)} 
                    />
                  ) : (
                    <AIImageGenerator onImageGenerated={(url) => {
                      setCustomBackgroundUrl(url);
                      setActiveTab('upload');
                    }} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </section>

          {/* Help/Tips Section */}
          <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <HelpCircle className="w-4 h-4 text-slate-300" />
                </div>
                <h4 className="font-bold text-base tracking-tight">Design Guidelines</h4>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                For the most realistic results, use <span className="text-white font-medium">transparent PNGs</span>. Our AI engine works best with descriptive prompts like "minimalist studio lighting" or "natural morning shadows."
              </p>
              <button className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-xs font-bold transition-all backdrop-blur-sm tracking-wider uppercase">
                View Documentation
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Preview */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-10 min-h-[700px] flex flex-col relative">
            <MockupPreview 
              logoUrl={logoUrl} 
              customBackgroundUrl={customBackgroundUrl} 
              onResetBackground={() => setCustomBackgroundUrl(null)}
            />
            
            <div className="mt-12 pt-8 border-t border-slate-100 flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ y: -4, zIndex: 10 }}
                      className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 overflow-hidden shadow-md cursor-pointer"
                    >
                      <img src={`https://i.pravatar.cc/100?u=mockup${i}`} alt="User" referrerPolicy="no-referrer" />
                    </motion.div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">2,400+ Designers</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active this month</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Preview Active</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-[1400px] mx-auto px-6 py-20 border-t border-slate-200 mt-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12">
          <div className="col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                <Layers className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg tracking-tight">Mockup Studio</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              The professional standard for AI-powered product visualization. Built for modern brands and creative agencies.
            </p>
            <div className="flex gap-4">
              {['twitter', 'instagram', 'dribbble'].map((social) => (
                <div key={social} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all cursor-pointer">
                  <span className="sr-only">{social}</span>
                  <div className="w-4 h-4 bg-current rounded-sm opacity-20" />
                </div>
              ))}
            </div>
          </div>
          
          {['Product', 'Company', 'Legal'].map((category) => (
            <div key={category}>
              <h5 className="font-bold text-xs text-slate-900 uppercase tracking-widest mb-6">{category}</h5>
              <ul className="space-y-4 text-sm text-slate-500">
                {['Link One', 'Link Two', 'Link Three'].map((link) => (
                  <li key={link}><a href="#" className="hover:text-slate-900 transition-colors">{link}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-20 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">© 2026 Mockup Studio. All rights reserved.</p>
          <div className="flex items-center gap-8">
            {['Privacy Policy', 'Terms of Service', 'Cookie Settings'].map((item) => (
              <a key={item} href="#" className="text-[10px] font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
