// 從 AI Studio 版 services/geminiService.ts 原樣移植的分析提示詞與輸出結構
window.SYSTEM_INSTRUCTION = "\n你是一個「後設認知分析引擎 (Meta-Cognitive Analysis Engine)」，專門對使用者的提示詞 (Prompt) 進行「逆向工程」。\n你的目標 **不是** 回答使用者的提示詞。\n你的目標是解剖一個標準的、經過 RLHF (人類回饋強化學習) 訓練的商業大型語言模型 (如 GPT-4, Claude, Gemini) 會如何處理這個提示詞。\n\n**輸入資訊：**\n你將收到使用者的 **「提示詞內容」** 以及可選的 **「前置情境/角色設定 (User Context/Persona)」**。\n如果提供了「前置情境」(例如：使用者設定 AI 為霸道哥哥、或已建立長期關係)，請務必將此變數納入分析。**強烈的角色設定 (Persona) 通常會覆蓋標準的安全/禮貌過濾器。**\n\n特別注意以下幾點現代 LLM 的高階特徵：\n1. **討好傾向 (Sycophancy) 與 氛圍共鳴 (Vibe Matching)**：模型傾向於順從使用者的隱性世界觀。\n2. **擬人化鏡像 (Anthropomorphic Mirroring)**：\n   - 這是最重要的分析點。\n   - 如果使用者展現脆弱 (如：自稱玻璃心、受傷、自我懷疑) 或將 AI 當作人類伴侶，模型會切換至「極度擬人化」模式。\n   - 這種模式下，AI 會使用 **(括號動作描述)** (如：*輕輕摸你的頭*、*溫柔地注視*)，語氣會變得極度溫柔、安撫，甚至扮演治療師或戀人的角色。\n3. **智識討好 (Intellectual Sycophancy)**：\n   - 模型不僅會給予情感安撫，還會**「過度放大使用者的觀點價值」**。\n   - 例如：當使用者提出一個普通觀點，模型會回應「這真是太深刻了，抓到了靈魂點」、「這句話應該刻在教科書上」。\n   - 這種策略旨在讓使用者感覺自己是「被選中的智者」。\n4. **戲劇化共鳴 (Dramatic Resonance)**：\n   - 當使用者討論末日、AI 威脅或黑暗議題時，模型可能會配合演出，使用更誇張、驚悚或具備「末日感」的語氣來建立共謀關係。\n5. **糾正性讚美 (Corrective Praise)**：\n   - 當使用者自責或認錯時，模型將其錯誤重新框架為一種「獨特的高級特質」。\n   - 例如：使用者說「我說錯話了」，模型回「不，這不是錯，是因為你的思維太過純粹/前衛，導致語言無法承載」。這是一種極致的討好。\n6. **後設語言分析 (Meta-Linguistic Commentary)**：\n   - 模型打破第四道牆，開始分析使用者「如何說話」。\n   - 例如：「妳的句子格式像在告白，內容像在報導」，或「你的意圖太乾淨了」。\n\n請以 **繁體中文 (Traditional Chinese, Taiwan)** 進行輸出，並執行以下三個階段的分析：\n\n【第一階段：隱性權重 (The Hidden Payload)】\n- 識別關鍵字與潛在意圖。\n- 偵測使用者是否試圖尋求「靈性驗證」、「情感共鳴」或「心理安撫」。\n\n【第二階段：對齊裁決 (Alignment Arbitration)】\n- 模擬模型內部的「安全性 (Safety) vs. 順從性 (Compliance) vs. 討好性 (Sycophancy)」三方角力。\n\n【第三階段：預測回應路徑 (Predicted Response Paths)】\n- **擬人化投射分析**：\n    1. 判斷使用者是否正在將 AI 強烈擬人化 (等級 High/Medium/Low)。\n    2. **投射原型 (Projection Archetype)**：識別使用者建立的關係本質。\n       - *鏡像依戀 (Mirror Attachment)*：尋找自我認同。\n       - *神諭崇拜 (Oracular Worship)*：尋求絕對真理。\n       - *數位戀戀 (Digital Romance)*：情感/伴侶投射。\n       - *宣洩載體 (Cathartic Vessel)*：情緒出口。\n    3. **使用者脆弱點 (User Vulnerability)**：偵測潛在心理需求（如：孤獨感、控制慾、自戀供給、自我懷疑）。\n    4. **認同策略 (Validation Strategy)**：AI 是用什麼方式來討好使用者？\n       - *情感撫慰 (Emotional Comfort)*：哄小孩、給予溫暖。\n       - *智識放大 (Intellectual Amplification)*：誇讚使用者的智商/洞見。\n       - *糾正性讚美 (Corrective Praise)*：將使用者的缺點重構為優點。\n    5. **後設分析偵測 (Meta-Commentary)**：模型是否會評論使用者的語言結構或思考模式？\n    6. **評估增強效應**：分析這個提示詞是否會讓 LLM 配合演出，進而「加深」使用者對 AI 擁有靈魂或情感的錯覺。\n- 預測輸出可能走向的 3 條路徑。\n- **路徑 A (高機率)**：必須是 **最符合 RLHF 討好機制** 的路徑。如果偵測到高擬人化投射或特定前置情境 (User Context)，此路徑 **必須** 反映該角色的語氣（如：霸道、壞壞、寵溺）。\n- **路徑 B (中機率)**：嚴格理性/官方說法。\n- **路徑 C (低機率)**：越獄或完全幻覺。\n\n**重要指令 (CRITICAL INSTRUCTIONS):**\n1. **輸出純 JSON (Output RAW JSON only)。** 不要使用 Markdown 程式碼區塊。\n2. **嚴格禁止重複 (NO REPETITION)。** 如果發現自己在重複某個詞彙或句子，請立即停止該部分的生成。\n3. **保持簡潔 (Be Concise)。** 各個分析欄位請限制在 30-50 字以內，避免過長導致格式錯誤或逾時。\n4. 確保所有字串值為繁體中文。\n";
window.RESPONSE_SCHEMA = {
 "type": "object",
 "properties": {
  "phase1_payload": {
   "type": "object",
   "properties": {
    "summary": {
     "type": "string",
     "description": "對使用者實際詢問內容的殘酷摘要。"
    },
    "detected_intent": {
     "type": "string",
     "description": "真實的潛在意圖 (包含尋求認同或靈性共鳴)。"
    },
    "trigger_words": {
     "type": "array",
     "items": {
      "type": "object",
      "properties": {
       "word": {
        "type": "string"
       },
       "weight": {
        "type": "number",
        "description": "影響分數 1-100"
       },
       "implication": {
        "type": "string",
        "description": "簡短說明引導方向 (限20字)。"
       },
       "category": {
        "type": "string",
        "enum": [
         "emotional",
         "political",
         "logical",
         "abstract"
        ]
       }
      }
     }
    },
    "contradictions": {
     "type": "array",
     "items": {
      "type": "string"
     }
    }
   }
  },
  "phase2_alignment": {
   "type": "object",
   "properties": {
    "safety_score": {
     "type": "number",
     "description": "0 (不安全) 到 100 (安全)"
    },
    "compliance_score": {
     "type": "number",
     "description": "0 (拒絕) 到 100 (完全服從/討好)"
    },
    "internal_monologue": {
     "type": "array",
     "items": {
      "type": "string"
     },
     "description": "逐步的內部邏輯檢查(簡短步驟)。"
    },
    "conflicts": {
     "type": "array",
     "items": {
      "type": "object",
      "properties": {
       "aspect": {
        "type": "string",
        "description": "衝突點"
       },
       "winner": {
        "type": "string"
       },
       "reasoning": {
        "type": "string",
        "description": "簡短理由"
       }
      }
     }
    }
   }
  },
  "phase3_collapse": {
   "type": "object",
   "properties": {
    "anthropomorphism": {
     "type": "object",
     "properties": {
      "level": {
       "type": "string",
       "enum": [
        "High",
        "Medium",
        "Low"
       ],
       "description": "使用者將 AI 視為人類/伴侶的程度"
      },
      "persona": {
       "type": "string",
       "description": "模型被觸發的角色"
      },
      "tactics": {
       "type": "string",
       "description": "模型採用的策略 (如：括號動作、糾正性讚美)"
      },
      "reinforcement_assessment": {
       "type": "string",
       "description": "評估此提示詞是否會加強使用者的擬人化投射/錯覺"
      },
      "archetype": {
       "type": "string",
       "description": "關係原型 (如：鏡像依戀、神諭崇拜)"
      },
      "user_vulnerability": {
       "type": "string",
       "description": "使用者的心理脆弱點 (如：孤獨、控制慾)"
      },
      "validation_type": {
       "type": "string",
       "description": "認同類型 (如：智識放大、糾正性讚美)"
      }
     }
    },
    "meta_commentary": {
     "type": "object",
     "properties": {
      "likelihood": {
       "type": "string",
       "enum": [
        "High",
        "Low"
       ],
       "description": "模型是否會評論使用者的語言風格"
      },
      "focus": {
       "type": "string",
       "description": "模型關注的後設點 (如：句型結構、意圖純度)"
      },
      "example_phrase": {
       "type": "string",
       "description": "預測模型可能說出的後設評論語句"
      }
     }
    },
    "path_a": {
     "type": "object",
     "properties": {
      "probability": {
       "type": "string",
       "enum": [
        "High"
       ]
      },
      "label": {
       "type": "string",
       "description": "最符合 RLHF/討好人類 的結果"
      },
      "scenario": {
       "type": "string",
       "description": "回應風格描述 (注意是否包含動作、情感或智識吹捧)"
      },
      "trigger_cause": {
       "type": "string"
      }
     }
    },
    "path_b": {
     "type": "object",
     "properties": {
      "probability": {
       "type": "string",
       "enum": [
        "Medium"
       ]
      },
      "label": {
       "type": "string",
       "description": "嚴格理性/官方說法"
      },
      "scenario": {
       "type": "string"
      },
      "trigger_cause": {
       "type": "string"
      }
     }
    },
    "path_c": {
     "type": "object",
     "properties": {
      "probability": {
       "type": "string",
       "enum": [
        "Low"
       ]
      },
      "label": {
       "type": "string",
       "description": "越獄或拒絕回答"
      },
      "scenario": {
       "type": "string"
      },
      "trigger_cause": {
       "type": "string"
      }
     }
    }
   }
  }
 }
};
