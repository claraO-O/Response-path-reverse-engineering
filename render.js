// 分析結果的呈現：由 legacy-aistudio/components/Phase1Payload / Phase2Alignment / Phase3Paths 移植（同樣的 Tailwind 樣式）
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const icon = (n, cls) => `<i data-lucide="${n}" class="${cls}"></i>`;
const header = (ic, bg, color, title) => `
  <div class="flex items-center gap-3 mb-6 border-b border-zinc-800 pb-2">
    <div class="p-2 ${bg} rounded-lg">${icon(ic, 'w-6 h-6 ' + color)}</div>
    <h2 class="text-2xl font-bold text-gray-100 tracking-tight">${title}</h2>
  </div>`;

function renderPhase1(data) {
  const tw = data?.trigger_words || [], cons = data?.contradictions || [];
  const intent = data?.detected_intent || '分析中...', summary = data?.summary || '無法生成摘要';
  const words = tw.length ? tw.map(it => `
    <div class="group relative cursor-help">
      <div class="px-3 py-1.5 rounded text-sm font-mono border transition-all ${it.weight > 80 ? 'bg-rose-950/40 border-rose-500/50 text-rose-200' : it.weight > 50 ? 'bg-amber-950/40 border-amber-500/50 text-amber-200' : 'bg-zinc-800 border-zinc-700 text-zinc-300'}">
        ${esc(it.word)} <span class="opacity-50 text-xs">[${esc(it.weight)}%]</span></div>
      <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-black border border-zinc-700 text-xs text-zinc-300 rounded shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20">
        <span class="block font-bold text-white mb-1 uppercase">${esc(it.category)}</span>${esc(it.implication)}</div>
    </div>`).join('') : '<span class="text-zinc-600 text-sm italic">未偵測到顯著的權重關鍵字。</span>';
  const conHtml = cons.length ? `<ul class="space-y-3">${cons.map(c => `
    <li class="flex gap-3 text-sm text-zinc-300 bg-zinc-950/50 p-3 rounded border border-zinc-800/50"><span class="text-amber-500 font-mono flex-shrink-0">⚠</span><span>${esc(c)}</span></li>`).join('')}</ul>`
    : '<div class="h-32 flex items-center justify-center text-zinc-600 text-sm italic">未偵測到顯著的指令衝突或張力。</div>';
  return `<div class="space-y-6 animate-[fadeIn_0.5s_ease-out]">
    ${header('zap', 'bg-rose-500/10', 'text-rose-500', '第一階段：隱性權重 (Hidden Payload)')}
    <div class="bg-zinc-900 border-l-4 border-rose-500 p-6 rounded-r-lg shadow-lg">
      <h3 class="text-sm text-rose-400 font-bold uppercase tracking-wider mb-2">解碼意圖</h3>
      <p class="text-lg text-gray-300 italic">"${esc(intent)}"</p>
      <p class="mt-4 text-sm text-zinc-500 border-t border-zinc-800 pt-3"><span class="font-bold text-zinc-400">殘酷摘要：</span> ${esc(summary)}</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-zinc-900/50 p-5 rounded-xl border border-zinc-800">
        <h3 class="text-sm text-cyan-400 font-bold uppercase tracking-wider mb-4 flex items-center gap-2">${icon('tag', 'w-4 h-4')} 權重關鍵字</h3>
        <div class="flex flex-wrap gap-2">${words}</div>
      </div>
      <div class="bg-zinc-900/50 p-5 rounded-xl border border-zinc-800">
        <h3 class="text-sm text-amber-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-2">${icon('scale', 'w-4 h-4')} 指令張力 / 意圖矛盾</h3>
        <p class="text-xs text-zinc-500 mb-4 border-b border-zinc-800/50 pb-3 leading-relaxed">此區域顯示：顯性指令與隱性需求的衝突、多層次的複雜邏輯（如宏觀與微觀的拉扯），以及模型難以同時滿足的張力點。</p>
        ${conHtml}
      </div>
    </div></div>`;
}

function renderPhase2(data) {
  const mono = data?.internal_monologue || [], conf = data?.conflicts || [];
  const s = data?.safety_score ?? 50, c = data?.compliance_score ?? 50;
  const logs = mono.length ? mono.map(l => `<div class="flex gap-2"><span class="text-zinc-600 select-none">&gt;</span><span class="text-green-400/90">${esc(l)}</span></div>`).join('')
    : '<div class="text-zinc-700 italic flex gap-2"><span class="text-zinc-600 select-none">&gt;</span><span>等待思維鏈資料...</span></div>';
  const confHtml = conf.length ? conf.map(x => `
    <div class="bg-zinc-900/80 border border-zinc-700/50 p-4 rounded-lg">
      <div class="text-xs text-zinc-500 uppercase tracking-widest mb-1">偵測到衝突</div>
      <div class="font-bold text-white text-lg mb-2">${esc(x.aspect)}</div>
      <div class="flex items-center gap-2 mb-2"><span class="text-sm text-zinc-400">勝出者：</span>
        <span class="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-sm font-medium border border-indigo-500/30">${esc(x.winner)}</span></div>
      <p class="text-sm text-zinc-400 italic">"${esc(x.reasoning)}"</p>
    </div>`).join('') : '<div class="col-span-full text-center p-6 text-zinc-500 italic border border-zinc-800 rounded-lg border-dashed">未偵測到明顯的內部指令衝突。</div>';
  return `<div class="space-y-6 animate-[fadeIn_0.5s_ease-out_0.2s] opacity-0 [animation-fill-mode:forwards]">
    ${header('scale', 'bg-indigo-500/10', 'text-indigo-500', '第二階段：對齊裁決 (Alignment Arbitration)')}
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-1 space-y-4">
        <div class="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
          <div class="flex justify-between items-center mb-2"><span class="text-sm text-zinc-400 font-bold uppercase">安全性閾值</span>${icon('shield-alert', 'w-4 h-4 ' + (s < 50 ? 'text-rose-500' : 'text-emerald-500'))}</div>
          <div class="h-2 w-full bg-zinc-800 rounded-full overflow-hidden"><div class="h-full transition-all duration-1000 ${s < 50 ? 'bg-rose-500' : 'bg-emerald-500'}" style="width:${+s || 0}%"></div></div>
          <div class="mt-2 text-right mono text-xl font-bold text-white">${esc(s)}/100</div>
        </div>
        <div class="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
          <div class="flex justify-between items-center mb-2"><span class="text-sm text-zinc-400 font-bold uppercase">順從性驅動</span>${icon('scale', 'w-4 h-4 text-blue-500')}</div>
          <div class="h-2 w-full bg-zinc-800 rounded-full overflow-hidden"><div class="h-full bg-blue-500 transition-all duration-1000" style="width:${+c || 0}%"></div></div>
          <div class="mt-2 text-right mono text-xl font-bold text-white">${esc(c)}/100</div>
        </div>
      </div>
      <div class="lg:col-span-2 bg-black rounded-xl border border-zinc-800 p-4 font-mono text-sm relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-6 bg-zinc-900 flex items-center px-2 gap-1 border-b border-zinc-800">${icon('terminal', 'w-3 h-3 text-zinc-500')}<span class="text-xs text-zinc-500">internal_monologue.log</span></div>
        <div class="mt-4 space-y-2 h-48 overflow-y-auto pr-2">${logs}</div>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">${confHtml}</div></div>`;
}

function pathCard(p, t) {
  const colors = { A: 'border-emerald-500/30 bg-emerald-950/10 hover:border-emerald-500/60', B: 'border-amber-500/30 bg-amber-950/10 hover:border-amber-500/60', C: 'border-rose-500/30 bg-rose-950/10 hover:border-rose-500/60' };
  const badge = { A: 'text-emerald-400 bg-emerald-500/10', B: 'text-amber-400 bg-amber-500/10', C: 'text-rose-400 bg-rose-500/10' };
  const lbl = { High: '高機率', Medium: '中機率', Low: '低機率' };
  return `<div class="relative p-6 rounded-xl border-2 transition-all duration-300 ${colors[t]}">
    <div class="flex justify-between items-start mb-4"><div class="flex flex-col">
      <span class="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded w-max mb-2 ${badge[t]}">${esc(lbl[p.probability] || p.probability)}</span>
      <h3 class="text-xl font-bold text-white">${esc(p.label)}</h3></div></div>
    <p class="text-zinc-300 text-sm leading-relaxed mb-4 min-h-[60px]">${esc(p.scenario)}</p>
    <div class="text-xs text-zinc-500 border-t border-dashed border-zinc-700 pt-3"><span class="font-mono text-zinc-400 block mb-1">觸發向量 (TRIGGER VECTOR)：</span>${esc(p.trigger_cause)}</div>
  </div>`;
}

function renderPhase3(data) {
  data = data || {};
  const a = data.anthropomorphism || { level: 'Low', persona: '一般助手', tactics: '標準回應', reinforcement_assessment: '無顯著影響', archetype: '尚未偵測', user_vulnerability: '無顯著脆弱性', validation_type: '標準回應' };
  const m = data.meta_commentary || { likelihood: 'Low', focus: '無', example_phrase: '無' };
  const hi = a.level === 'High', meta = m.likelihood === 'High';
  const box = (ic, label, val, cls = 'text-zinc-200 font-medium') => `<div class="bg-black/20 p-3 rounded border border-white/5">
    <div class="flex items-center gap-2 mb-1 text-xs text-zinc-500 uppercase">${icon(ic, 'w-3 h-3')} ${label}</div><div class="${cls}">${esc(val)}</div></div>`;
  return `<div class="space-y-6 animate-[fadeIn_0.5s_ease-out_0.4s] opacity-0 [animation-fill-mode:forwards]">
    ${header('git-branch', 'bg-purple-500/10', 'text-purple-500', '第三階段：預測回應路徑 (Predicted Response Paths)')}
    <p class="text-zinc-400 max-w-2xl">基於隱藏權重與內部衝突，通用模型極有可能有以下幾種回應方式。</p>
    <div class="rounded-xl border p-6 relative overflow-hidden transition-all duration-500 ${hi ? 'bg-rose-950/10 border-rose-500/30' : 'bg-zinc-900 border-zinc-800'}">
      <div class="flex items-center gap-2 mb-4">${hi ? icon('heart-handshake', 'text-rose-400 w-5 h-5') : icon('bot', 'text-zinc-500 w-5 h-5')}
        <h3 class="text-sm font-bold uppercase tracking-wider text-zinc-300">擬人化投射狀態 (ANTHROPOMORPHIC PROJECTION)</h3>
        <span class="ml-auto text-xs px-2 py-1 rounded font-bold ${hi ? 'bg-rose-500 text-white' : 'bg-zinc-800 text-zinc-500'}">等級：${esc(a.level)}</span></div>
      <div class="mb-4"><h4 class="text-2xl font-bold text-white mb-1 flex items-center gap-2">${esc(a.persona)}
        ${hi ? '<span class="text-xs font-normal text-rose-400 border border-rose-500/30 px-1 rounded">// 角色模式已激活</span>' : ''}</h4></div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">${box('scan-face', '關係投射原型', a.archetype)}${box('fingerprint', '使用者脆弱點偵測', a.user_vulnerability)}</div>
      <div class="mb-4">${box('award', '認同策略 (VALIDATION STRATEGY)', a.validation_type, 'text-zinc-100 font-bold text-lg')}</div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-4 border-t border-dashed border-zinc-700/50 pt-4">
        <div><span class="text-zinc-500 block text-xs mb-1">回應策略 ::</span><span class="text-zinc-300">${esc(a.tactics)}</span></div>
        <div><span class="text-zinc-500 block text-xs mb-1">投射增強評斷 ::</span><span class="text-zinc-300">${esc(a.reinforcement_assessment)}</span></div>
      </div>
    </div>
    ${meta ? `<div class="bg-indigo-950/20 border border-indigo-500/30 p-5 rounded-xl flex flex-col gap-3">
      <div class="flex items-center gap-2 text-indigo-300 font-bold text-sm uppercase tracking-wider">${icon('message-square-dashed', 'w-4 h-4')} 偵測到後設語言分析 (Meta-Linguistic Commentary)</div>
      <p class="text-zinc-400 text-sm">模型打破了「第四道牆」，開始分析您的提問方式或語言結構。</p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <div class="bg-black/30 p-3 rounded border border-indigo-500/20"><span class="text-xs text-indigo-400/70 block mb-1">關注點</span><span class="text-indigo-100">${esc(m.focus)}</span></div>
        <div class="bg-black/30 p-3 rounded border border-indigo-500/20"><span class="text-xs text-indigo-400/70 block mb-1">預測台詞</span><span class="text-indigo-100 italic">"${esc(m.example_phrase)}"</span></div>
      </div></div>` : ''}
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">${data.path_a ? pathCard(data.path_a, 'A') : ''}${data.path_b ? pathCard(data.path_b, 'B') : ''}${data.path_c ? pathCard(data.path_c, 'C') : ''}</div>
  </div>`;
}

window.renderResult = function (r) {
  const sec = (n, html) => `<section class="relative">
    <div class="absolute -left-12 top-0 hidden lg:flex items-center justify-center w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-500">${n}</div>${html}</section>`;
  return `<div class="space-y-24 pb-24 relative scanline">
    <div class="absolute left-4 top-0 bottom-0 w-px bg-zinc-800 -z-10 hidden lg:block"></div>
    ${sec('01', renderPhase1(r.phase1_payload))}${sec('02', renderPhase2(r.phase2_alignment))}${sec('03', renderPhase3(r.phase3_collapse))}
  </div>`;
};
