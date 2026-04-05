import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { ShoppingBag, Coffee, Shirt, Smartphone, User, Download, RefreshCw, Move, Maximize2, RotateCcw, Layers } from 'lucide-react';
import html2canvas from 'html2canvas';

interface ProductMockup {
  id: string;
  name: string;
  icon: React.ReactNode;
  imageUrl: string;
  defaultLogoPosition: {
    top: number; // percentage
    left: number; // percentage
    width: number; // percentage
    rotation: number;
  };
}

const MOCKUPS: ProductMockup[] = [
  {
    id: 'mug',
    name: 'Ceramic Mug',
    icon: <Coffee className="w-5 h-5" />,
    imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=1000&auto=format&fit=crop',
    defaultLogoPosition: { top: 45, left: 42, width: 20, rotation: -2 }
  },
  {
    id: 'tshirt',
    name: 'Cotton T-Shirt',
    icon: <Shirt className="w-5 h-5" />,
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop',
    defaultLogoPosition: { top: 35, left: 50, width: 15, rotation: 0 }
  },
  {
    id: 'phone',
    name: 'Phone Case',
    icon: <Smartphone className="w-5 h-5" />,
    imageUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=1000&auto=format&fit=crop',
    defaultLogoPosition: { top: 40, left: 50, width: 30, rotation: 0 }
  },
  {
    id: 'cap',
    name: 'Baseball Cap',
    icon: <User className="w-5 h-5" />,
    imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1000&auto=format&fit=crop',
    defaultLogoPosition: { top: 40, left: 50, width: 25, rotation: 0 }
  }
];

interface MockupPreviewProps {
  logoUrl: string | null;
  customBackgroundUrl?: string | null;
  onResetBackground?: () => void;
}

export function MockupPreview({ logoUrl, customBackgroundUrl, onResetBackground }: MockupPreviewProps) {
  const [selectedMockup, setSelectedMockup] = useState<ProductMockup>(MOCKUPS[0]);
  const [logoPos, setLogoPos] = useState(MOCKUPS[0].defaultLogoPosition);
  const [logoOpacity, setLogoOpacity] = useState(0.9);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  const displayImageUrl = customBackgroundUrl || selectedMockup.imageUrl;

  // Reset logo position when mockup changes
  useEffect(() => {
    if (!customBackgroundUrl) {
      setLogoPos(selectedMockup.defaultLogoPosition);
    }
  }, [selectedMockup, customBackgroundUrl]);

  const handleDownload = async () => {
    if (!containerRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(containerRef.current, {
        useCORS: true,
        scale: 2,
        backgroundColor: null,
      });
      const link = document.createElement('a');
      link.download = `mockup-${selectedMockup.id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to generate download. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const left = ((clientX - rect.left) / rect.width) * 100;
    const top = ((clientY - rect.top) / rect.height) * 100;
    
    setLogoPos(prev => ({ ...prev, left, top }));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-slate-900" />
            Live Preview
          </h3>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Interactive Mockup Canvas</p>
        </div>
        <div className="flex gap-3">
          {customBackgroundUrl && (
            <button
              onClick={onResetBackground}
              className="btn-secondary flex items-center gap-2 text-xs py-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Scene
            </button>
          )}
          <button
            onClick={handleDownload}
            disabled={!logoUrl || isDownloading}
            className="btn-primary flex items-center gap-2 text-xs py-2"
          >
            {isDownloading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            Export Image
          </button>
        </div>
      </div>

      {/* Mockup Selector */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {MOCKUPS.map((mockup) => (
          <button
            key={mockup.id}
            onClick={() => setSelectedMockup(mockup)}
            className={cn(
              "flex items-center gap-3 px-5 py-3 rounded-2xl border-2 transition-all whitespace-nowrap",
              selectedMockup.id === mockup.id && !customBackgroundUrl
                ? "border-slate-900 bg-slate-900 text-white shadow-lg scale-105"
                : "border-slate-100 hover:border-slate-200 bg-white text-slate-600"
            )}
          >
            {mockup.icon}
            <span className="text-xs font-bold uppercase tracking-wider">{mockup.name}</span>
          </button>
        ))}
      </div>

      {/* Preview Area */}
      <div 
        ref={containerRef}
        onMouseMove={handleDrag}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onTouchMove={handleDrag}
        onTouchEnd={() => setIsDragging(false)}
        className="relative aspect-square rounded-[2rem] overflow-hidden bg-slate-50 border border-slate-200 shadow-inner group cursor-crosshair select-none"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={displayImageUrl}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full relative"
          >
            <img
              src={displayImageUrl}
              alt={selectedMockup.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
            />
            
            {logoUrl && (
              <motion.div
                ref={logoRef}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: logoOpacity,
                  left: `${logoPos.left}%`,
                  top: `${logoPos.top}%`,
                  width: `${logoPos.width}%`,
                  rotate: logoPos.rotation,
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setIsDragging(true);
                }}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  setIsDragging(true);
                }}
                className={cn(
                  "absolute -translate-x-1/2 -translate-y-1/2 cursor-move group/logo",
                  isDragging && "ring-2 ring-slate-900 ring-offset-4 rounded-sm"
                )}
              >
                <img
                  src={logoUrl}
                  alt="Logo overlay"
                  className="w-full h-auto drop-shadow-xl"
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                />
                
                {/* Visual indicators for dragging */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] px-2 py-0.5 rounded opacity-0 group-hover/logo:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  DRAG TO POSITION
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {!logoUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/5 backdrop-blur-[2px]">
            <div className="bg-white/90 px-8 py-4 rounded-3xl shadow-2xl border border-white/20 flex flex-col items-center gap-2">
              <Layers className="w-6 h-6 text-slate-400" />
              <p className="text-sm font-bold text-slate-900 uppercase tracking-widest">Awaiting Logo Asset</p>
            </div>
          </div>
        )}
      </div>

      {/* Advanced Controls */}
      {logoUrl && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Maximize2 className="w-3 h-3" />
                Scale Factor
              </label>
              <span className="text-xs font-mono font-bold text-slate-900">{Math.round(logoPos.width)}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="80"
              step="1"
              value={logoPos.width}
              onChange={(e) => setLogoPos(prev => ({ ...prev, width: parseFloat(e.target.value) }))}
              className="w-full"
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <RotateCcw className="w-3 h-3" />
                Rotation
              </label>
              <span className="text-xs font-mono font-bold text-slate-900">{logoPos.rotation}°</span>
            </div>
            <input
              type="range"
              min="-180"
              max="180"
              step="1"
              value={logoPos.rotation}
              onChange={(e) => setLogoPos(prev => ({ ...prev, rotation: parseFloat(e.target.value) }))}
              className="w-full"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Layers className="w-3 h-3" />
                Blending Opacity
              </label>
              <span className="text-xs font-mono font-bold text-slate-900">{Math.round(logoOpacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.01"
              value={logoOpacity}
              onChange={(e) => setLogoOpacity(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="flex items-end pb-1">
            <button 
              onClick={() => setLogoPos(selectedMockup.defaultLogoPosition)}
              className="w-full py-2.5 text-[10px] font-bold text-slate-500 hover:text-slate-900 uppercase tracking-widest border border-slate-200 rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-3 h-3" />
              Reset Transform
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
