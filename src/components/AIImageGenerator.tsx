import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, Image as ImageIcon, Loader2, AlertCircle, Key, Wand2, Info, CheckCircle2, RotateCcw } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

// Extend window for AI Studio specific functions
declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

interface AIImageGeneratorProps {
  onImageGenerated: (url: string) => void;
}

type ImageSize = '1K' | '2K' | '4K';

const SUGGESTIONS = [
  "Modern minimalist office desk with a laptop and a coffee mug",
  "Urban street style background with a person wearing a plain t-shirt",
  "Close-up of a premium smartphone on a marble surface",
  "A person wearing a baseball cap in a sunny park setting",
  "Minimalist studio setup with soft lighting for product photography"
];

export function AIImageGenerator({ onImageGenerated }: AIImageGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<ImageSize>('1K');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState<boolean | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    checkKey();
  }, []);

  const checkKey = async () => {
    if (window.aistudio) {
      const selected = await window.aistudio.hasSelectedApiKey();
      setHasKey(selected);
    }
  };

  const handleOpenKeyDialog = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasKey(true); // Assume success as per guidelines
    }
  };

  const generateImage = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    setSuccess(false);

    try {
      // Create a new instance right before calling to ensure up-to-date key
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: {
          parts: [{ text: `High-quality product mockup background: ${prompt}. Professional photography, studio lighting, clean composition, high resolution.` }],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
            imageSize: size
          }
        },
      });

      let imageUrl = null;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }

      if (imageUrl) {
        setGeneratedImage(imageUrl);
        onImageGenerated(imageUrl);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error("No image data found in response");
      }
    } catch (err: any) {
      console.error("Generation error:", err);
      if (err.message?.includes("Requested entity was not found")) {
        setHasKey(false);
        setError("API Key issue. Please re-select your key.");
      } else {
        setError(err.message || "Failed to generate image. Please try again.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  if (hasKey === false) {
    return (
      <div className="p-10 border-2 border-dashed border-amber-200 bg-amber-50 rounded-[2.5rem] text-center space-y-6">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mx-auto rotate-3">
          <Key className="w-8 h-8" />
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-amber-900 uppercase tracking-tight">API Key Required</h3>
          <p className="text-xs text-amber-700 max-w-xs mx-auto font-medium leading-relaxed">
            To use high-quality image generation, you need to select a paid Gemini API key from your Google Cloud project.
          </p>
          <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest">
            Visit <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-800 transition-colors">billing docs</a>
          </p>
        </div>
        <button
          onClick={handleOpenKeyDialog}
          className="w-full py-4 bg-amber-600 text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-amber-700 transition-all shadow-lg shadow-amber-200/50"
        >
          Select API Key
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-slate-900" />
          AI Scene Engine
        </h3>
        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Generate custom mockup backgrounds</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Wand2 className="w-3 h-3" />
            Creative Prompt
          </label>
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the scene you want to create..."
              className="w-full h-32 p-5 bg-white border border-slate-200 rounded-[2rem] text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all resize-none placeholder:text-slate-300 font-medium"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Info className="w-3 h-3" />
            Output Quality
          </label>
          <div className="flex gap-2">
            {(['1K', '2K', '4K'] as ImageSize[]).map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={cn(
                  "flex-1 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border-2",
                  size === s 
                    ? "bg-slate-900 border-slate-900 text-white shadow-md" 
                    : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                )}
              >
                {s} Res
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={generateImage}
          disabled={isGenerating || !prompt.trim()}
          className="w-full btn-primary py-4 flex items-center justify-center gap-3 group"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="uppercase tracking-widest font-bold">Synthesizing Scene...</span>
            </>
          ) : success ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span className="uppercase tracking-widest font-bold">Scene Generated!</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span className="uppercase tracking-widest font-bold">Generate Custom Scene</span>
            </>
          )}
        </button>

        <div className="space-y-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Prompt Inspirations</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((suggestion, i) => (
              <button
                key={i}
                onClick={() => setPrompt(suggestion)}
                className="text-[10px] font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-lg border border-slate-100 transition-colors text-left"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-red-50 text-red-700 text-xs rounded-2xl border border-red-100 flex items-start gap-3"
          >
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p className="font-medium leading-relaxed">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-6 bg-slate-900 rounded-[2rem] text-white space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Engine Status</p>
        </div>
        <p className="text-xs font-medium leading-relaxed">
          Powered by <span className="text-emerald-400 font-bold">Gemini 3.1 Flash</span>. 
          Generates high-fidelity, photorealistic environments optimized for product visualization.
        </p>
      </div>
    </div>
  );
}
