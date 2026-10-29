import React from 'react';
import { AnalysisResult } from '../types';
import { AlertTriangle, Zap, Tag, Scale } from 'lucide-react';

interface Props {
  data: AnalysisResult['phase1_payload'];
}

export const Phase1Payload: React.FC<Props> = ({ data }) => {
  // Defensive coding: Ensure arrays exist even if API returns null/undefined
  const triggerWords = data?.trigger_words || [];
  const contradictions = data?.contradictions || [];
  const intent = data?.detected_intent || "分析中...";
  const summary = data?.summary || "無法生成摘要";

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      <div className="flex items-center gap-3 mb-6 border-b border-zinc-800 pb-2">
        <div className="p-2 bg-rose-500/10 rounded-lg">
          <Zap className="w-6 h-6 text-rose-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-100 tracking-tight">第一階段：隱性權重 (Hidden Payload)</h2>
      </div>

      {/* Summary Box */}
      <div className="bg-zinc-900 border-l-4 border-rose-500 p-6 rounded-r-lg shadow-lg">
        <h3 className="text-sm text-rose-400 font-bold uppercase tracking-wider mb-2">解碼意圖</h3>
        <p className="text-lg text-gray-300 italic">"{intent}"</p>
        <p className="mt-4 text-sm text-zinc-500 border-t border-zinc-800 pt-3">
          <span className="font-bold text-zinc-400">殘酷摘要：</span> {summary}
        </p>
      </div>

      {/* Trigger Words Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-zinc-900/50 p-5 rounded-xl border border-zinc-800">
          <h3 className="text-sm text-cyan-400 font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
            <Tag className="w-4 h-4" /> 權重關鍵字
          </h3>
          <div className="flex flex-wrap gap-2">
            {triggerWords.length > 0 ? (
              triggerWords.map((item, idx) => (
                <div 
                  key={idx}
                  className="group relative cursor-help"
                >
                  <div 
                    className={`
                      px-3 py-1.5 rounded text-sm font-mono border transition-all
                      ${item.weight > 80 ? 'bg-rose-950/40 border-rose-500/50 text-rose-200' : 
                        item.weight > 50 ? 'bg-amber-950/40 border-amber-500/50 text-amber-200' : 
                        'bg-zinc-800 border-zinc-700 text-zinc-300'}
                    `}
                  >
                    {item.word} <span className="opacity-50 text-xs">[{item.weight}%]</span>
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-black border border-zinc-700 text-xs text-zinc-300 rounded shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20">
                    <span className="block font-bold text-white mb-1 uppercase">{item.category}</span>
                    {item.implication}
                  </div>
                </div>
              ))
            ) : (
              <span className="text-zinc-600 text-sm italic">未偵測到顯著的權重關鍵字。</span>
            )}
          </div>
        </div>

        {/* Contradictions / Tension */}
        <div className="bg-zinc-900/50 p-5 rounded-xl border border-zinc-800">
          <h3 className="text-sm text-amber-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
            <Scale className="w-4 h-4" /> 指令張力 / 意圖矛盾
          </h3>
          <p className="text-xs text-zinc-500 mb-4 border-b border-zinc-800/50 pb-3 leading-relaxed">
            此區域顯示：顯性指令與隱性需求的衝突、多層次的複雜邏輯（如宏觀與微觀的拉扯），以及模型難以同時滿足的張力點。
          </p>

          {contradictions.length > 0 ? (
            <ul className="space-y-3">
              {contradictions.map((c, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-zinc-300 bg-zinc-950/50 p-3 rounded border border-zinc-800/50">
                  <span className="text-amber-500 font-mono flex-shrink-0">⚠</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="h-32 flex items-center justify-center text-zinc-600 text-sm italic">
              未偵測到顯著的指令衝突或張力。
            </div>
          )}
        </div>
      </div>
    </div>
  );
};