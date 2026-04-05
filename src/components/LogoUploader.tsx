import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface LogoUploaderProps {
  onLogoUpload: (url: string) => void;
  currentLogo: string | null;
  onClear: () => void;
}

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export function LogoUploader({ onLogoUpload, currentLogo, onClear }: LogoUploaderProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    setError(null);
    
    if (fileRejections.length > 0) {
      const rejection = fileRejections[0];
      if (rejection.file.size > MAX_SIZE) {
        setError("File is too large. Max size is 5MB.");
      } else {
        setError("Invalid file type. Please use PNG, JPG, or SVG.");
      }
      return;
    }

    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onLogoUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onLogoUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.svg']
    },
    maxSize: MAX_SIZE,
    multiple: false
  } as any);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Brand Asset</h3>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Upload your logo</p>
        </div>
        {currentLogo && (
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onClear}
            className="text-[10px] font-bold text-red-500 hover:text-red-600 flex items-center gap-1.5 transition-colors uppercase tracking-widest px-3 py-1.5 rounded-lg hover:bg-red-50"
          >
            <X className="w-3 h-3" />
            Remove
          </motion.button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!currentLogo ? (
          <motion.div
            key="uploader"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-[2rem] p-10 transition-all cursor-pointer flex flex-col items-center justify-center gap-4 group",
              isDragActive 
                ? "border-slate-900 bg-slate-50" 
                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
            )}
          >
            <input {...getInputProps()} />
            <div className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500",
              isDragActive ? "bg-slate-900 text-white rotate-12" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600"
            )}>
              <Upload className="w-7 h-7" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                {isDragActive ? "Drop to upload" : "Select Logo File"}
              </p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                PNG, JPG or SVG • Max 5MB
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative group rounded-[2rem] border border-slate-200 p-6 bg-white shadow-sm overflow-hidden flex flex-col items-center gap-6"
          >
            <div className="aspect-square w-full max-w-[240px] flex items-center justify-center bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 p-8 relative">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '20px 20px' }} />
              <img 
                src={currentLogo} 
                alt="Uploaded logo" 
                className="max-w-full max-h-full object-contain drop-shadow-sm relative z-10"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Asset Ready for Mockup</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 bg-red-50 text-red-700 text-xs rounded-2xl border border-red-100"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p className="font-medium">{error}</p>
        </motion.div>
      )}
    </div>
  );
}
