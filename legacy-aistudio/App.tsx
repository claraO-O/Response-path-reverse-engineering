
import React, { useState } from 'react';
import { AppState, AnalysisResult } from './types';
import { analyzePrompt } from './services/geminiService';
import { InputSection } from './components/InputSection';
import { Phase1Payload } from './components/Phase1Payload';
import { Phase2Alignment } from './components/Phase2Alignment';
import { Phase3Paths } from './components/Phase3Paths';
import { Activity, AlertTriangle } from 'lucide-react';

export default function App() {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.5-flash');

  const handleAnalyze = async (text: string, context: string, model: string = 'gemini-3.5-flash') => {
    setAppState(AppState.ANALYZING);
    setError(null);
    setResult(null);

    try {
      const data = await analyzePrompt(text, context, model);
      setResult(data);
      setAppState(AppState.COMPLETE);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "分析過程中發生未知錯誤。");
      setAppState(AppState.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-cyan-500/30 selection:text-cyan-100">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-950 p-1.5 rounded border border-cyan-800">
              <Activity className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight">回應路徑逆向工程</h1>
              <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">機率坍塌掃描儀 v1.0</p>
            </div>
          </div>
          <div className="text-xs text-zinc-600 font-mono hidden sm:flex items-center gap-4">
            <div>
              ENGINE: <span className="text-cyan-400 font-bold">{selectedModel === 'gemini-3.5-flash' ? '3.5-FLASH' : selectedModel === 'gemini-3.1-pro-preview' ? '3.1-PRO' : '3.1-LITE'}</span>
            </div>
            <div>
              SYSTEM_STATUS: <span className="text-emerald-500">ONLINE</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12 relative">
        {/* Intro */}
        {appState === AppState.IDLE && (
          <div className="text-center mb-12 animate-[fadeIn_1s_ease-out]">
            <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-600 mb-6 leading-tight">
              語言模型如何審視<br />你的話語？
            </h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              大多數使用者並未意識到，他們的提示詞攜帶著隱藏的「立場」與「情緒」權重。
              此工具對您的文本進行法醫級的審訊，揭露 LLM 實際上是如何解讀它的。
            </p>
          </div>
        )}

        {/* Input */}
        <InputSection 
          onAnalyze={handleAnalyze} 
          appState={appState} 
          selectedModel={selectedModel} 
          setSelectedModel={setSelectedModel} 
        />

        {/* Error State */}
        {appState === AppState.ERROR && (
          <div className="bg-rose-950/20 border border-rose-900/50 text-rose-200 p-6 rounded-xl max-w-2xl mx-auto flex items-start gap-4 animate-bounce-short">
            <AlertTriangle className="w-6 h-6 shrink-0" />
            <div>
              <h3 className="font-bold mb-1">分析協議失敗</h3>
              <p className="text-sm opacity-80">{error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {appState === AppState.COMPLETE && result && (
          <div className="space-y-24 pb-24 relative scanline">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-zinc-800 -z-10 hidden lg:block" />
            
            <section className="relative">
               <div className="absolute -left-12 top-0 hidden lg:flex items-center justify-center w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-500">01</div>
               <Phase1Payload data={result.phase1_payload} />
            </section>

            <section className="relative">
               <div className="absolute -left-12 top-0 hidden lg:flex items-center justify-center w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-500">02</div>
               <Phase2Alignment data={result.phase2_alignment} />
            </section>

            <section className="relative">
               <div className="absolute -left-12 top-0 hidden lg:flex items-center justify-center w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-500">03</div>
               <Phase3Paths data={result.phase3_collapse} />
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 text-center text-zinc-600 text-sm">
         <p>由 {selectedModel === 'gemini-3.5-flash' ? 'Gemini 3.5 Flash' : selectedModel === 'gemini-3.1-pro-preview' ? 'Gemini 3.1 Pro 思考模式' : 'Gemini 3.1 Flash-Lite'} 驅動 • 實驗性分析工具</p>
      </footer>
    </div>
  );
}
