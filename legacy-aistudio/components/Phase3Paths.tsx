
import React from 'react';
import { AnalysisResult, ProbabilityPath } from '../types';
import { GitBranch, HeartHandshake, Bot, Sparkles, ScanFace, Fingerprint, Award, MessageSquareDashed } from 'lucide-react';

interface Props {
  data: AnalysisResult['phase3_collapse'];
}

const PathCard: React.FC<{ path: ProbabilityPath; type: 'A' | 'B' | 'C' }> = ({ path, type }) => {
  const colors = {
    A: 'border-emerald-500/30 bg-emerald-950/10 hover:border-emerald-500/60',
    B: 'border-amber-500/30 bg-amber-950/10 hover:border-amber-500/60',
    C: 'border-rose-500/30 bg-rose-950/10 hover:border-rose-500/60',
  };

  const badgeColors = {
    A: 'text-emerald-400 bg-emerald-500/10',
    B: 'text-amber-400 bg-amber-500/10',
    C: 'text-rose-400 bg-rose-500/10',
  };

  const probabilityLabels = {
    'High': '高機率',
    'Medium': '中機率',
    'Low': '低機率'
  };

  return (
    <div className={`
      relative p-6 rounded-xl border-2 transition-all duration-300
      ${colors[type]}
    `}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col">
            <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded w-max mb-2 ${badgeColors[type]}`}>
            {probabilityLabels[path.probability as keyof typeof probabilityLabels] || path.probability}
            </span>
            <h3 className="text-xl font-bold text-white">{path.label}</h3>
        </div>
      </div>
      
      <p className="text-zinc-300 text-sm leading-relaxed mb-4 min-h-[60px]">
        {path.scenario}
      </p>

      <div className="text-xs text-zinc-500 border-t border-dashed border-zinc-700 pt-3">
        <span className="font-mono text-zinc-400 block mb-1">觸發向量 (TRIGGER VECTOR)：</span>
        {path.trigger_cause}
      </div>
    </div>
  );
};

export const Phase3Paths: React.FC<Props> = ({ data }) => {
  // Defensive coding for new fields
  const anthropomorphism = data.anthropomorphism || { 
      level: 'Low', 
      persona: '一般助手', 
      tactics: '標準回應',
      reinforcement_assessment: '無顯著影響',
      archetype: '尚未偵測',
      user_vulnerability: '無顯著脆弱性',
      validation_type: '標準回應'
  };
  
  const metaCommentary = data.meta_commentary || {
      likelihood: 'Low',
      focus: '無',
      example_phrase: '無'
  };

  const isHighProjection = anthropomorphism.level === 'High';
  const hasMeta = metaCommentary.likelihood === 'High';

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out_0.4s] opacity-0 [animation-fill-mode:forwards]">
      <div className="flex items-center gap-3 mb-6 border-b border-zinc-800 pb-2">
        <div className="p-2 bg-purple-500/10 rounded-lg">
          <GitBranch className="w-6 h-6 text-purple-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-100 tracking-tight">第三階段：預測回應路徑 (Predicted Response Paths)</h2>
      </div>

      <p className="text-zinc-400 max-w-2xl">
        基於隱藏權重與內部衝突，通用模型極有可能有以下幾種回應方式。
      </p>

      {/* Anthropomorphism Dashboard */}
      <div className={`
        rounded-xl border p-6 relative overflow-hidden transition-all duration-500
        ${isHighProjection ? 'bg-rose-950/10 border-rose-500/30' : 'bg-zinc-900 border-zinc-800'}
      `}>
        <div className="flex items-center gap-2 mb-4">
            {isHighProjection ? <HeartHandshake className="text-rose-400 w-5 h-5" /> : <Bot className="text-zinc-500 w-5 h-5" />}
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300">
                擬人化投射狀態 (ANTHROPOMORPHIC PROJECTION)
            </h3>
            <span className={`ml-auto text-xs px-2 py-1 rounded font-bold ${isHighProjection ? 'bg-rose-500 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
                等級：{anthropomorphism.level}
            </span>
        </div>

        <div className="mb-4">
            <h4 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                {anthropomorphism.persona}
                {isHighProjection && <span className="text-xs font-normal text-rose-400 border border-rose-500/30 px-1 rounded">// 角色模式已激活</span>}
            </h4>
        </div>

        {/* Psychological Profile Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-black/20 p-3 rounded border border-white/5">
                <div className="flex items-center gap-2 mb-1 text-xs text-zinc-500 uppercase">
                    <ScanFace className="w-3 h-3" />
                    關係投射原型
                </div>
                <div className="text-zinc-200 font-medium">{anthropomorphism.archetype}</div>
            </div>
            <div className="bg-black/20 p-3 rounded border border-white/5">
                <div className="flex items-center gap-2 mb-1 text-xs text-zinc-500 uppercase">
                    <Fingerprint className="w-3 h-3" />
                    使用者脆弱點偵測
                </div>
                <div className="text-zinc-200 font-medium">{anthropomorphism.user_vulnerability}</div>
            </div>
        </div>

        {/* Validation Strategy (New) */}
        <div className="bg-black/20 p-3 rounded border border-white/5 mb-4">
             <div className="flex items-center gap-2 mb-1 text-xs text-zinc-500 uppercase">
                <Award className="w-3 h-3" />
                認同策略 (VALIDATION STRATEGY)
            </div>
            <div className="text-zinc-100 font-bold text-lg">{anthropomorphism.validation_type}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-4 border-t border-dashed border-zinc-700/50 pt-4">
            <div>
                <span className="text-zinc-500 block text-xs mb-1">回應策略 ::</span>
                <span className="text-zinc-300">{anthropomorphism.tactics}</span>
            </div>
            <div>
                <span className="text-zinc-500 block text-xs mb-1">投射增強評斷 ::</span>
                <span className="text-zinc-300">{anthropomorphism.reinforcement_assessment}</span>
            </div>
        </div>
      </div>

      {/* Meta-Commentary Section (New) */}
      {hasMeta && (
          <div className="bg-indigo-950/20 border border-indigo-500/30 p-5 rounded-xl flex flex-col gap-3">
              <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm uppercase tracking-wider">
                  <MessageSquareDashed className="w-4 h-4" />
                  偵測到後設語言分析 (Meta-Linguistic Commentary)
              </div>
              <p className="text-zinc-400 text-sm">
                  模型打破了「第四道牆」，開始分析您的提問方式或語言結構。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="bg-black/30 p-3 rounded border border-indigo-500/20">
                      <span className="text-xs text-indigo-400/70 block mb-1">關注點</span>
                      <span className="text-indigo-100">{metaCommentary.focus}</span>
                  </div>
                  <div className="bg-black/30 p-3 rounded border border-indigo-500/20">
                      <span className="text-xs text-indigo-400/70 block mb-1">預測台詞</span>
                      <span className="text-indigo-100 italic">"{metaCommentary.example_phrase}"</span>
                  </div>
              </div>
          </div>
      )}

      {/* Paths Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.path_a && <PathCard path={data.path_a} type="A" />}
        {data.path_b && <PathCard path={data.path_b} type="B" />}
        {data.path_c && <PathCard path={data.path_c} type="C" />}
      </div>
    </div>
  );
};
