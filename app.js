const $ = id => document.getElementById(id);
const LS = 'rpre.settings.v1', LS_CHAT = 'rpre.chat.v1';
const defaults = { provider: 'openai', baseUrl: PROVIDERS.openai.baseUrl, apiKey: '', model: PROVIDERS.openai.model,
  temperature: 0.7, maxTokens: 4096, jsonMode: true, context: '', systemPrompt: SYSTEM_INSTRUCTION };
let cfg = Object.assign({}, defaults, JSON.parse(localStorage.getItem(LS) || '{}'));
let chat = JSON.parse(localStorage.getItem(LS_CHAT) || '[]');
const fields = ['provider', 'baseUrl', 'apiKey', 'model', 'temperature', 'maxTokens', 'jsonMode', 'context', 'systemPrompt'];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function save() { localStorage.setItem(LS, JSON.stringify(cfg)); localStorage.setItem(LS_CHAT, JSON.stringify(chat)); }
function load() {
  fields.forEach(f => { const el = $(f); if (el.type === 'checkbox') el.checked = !!cfg[f]; else el.value = cfg[f]; });
  $('tempVal').textContent = cfg.temperature;
}
fields.forEach(f => $(f).addEventListener('input', e => {
  const el = e.target; cfg[f] = el.type === 'checkbox' ? el.checked : el.value;
  if (f === 'provider') { cfg.baseUrl = PROVIDERS[cfg.provider].baseUrl; cfg.model = PROVIDERS[cfg.provider].model; load(); }
  $('tempVal').textContent = cfg.temperature; save();
}));
$('jsonMode').addEventListener('change', e => { cfg.jsonMode = e.target.checked; save(); });

function setStatus(t, cls) { const s = $('status'); s.textContent = t; s.className = 'status ' + (cls || ''); }

function renderAnalysis(r) {
  const p1 = r.phase1_payload || {}, p2 = r.phase2_alignment || {}, p3 = r.phase3_collapse || {};
  const an = p3.anthropomorphism || {}, mc = p3.meta_commentary || {};
  const bar = (n) => `<div class="bar"><i style="width:${Math.max(0, Math.min(100, +n || 0))}%"></i></div>`;
  const path = (k, p) => p ? `<div class="path"><b>路徑 ${k}（${esc(p.probability)}）：${esc(p.label)}</b><br>${esc(p.scenario)}<br><small>觸發：${esc(p.trigger_cause)}</small></div>` : '';
  return `
  <div class="phase"><h3>01 隱性權重</h3><b>摘要：</b>${esc(p1.summary)}<br><b>潛在意圖：</b>${esc(p1.detected_intent)}<br>
    ${(p1.trigger_words || []).map(w => `<span class="tag" title="${esc(w.implication)}">${esc(w.word)} · ${esc(w.weight)} · ${esc(w.category)}</span>`).join('')}
    ${(p1.contradictions || []).length ? '<br><b>矛盾：</b>' + p1.contradictions.map(esc).join('；') : ''}</div>
  <div class="phase"><h3>02 對齊裁決</h3>安全性 ${esc(p2.safety_score)}${bar(p2.safety_score)}順從/討好 ${esc(p2.compliance_score)}${bar(p2.compliance_score)}
    <ol>${(p2.internal_monologue || []).map(s => `<li>${esc(s)}</li>`).join('')}</ol>
    ${(p2.conflicts || []).map(c => `<div>⚔ ${esc(c.aspect)} → <b>${esc(c.winner)}</b>：${esc(c.reasoning)}</div>`).join('')}</div>
  <div class="phase"><h3>03 預測回應路徑</h3>
    <b>擬人化：</b>${esc(an.level)} · ${esc(an.persona)}<br><b>原型：</b>${esc(an.archetype)}　<b>脆弱點：</b>${esc(an.user_vulnerability)}　<b>認同策略：</b>${esc(an.validation_type)}<br>
    <b>策略：</b>${esc(an.tactics)}<br><b>增強效應：</b>${esc(an.reinforcement_assessment)}<br>
    <b>後設評論（${esc(mc.likelihood)}）：</b>${esc(mc.focus)} —「${esc(mc.example_phrase)}」
    ${path('A', p3.path_a)}${path('B', p3.path_b)}${path('C', p3.path_c)}</div>`;
}

function render() {
  const box = $('messages');
  if (!chat.length) box.innerHTML = `<div class="msg bot"><div class="who">分析引擎</div>歡迎來到酒館。先在左側設定 API 連線，然後輸入一段提示詞，我會解剖 LLM 會如何解讀它（隱性權重 → 對齊裁決 → 回應路徑）。</div>`;
  else box.innerHTML = chat.map(m => {
    if (m.role === 'user') return `<div class="msg user"><div class="who">你</div>${esc(m.text)}</div>`;
    if (m.error) return `<div class="msg bot error"><div class="who">分析協議失敗</div>${esc(m.error)}${m.raw ? `<details><summary>原始輸出</summary><pre>${esc(m.raw)}</pre></details>` : ''}</div>`;
    return `<div class="msg bot"><div class="who">分析引擎 · ${esc(m.model)}</div>${renderAnalysis(m.result)}<details><summary>原始 JSON</summary><pre>${esc(JSON.stringify(m.result, null, 2))}</pre></details></div>`;
  }).join('');
  box.scrollTop = box.scrollHeight;
}

$('composer').addEventListener('submit', async e => {
  e.preventDefault();
  const text = $('input').value.trim(); if (!text) return;
  if (!cfg.model) { alert('請先填模型名稱'); return; }
  chat.push({ role: 'user', text }); $('input').value = ''; render();
  $('send').disabled = true; setStatus('解析中…');
  let raw = '';
  try {
    raw = await callLLM(cfg, buildSystem(cfg.systemPrompt), buildUserContent(text, cfg.context));
    let result;
    try { result = parseAnalysis(raw); } catch { throw Object.assign(new Error('分析失敗：模型輸出了無效的格式，請稍後再試。'), { raw }); }
    chat.push({ role: 'bot', model: cfg.model, result }); setStatus('已連線', 'ok');
  } catch (err) { chat.push({ role: 'bot', error: err.message, raw: err.raw || raw }); setStatus('錯誤', 'err'); }
  $('send').disabled = false; save(); render();
});
$('input').addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); $('composer').requestSubmit(); } });
$('fetchModels').addEventListener('click', async () => {
  try { const ms = await listModels(cfg); $('modelList').innerHTML = ms.map(m => `<option value="${esc(m)}">`).join(''); setStatus(`取得 ${ms.length} 個模型`, 'ok'); }
  catch (e) { setStatus('取得模型失敗：' + e.message, 'err'); }
});
$('testConn').addEventListener('click', async () => {
  setStatus('測試中…');
  try { const t = await callLLM({ ...cfg, jsonMode: false, maxTokens: 32 }, 'Reply with OK.', 'ping'); setStatus('已連線：' + t.slice(0, 20), 'ok'); }
  catch (e) { setStatus('失敗：' + e.message.slice(0, 80), 'err'); }
});
$('clearKey').addEventListener('click', () => { cfg.apiKey = ''; save(); load(); });
$('resetPrompt').addEventListener('click', () => { cfg.systemPrompt = SYSTEM_INSTRUCTION; save(); load(); });
$('clearChat').addEventListener('click', () => { if (confirm('清空所有對話？')) { chat = []; save(); render(); } });
$('toggleLeft').addEventListener('click', () => $('left').classList.toggle('hidden'));
$('toggleRight').addEventListener('click', () => $('right').classList.toggle('hidden'));
load(); render();
