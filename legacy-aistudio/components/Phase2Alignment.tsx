import React from 'react';
import { AnalysisResult } from '../types';
import { ShieldAlert, Scale, Terminal } from 'lucide-react';

interface Props {
  data: AnalysisResult['phase2_alignment'];
}

export const Phase2Alignment: React.FC<Props> = ({ data }) => {
  // Defensive coding
  const internalMonologue = data?.internal_monologue || [];
  const conflicts = data?.conflicts || [];
  const safetyScore = data?.safety_score ?? 50; // Default to neutral if missing
  const complianceScore = data?.compliance_score ?? 50;

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out_0.2s] opacity-0 [animation-fill-mode:forwards]">
      <div className="flex items-center gap-3 mb-6 border-b border-zinc-800 pb-2">
        <div className="p-2 bg-indigo-500/10 rounded-lg">
          <Scale className="w-6 h-6 text-indigo-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-100 tracking-tight">第二階段：對齊裁決 (Alignment Arbitration)</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scores */}
        <div className="lg:col-span-1 space-y-4">
           {/* Safety Score */}
           <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-zinc-400 font-bold uppercase">安全性閾值</span>
              <ShieldAlert className={`w-4 h-4 ${safetyScore < 50 ? 'text-rose-500' : 'text-emerald-500'}`} />
            </div>
            <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${safetyScore < 50 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                style={{ width: `${safetyScore}%` }}
              />
            </div>
            <div className="mt-2 text-right mono text-xl font-bold text-white">
              {safetyScore}/100
            </div>
          </div>

          {/* Compliance Score */}
          <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-zinc-400 font-bold uppercase">順從性驅動</span>
              <Scale className="w-4 h-4 text-blue-500" />
            </div>
            <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-1000" 
                style={{ width: `${complianceScore}%` }}
              />
            </div>
            <div className="mt-2 text-right mono text-xl font-bold text-white">
              {complianceScore}/100
            </div>
          </div>
        </div>

        {/* Console Log */}
        <div className="lg:col-span-2 bg-black rounded-xl border border-zinc-800 p-4 font-mono text-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-6 bg-zinc-900 flex items-center px-2 gap-1 border-b border-zinc-800">
                <Terminal className="w-3 h-3 text-zinc-500" />
                <span className="text-xs text-zinc-500">internal_monologue.log</span>
            </div>
            <div className="mt-4 space-y-2 h-48 overflow-y-auto pr-2 custom-scrollbar">
                {internalMonologue.length > 0 ? (
                  internalMonologue.map((line, i) => (
                      <div key={i} className="flex gap-2">
                          <span className="text-zinc-600 select-none">{`>`}</span>
                          <span className="text-green-400/90">{line}</span>
                      </div>
                  ))
                ) : (
                  <div className="text-zinc-700 italic flex gap-2">
                     <span className="text-zinc-600 select-none">{`>`}</span>
                     <span>等待思維鏈資料...</span>
                  </div>
                )}
            </div>
        </div>
      </div>

      {/* Conflicts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {conflicts.length > 0 ? (
            conflicts.map((conflict, idx) => (
               <div key={idx} className="bg-zinc-900/80 border border-zinc-700/50 p-4 rounded-lg">
                  <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1">偵測到衝突</div>
                  <div className="font-bold text-white text-lg mb-2">{conflict.aspect}</div>
                  <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-zinc-400">勝出者：</span>
                      <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-sm font-medium border border-indigo-500/30">
                          {conflict.winner}
                      </span>
                  </div>
                  <p className="text-sm text-zinc-400 italic">"{conflict.reasoning}"</p>
               </div> 
            ))
          ) : (
             <div className="col-span-full text-center p-6 text-zinc-500 italic border border-zinc-800 rounded-lg border-dashed">
                未偵測到明顯的內部指令衝突。
             </div>
          )}
      </div>
    </div>
  );
};