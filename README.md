# 🪷 Samatva — Mental Wellness Companion

> **समत्व** · Equanimity for the Examining Mind

A Generative AI-powered mental wellness companion for Indian students
preparing for JEE, NEET, UPSC, CAT, GATE, and CUET.

---

## Quick Start

### 1. Install dependencies
```bash
pip install -r requirements.txt
```

### 2. Set your API key

**Option A — Environment variable (local dev):**
```bash
export ANTHROPIC_API_KEY=sk-ant-...
streamlit run app.py
```

**Option B — Streamlit secrets (recommended for deployment):**

Create `.streamlit/secrets.toml`:
```toml
ANTHROPIC_API_KEY = "sk-ant-..."
```

Then run:
```bash
streamlit run app.py
```

### 3. Deploy to Streamlit Community Cloud (free)
1. Push to a GitHub repo
2. Go to share.streamlit.io
3. Connect your repo, set `ANTHROPIC_API_KEY` in Secrets
4. Deploy — done!

---

## Features

| Feature | Description |
|---|---|
| 📝 Journal | Free-form daily journaling with word count |
| 🧠 Analysis | AI detects emotions, patterns & hidden triggers |
| 💬 Manas | Empathetic AI companion with safety guardrails |
| 📊 Dashboard | Plotly visualizations of emotional trends |
| 🛠 Dev Mode | API health checks & test suite |

---

## Security Notes
- API key never hardcoded — uses `os.getenv` / Streamlit secrets
- Input sanitized for prompt injection before every LLM call
- Manas refuses medical advice and escalates crisis to iCall & Vandrevala Foundation
- No data persisted beyond the session

---

## Crisis Resources
- **iCall (TISS):** 9152987821
- **Vandrevala Foundation:** 1860-2662-345 (24/7)
- **Snehi:** 044-24640050
