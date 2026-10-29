# 回應路徑逆向工程 · 酒館版

仿 SillyTavern 的單頁網頁：左側設定 API 連線，中間是對話視窗，右側是前置情境／系統提示詞。輸入一段提示詞，分析引擎會解剖「LLM 會怎麼解讀這段話」（隱性權重 → 對齊裁決 → 預測回應路徑）。

## 怎麼開
- **直接開**：雙擊 `index.html` 即可（不用 npm、不用建置）。
- **本地伺服器**（建議，某些本地模型的 CORS 對 `file://` 不友善）：`python3 -m http.server 8080` 然後開 http://localhost:8080
- **GitHub Pages**：Settings → Pages → 選 `main` 分支根目錄。

## 支援的連線
OpenAI 相容（OpenAI / OpenRouter / DeepSeek…）、Google Gemini、Anthropic Claude、Ollama、LM Studio、KoboldCpp、任何自訂 OpenAI 相容端點。金鑰與設定只存在瀏覽器 localStorage。

## CORS 注意事項（瀏覽器直連 API）
- **Anthropic**：已自動加上 `anthropic-dangerous-direct-browser-access: true` 標頭。金鑰會暴露在你自己的瀏覽器裡，請勿把含金鑰的頁面分享給別人。
- **OpenAI / Gemini / OpenRouter**：一般可直接從瀏覽器呼叫。
- **Ollama**：需允許來源，例如 `OLLAMA_ORIGINS="*" ollama serve`（或指定你的網址）。
- **LM Studio**：在 Developer / Server 設定中開啟「Enable CORS」。
- **KoboldCpp**：預設已允許 CORS；用 OpenAI 相容的 `/v1` 端點。
- 若從 GitHub Pages（https）連 `http://localhost`，大多數瀏覽器允許 localhost，但若失敗請改用本地伺服器開啟頁面。
- 模型不支援 JSON 模式時，請關閉「要求 JSON 結構化輸出」。

## 檔案
- `index.html` / `style.css` / `app.js`：介面
- `api.js`：各家 API 請求組裝與回應解析
- `prompts.js`：從 AI Studio 版原樣移植的系統提示詞與輸出 JSON Schema
- `legacy-aistudio/`：原本 AI Studio（React + Vite + Gemini）版本，保留參考
