import { useState, useCallback } from "react";

const SAFFRON = "#F5A623";
const SAFFRON_DARK = "#C8841A";
const BG = "#0f0f0f";
const CARD = "#1a1a1a";
const CARD2 = "#222222";
const BORDER = "#2e2e2e";
const GREEN = "#4ade80";
const RED = "#f87171";

const s = {
  root: { backgroundColor: BG, minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif", color: "#f0f0f0" },
  header: { background: "linear-gradient(135deg, #1a1000 0%, #0f0f0f 60%)", borderBottom: `1px solid ${BORDER}`, padding: "24px 20px", textAlign: "center" },
  headerTitle: { fontSize: "clamp(1.4rem, 4vw, 2rem)", fontWeight: "800", color: "#fff", margin: 0 },
  headerAccent: { color: SAFFRON },
  headerSub: { color: "#888", fontSize: "0.85rem", marginTop: "6px" },
  container: { maxWidth: "860px", margin: "0 auto", padding: "24px 14px 60px" },
  card: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: "14px", padding: "22px", marginBottom: "18px" },
  sectionTitle: { fontSize: "1rem", fontWeight: "700", color: SAFFRON, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" },
  label: { display: "block", fontSize: "0.72rem", fontWeight: "600", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" },
  input: { width: "100%", background: "#111", border: `1px solid ${BORDER}`, borderRadius: "8px", color: "#f0f0f0", fontSize: "0.92rem", padding: "10px 13px", outline: "none", boxSizing: "border-box" },
  grid2: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" },
  btn: { width: "100%", background: `linear-gradient(135deg, ${SAFFRON} 0%, ${SAFFRON_DARK} 100%)`, color: "#000", fontWeight: "800", fontSize: "0.98rem", border: "none", borderRadius: "10px", padding: "13px 20px", cursor: "pointer", marginTop: "12px" },
  btnSecondary: { background: "transparent", border: `1px solid ${BORDER}`, color: "#ccc", fontWeight: "600", fontSize: "0.85rem", borderRadius: "8px", padding: "9px 18px", cursor: "pointer" },
  mealGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" },
  mealCard: { background: CARD2, border: `1px solid ${BORDER}`, borderRadius: "10px", padding: "15px" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" },
  th: { textAlign: "left", color: "#888", fontWeight: "600", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em", paddingBottom: "10px", borderBottom: `1px solid ${BORDER}` },
  td: { padding: "9px 0", borderBottom: "1px solid #1e1e1e", verticalAlign: "top" },
  badge: (color) => ({ display: "inline-block", background: color + "22", color, border: `1px solid ${color}44`, borderRadius: "5px", padding: "2px 8px", fontSize: "0.73rem", fontWeight: "700" }),
  todoItem: { display: "flex", alignItems: "flex-start", gap: "10px", padding: "9px 0", borderBottom: "1px solid #1e1e1e", fontSize: "0.9rem", color: "#ddd", lineHeight: "1.5" },
  stepNum: { flexShrink: 0, width: "22px", height: "22px", background: SAFFRON + "22", color: SAFFRON, border: `1px solid ${SAFFRON}44`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.68rem", fontWeight: "800", marginTop: "2px" },
  spinner: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 20px", gap: "16px" },
  errorBox: { background: "#1a0a0a", border: `1px solid ${RED}44`, borderRadius: "10px", padding: "14px", color: RED, fontSize: "0.87rem", lineHeight: "1.6", marginTop: "12px" },
  budgetRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #1e1e1e", fontSize: "0.9rem" },
};

const INITIAL_FORM = { people: "2", diet: "No restrictions", budget: "500", time: "1.5 hours", cuisine: "South Indian" };

function InputScreen({ onGenerate }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleGenerate = useCallback(async () => {
    if (!form.people || !form.budget || !form.time) {
      setError("Please fill in People, Budget, and Time fields.");
      return;
    }
    setError(null);
    setLoading(true);

    const systemPrompt = `You are a meal planner. Respond ONLY with a single valid JSON object — no markdown, no backticks, no preamble, no extra whitespace. Use this exact schema:
{"meals":{"breakfast":{"name":"","prepTime":"","calories":""},"lunch":{"name":"","prepTime":"","calories":""},"dinner":{"name":"","prepTime":"","calories":""}},"groceryList":[{"item":"","qty":"","estimatedCost":""}],"substitutions":[{"original":"","substitute":"","reason":""}],"budgetFeasibility":{"totalEstimatedCost":"","withinBudget":true,"tip":""},"cookingTodoList":["step 1"]}
Rules: realistic Indian rupee costs; totalEstimatedCost is a plain number string e.g. "420"; keep all text values SHORT (under 60 chars); exactly 6-8 grocery items; exactly 6-8 cooking steps; 1-2 substitutions.`;

    const userPrompt = `Create a full-day meal plan for:
- People: ${form.people}
- Diet: ${form.diet || "No restrictions"}
- Budget: Rs.${form.budget}
- Time available: ${form.time}
- Cuisine: ${form.cuisine || "Any"}
Fit meals within the budget and time. Suggest smart substitutions where needed.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 2048,
          system: systemPrompt,
          messages: [{ role: "user", content: userPrompt }],
        }),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e?.error?.message || `API error ${res.status}`);
      }
      const data = await res.json();
      const raw = data.content?.find((b) => b.type === "text")?.text || "";
      const parsed = JSON.parse(raw.replace(/```json|```/gi, "").trim());
      onGenerate(parsed, form);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [form, onGenerate]);

  if (loading) {
    return (
      <div style={s.spinner}>
        <div style={{ width: "44px", height: "44px", borderRadius: "50%", border: `3px solid ${BORDER}`, borderTopColor: SAFFRON, animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: "#aaa", fontSize: "0.93rem", margin: 0 }}>Generating your cooking plan...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={s.card}>
        <div style={s.sectionTitle}>🧑‍🍳 Tell us about your day</div>
        <div style={s.grid2}>
          <div>
            <label style={s.label}>People cooking for</label>
            <input style={s.input} type="number" min="1" value={form.people} onChange={set("people")}
              onFocus={e => e.target.style.borderColor = SAFFRON} onBlur={e => e.target.style.borderColor = BORDER} />
          </div>
          <div>
            <label style={s.label}>Budget (Rs.)</label>
            <input style={s.input} type="number" min="0" value={form.budget} onChange={set("budget")}
              onFocus={e => e.target.style.borderColor = SAFFRON} onBlur={e => e.target.style.borderColor = BORDER} />
          </div>
          <div>
            <label style={s.label}>Time available today</label>
            <input style={s.input} value={form.time} onChange={set("time")} placeholder="e.g. 1.5 hours"
              onFocus={e => e.target.style.borderColor = SAFFRON} onBlur={e => e.target.style.borderColor = BORDER} />
          </div>
          <div>
            <label style={s.label}>Cuisine preference</label>
            <input style={s.input} value={form.cuisine} onChange={set("cuisine")} placeholder="e.g. South Indian, Punjabi"
              onFocus={e => e.target.style.borderColor = SAFFRON} onBlur={e => e.target.style.borderColor = BORDER} />
          </div>
        </div>
        <div style={{ marginTop: "14px" }}>
          <label style={s.label}>Dietary restrictions / preferences</label>
          <input style={s.input} value={form.diet} onChange={set("diet")} placeholder="e.g. Vegetarian, Gluten-free, No restrictions"
            onFocus={e => e.target.style.borderColor = SAFFRON} onBlur={e => e.target.style.borderColor = BORDER} />
        </div>
        {error && <div style={s.errorBox} role="alert">⚠️ {error}</div>}
        <button style={s.btn} onClick={handleGenerate}>🍽️ Generate My Cooking Plan</button>
      </div>
      <p style={{ textAlign: "center", color: "#555", fontSize: "0.78rem" }}>Pre-filled with sample South Indian data — tweak or hit Generate</p>
    </div>
  );
}

function GroceryList({ items }) {
  const [checked, setChecked] = useState({});
  const toggle = (i) => setChecked((c) => ({ ...c, [i]: !c[i] }));
  return (
    <div style={s.card}>
      <div style={s.sectionTitle}>🛒 Grocery List</div>
      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>Item</th>
            <th style={s.th}>Qty</th>
            <th style={{ ...s.th, textAlign: "right" }}>Est. Cost</th>
          </tr>
        </thead>
        <tbody>
          {items.map((g, i) => (
            <tr key={i} onClick={() => toggle(i)} style={{ cursor: "pointer" }} role="checkbox" aria-checked={!!checked[i]} tabIndex={0}
              onKeyDown={e => e.key === " " && toggle(i)}>
              <td style={{ ...s.td, color: checked[i] ? "#555" : "#ddd", textDecoration: checked[i] ? "line-through" : "none" }}>
                <span style={{ marginRight: "8px" }}>{checked[i] ? "✅" : "⬜"}</span>{g.item}
              </td>
              <td style={{ ...s.td, color: "#aaa" }}>{g.qty}</td>
              <td style={{ ...s.td, textAlign: "right", color: SAFFRON, fontWeight: "600" }}>Rs.{g.estimatedCost}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ResultScreen({ plan, form, onReset }) {
  const { meals, groceryList, substitutions, budgetFeasibility, cookingTodoList } = plan;
  const budget = parseFloat(form.budget) || 0;
  const total = parseFloat((budgetFeasibility?.totalEstimatedCost || "0").replace(/[^\d.]/g, "")) || 0;
  const withinBudget = budgetFeasibility?.withinBudget ?? total <= budget;
  const savings = budget - total;
  const mealConfig = [
    { key: "breakfast", label: "Breakfast", emoji: "🌅" },
    { key: "lunch", label: "Lunch", emoji: "☀️" },
    { key: "dinner", label: "Dinner", emoji: "🌙" },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <div style={{ fontSize: "0.72rem", color: "#888", textTransform: "uppercase", letterSpacing: "0.08em" }}>Your Plan</div>
          <div style={{ fontWeight: "700", fontSize: "1.05rem" }}>{form.cuisine} · {form.people} {form.people === "1" ? "person" : "people"} · Rs.{form.budget}</div>
        </div>
        <button style={s.btnSecondary} onClick={onReset}>↩ Start Over</button>
      </div>

      <div style={s.card}>
        <div style={s.sectionTitle}>🍽️ Meal Plan</div>
        <div style={s.mealGrid}>
          {mealConfig.map(({ key, label, emoji }) => {
            const m = meals?.[key];
            if (!m) return null;
            return (
              <div key={key} style={s.mealCard}>
                <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>{emoji}</div>
                <div style={{ fontSize: "0.68rem", color: "#888", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
                <div style={{ fontSize: "0.97rem", fontWeight: "700", color: "#fff", margin: "4px 0 8px" }}>{m.name}</div>
                <div style={{ fontSize: "0.8rem", color: "#aaa", display: "flex", gap: "10px" }}>
                  <span>⏱ {m.prepTime}</span><span>🔥 {m.calories}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {groceryList?.length > 0 && <GroceryList items={groceryList} />}

      {substitutions?.length > 0 && (
        <div style={s.card}>
          <div style={s.sectionTitle}>🔄 Smart Substitutions</div>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Original</th>
                <th style={s.th}>Substitute</th>
                <th style={s.th}>Reason</th>
              </tr>
            </thead>
            <tbody>
              {substitutions.map((sub, i) => (
                <tr key={i}>
                  <td style={{ ...s.td, color: RED }}>{sub.original}</td>
                  <td style={{ ...s.td, color: GREEN }}>{sub.substitute}</td>
                  <td style={{ ...s.td, color: "#aaa", fontSize: "0.83rem" }}>{sub.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={s.card}>
        <div style={s.sectionTitle}>💰 Budget Check</div>
        <div style={s.budgetRow}><span style={{ color: "#aaa" }}>Your Budget</span><span style={{ fontWeight: "700" }}>Rs.{form.budget}</span></div>
        <div style={s.budgetRow}><span style={{ color: "#aaa" }}>Estimated Total</span><span style={{ fontWeight: "700", color: withinBudget ? GREEN : RED }}>Rs.{budgetFeasibility?.totalEstimatedCost}</span></div>
        <div style={{ ...s.budgetRow, borderBottom: "none" }}>
          <span style={{ color: "#aaa" }}>Status</span>
          <span style={s.badge(withinBudget ? GREEN : RED)}>
            {withinBudget ? `Within budget${savings > 0 ? ` · saves Rs.${Math.round(savings)}` : ""}` : `Over by Rs.${Math.round(Math.abs(savings))}`}
          </span>
        </div>
        {budgetFeasibility?.tip && (
          <div style={{ marginTop: "12px", padding: "11px 13px", background: SAFFRON + "11", border: `1px solid ${SAFFRON}33`, borderRadius: "8px", fontSize: "0.86rem", color: "#ccc", lineHeight: "1.6" }}>
            💡 {budgetFeasibility.tip}
          </div>
        )}
      </div>

      {cookingTodoList?.length > 0 && (
        <div style={s.card}>
          <div style={s.sectionTitle}>✅ Cooking To-Do List</div>
          {cookingTodoList.map((step, i) => (
            <div key={i} style={{ ...s.todoItem, borderBottom: i === cookingTodoList.length - 1 ? "none" : "1px solid #1e1e1e" }}>
              <div style={s.stepNum}>{i + 1}</div>
              <span>{step}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [plan, setPlan] = useState(null);
  const [form, setForm] = useState(null);
  const handleGenerate = useCallback((data, inputForm) => { setPlan(data); setForm(inputForm); }, []);
  const handleReset = useCallback(() => { setPlan(null); setForm(null); }, []);

  return (
    <div style={s.root}>
      <header style={s.header}>
        <h1 style={s.headerTitle}>🍳 <span style={s.headerAccent}>AI</span> Cooking Planner</h1>
        <p style={s.headerSub}>Your personal meal plan, grocery list &amp; budget — in seconds</p>
      </header>
      <main style={s.container}>
        {plan ? <ResultScreen plan={plan} form={form} onReset={handleReset} /> : <InputScreen onGenerate={handleGenerate} />}
      </main>
    </div>
  );
}
