
import React, { useState } from 'react';
import { ArrowRight, BrainCircuit, Settings2, ChevronDown, ChevronUp, Zap, Sparkles, Cpu } from 'lucide-react';
import { AppState } from '../types';

interface InputSectionProps {
  onAnalyze: (text: string, context: string, model: string) => void;
  appState: AppState;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
}

export const InputSection: React.FC<InputSectionProps> = ({ 
  onAnalyze, 
  appState,
  selectedModel,
  setSelectedModel 
}) => {
  const [text, setText] = useState('');
  const [context, setContext] = useState('');
  const [showContext, setShowContext] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAnalyze(text, context, selectedModel);
    }
  };

  const isLoading = appState === AppState.ANALYZING;

  const models = [
    {
      id: 'gemini-3.5-flash',
      name: 'Gemini 3.5 Flash',
      tag: 'RECOMMENDED',
      desc: '平衡且極速的預設引擎',
      icon: Zap,
      color: 'text-cyan-400 group-hover:text-cyan-300',
      activeBg: 'bg-cyan-950/20 border-cyan-500/50 text-cyan-200'
    },
    {
      id: 'gemini-3.1-pro-preview',
      name: 'Gemini 3.1 Pro',
      tag: 'THINKING',
      desc: '深思熟慮的大型思維引擎',
      icon: Sparkles,
      color: 'text-purple-400 group-hover:text-purple-300',
      activeBg: 'bg-purple-950/20 border-purple-500/50 text-purple-200'
    },
    {
      id: 'gemini-3.1-flash-lite',
      name: 'Gemini 3.1 Flash-Lite',
      tag: 'FASTEST',
      desc: '精簡無延遲的極速引擎',
      icon: Cpu,
      color: 'text-emerald-400 group-hover:text-emerald-300',
      activeBg: 'bg-emerald-950/20 border-emerald-500/50 text-emerald-200'
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mb-12 relative z-10">
      <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-xl p-5 shadow-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Model Selector Section */}
          <div>
            <span className="text-xs text-zinc-500 font-mono uppercase tracking-widest block mb-3 ml-1">
              [ 步驟 1 : 啟動解析引擎 ] // COGNITIVE ENGINE
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {models.map((m) => {
                const Icon = m.icon;
                const isActive = selectedModel === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    disabled={isLoading}
                    onClick={() => setSelectedModel(m.id)}
                    className={`
                      group relative text-left p-4 rounded-lg border transition-all duration-300 cursor-pointer select-none
                      ${isActive 
                        ? m.activeBg + ' shadow-[0_0_15px_rgba(6,182,212,0.1)] bg-opacity-40' 
                        : 'border-zinc-800 bg-zinc-950/30 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700/80 hover:bg-zinc-900/40'}
                      disabled:opacity-40 disabled:cursor-not-allowed
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-md bg-zinc-900 border border-zinc-800 ${isActive ? 'bg-zinc-900/50 border-current' : ''}`}>
                        <Icon className={`w-4 h-4 ${isActive ? m.color : 'text-zinc-500'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="font-semibold text-sm block truncate">{m.name}</span>
                          <span className={`text-[9px] font-mono px-1.5 rounded border leading-none shrink-0 ${isActive ? 'bg-zinc-90 w-fit' : 'bg-zinc-900/50 border-zinc-800 text-zinc-500'}`}>
                            {m.tag}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-500 mt-1 line-clamp-1">{m.desc}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-zinc-800/30 my-1"></div>

          {/* Input text section */}
          <div>
            <span className="text-xs text-zinc-500 font-mono uppercase tracking-widest block mb-2 ml-1">
              [ 步驟 2 : 載入分析標的 ] // INPUT TARGET PROMPT
            </span>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isLoading}
              placeholder="在此貼上您的提示詞，揭露其中隱藏的權重..."
              className="w-full h-40 bg-zinc-950/50 text-gray-200 p-5 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-cyan-500/50 text-lg font-light transition-all placeholder:text-zinc-600 disabled:opacity-50 border border-zinc-800/50"
            />
          </div>
          
          {/* Collapsible Context Section */}
          <div className="border-t border-zinc-800/50 pt-2">
            <button
              type="button"
              onClick={() => setShowContext(!showContext)}
              className="flex items-center gap-2 text-xs text-zinc-500 hover:text-cyan-400 transition-colors mb-2 ml-1"
            >
              <Settings2 className="w-3 h-3" />
              <span>[ 步驟 3 : 設定前置情境 / 角色 ] (Context & Persona)</span>
              {showContext ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            
            {showContext && (
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                disabled={isLoading}
                placeholder="例如：已建立長期關係，設定為霸道哥哥，喜歡用分析語氣..."
                className="w-full h-20 bg-zinc-950/30 text-gray-300 p-3 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-cyan-500/30 text-sm transition-all placeholder:text-zinc-700 disabled:opacity-50 border border-zinc-800/30 animate-[fadeIn_0.3s_ease-out]"
              />
            )}
          </div>

          <div className="flex items-center justify-between px-1">
            <span className="text-xs text-zinc-500 mono uppercase tracking-wider">
              {text.length} 字
            </span>
            <button
              type="submit"
              disabled={!text.trim() || isLoading}
              className={`
                group flex items-center gap-2 px-6 py-3 rounded-md font-semibold tracking-wide transition-all
                ${isLoading 
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:shadow-[0_0_20px_rgba(8,145,178,0.4)] hover:scale-105 active:scale-95'}
              `}
            >
              {isLoading ? (
                <>
                  <BrainCircuit className="w-5 h-5 animate-pulse" />
                  <span>解構中...</span>
                </>
              ) : (
                <>
                  <span>注入提示詞</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      {/* Decorative text */}
      <div className="mt-4 text-center">
        <p className="text-zinc-500 text-sm mono">
          // 警告：此工具將揭露 AI <span className="text-rose-500">真正</span> 如何評判您。
        </p>
      </div>
    </div>
  );
};
