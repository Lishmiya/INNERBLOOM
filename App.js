import React, { useState, useEffect, useRef } from "react";

// Firebase Imports
import { initializeApp } from "firebase/app";
import {
  getFirestore, collection, addDoc, getDocs, doc, deleteDoc, updateDoc
} from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  setPersistence,
  browserSessionPersistence
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBRnMrejvgrC-oP2fnDFJLPkFXHjAXk1fc",
  authDomain: "gen-lang-client-0234212452.firebaseapp.com",
  projectId: "gen-lang-client-0234212452",
  storageBucket: "gen-lang-client-0234212452.firebasestorage.app",
  messagingSenderId: "69060407373",
  appId: "1:69060407373:web:04bb1ff8d5e0cfb57cac04",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
setPersistence(auth, browserSessionPersistence);

// ─── Constants ────────────────────────────────────────────────────────────────

const affirmations = [
  "I am exactly where I need to be.",
  "I release what no longer serves me.",
  "Focus on the step, not the mountain.",
  "My growth is not a race.",
  "I am worthy of the life I am creating.",
  "Every small step is progress.",
  "I choose peace over perfection.",
  "My feelings are valid and temporary.",
  "I am becoming the best version of myself.",
  "Softness is not weakness — it is wisdom."
];

const journalPrompts = [
  "What made you smile today, even briefly?",
  "Describe a moment this week that surprised you.",
  "What is one thing you're carrying that you could put down?",
  "Write about someone who made you feel seen recently.",
  "What does your body need more of right now?",
  "What would you tell your past self from a year ago?",
  "Name three things that felt hard but you did anyway.",
  "What is quietly making you happy that you haven't said out loud?",
  "Describe your ideal tomorrow in detail.",
  "What boundary do you need to set — with others, or yourself?",
  "Where did you feel most like yourself this week?",
  "What are you grateful for that you usually take for granted?"
];

const manifestQuotes = [
  "She believed she could, so she did.",
  "The universe is conspiring in your favor.",
  "You are a magnet for miracles.",
  "Everything you want is already on its way to you.",
  "Your vision is valid. Keep going.",
  "I am worthy of everything I desire.",
  "Abundance is my natural state of being.",
  "I attract love, peace, and prosperity effortlessly.",
  "My dreams are valid and they are coming true.",
  "I am exactly who I was always meant to become.",
  "The best is yet to come — and I am ready for it.",
  "I trust the timing of my life completely."
];

const manifestAffirmations = [
  { emoji: "🌙", text: "I am magnetic. Everything I desire is drawn to me effortlessly." },
  { emoji: "🌸", text: "I am living in alignment with my highest self." },
  { emoji: "✨", text: "Abundance flows to me in unexpected and beautiful ways." },
  { emoji: "💫", text: "I release fear and step boldly into my purpose." },
  { emoji: "🦋", text: "My transformation is happening right now, in every breath." },
  { emoji: "🌿", text: "I am grounded, guided, and grateful for this journey." },
  { emoji: "💎", text: "I am deserving of deep love, success, and joy." },
  { emoji: "🌺", text: "Everything I need is already within me." },
];

const expenseCategories = [
  { label: "🛒 Food", value: "food" },
  { label: "💄 Self-care", value: "selfcare" },
  { label: "🎉 Fun", value: "fun" },
  { label: "🏠 Home", value: "home" },
  { label: "📚 Growth", value: "growth" },
  { label: "🚗 Transport", value: "transport" },
  { label: "💊 Health", value: "health" },
  { label: "🛍️ Shopping", value: "shopping" }
];

const categoryColors = {
  food: "#f8bbd0",
  selfcare: "#ce93d8",
  fun: "#80cbc4",
  home: "#ffcc80",
  growth: "#a5d6a7",
  transport: "#90caf9",
  health: "#ef9a9a",
  shopping: "#f48fb1",
  other: "#e0e0e0"
};

const habitOptions = [
  "💧 Drink water", "🧘 Meditate", "📖 Read", "🏃 Move body",
  "🌞 Sunlight", "📵 No scroll morning", "😴 8h sleep", "✍️ Journal"
];

const breathingPatterns = [
  { name: "4-7-8 Calm", inhale: 4, hold: 7, exhale: 8, desc: "For anxiety & sleep" },
  { name: "Box Breathing", inhale: 4, hold: 4, exhale: 4, holdOut: 4, desc: "For focus & stress" },
  { name: "Deep Relax", inhale: 5, hold: 2, exhale: 7, desc: "For relaxation" }
];

// ─── Styles ───────────────────────────────────────────────────────────────────

const S = {
  app: {
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    background: "#fdf8f6",
    minHeight: "100vh",
    color: "#3d3533"
  },
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "18px 30px",
    background: "white",
    borderBottom: "1px solid #f5eded",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 2px 20px rgba(248,187,208,0.08)",
    flexWrap: "wrap",
    gap: "10px"
  },
  navLogo: { fontSize: "20px", fontWeight: "800", color: "#e991b5", letterSpacing: "-0.5px" },
  navTabs: { display: "flex", gap: "4px", flexWrap: "wrap" },
  navTab: (active) => ({
    padding: "8px 16px",
    borderRadius: "20px",
    border: "none",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: active ? "700" : "500",
    background: active ? "#fce4ec" : "transparent",
    color: active ? "#e991b5" : "#aaa",
    transition: "all 0.2s"
  }),
  navRight: { display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" },
  page: { padding: "30px", maxWidth: "1300px", margin: "0 auto" },

  card: {
    background: "white",
    borderRadius: "24px",
    padding: "28px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.04)"
  },
  cardSm: {
    background: "white",
    borderRadius: "20px",
    padding: "20px",
    boxShadow: "0 2px 16px rgba(0,0,0,0.03)"
  },

  h2: { fontSize: "22px", fontWeight: "800", color: "#3d3533", marginBottom: "20px" },
  h3: { fontSize: "13px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "2px", color: "#ccc", marginBottom: "14px" },
  label: { fontSize: "12px", fontWeight: "600", color: "#bbb", marginBottom: "6px", display: "block" },

  input: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "14px",
    border: "1px solid #f0f0f0",
    fontSize: "14px",
    outline: "none",
    background: "#fafafa",
    color: "#3d3533",
    boxSizing: "border-box"
  },
  textarea: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid #f0f0f0",
    fontSize: "14px",
    outline: "none",
    background: "#fafafa",
    color: "#3d3533",
    resize: "vertical",
    lineHeight: "1.7",
    boxSizing: "border-box"
  },

  btnPrimary: {
    padding: "13px 28px",
    background: "linear-gradient(135deg, #f8bbd0, #e991b5)",
    color: "white",
    border: "none",
    borderRadius: "50px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "14px",
    boxShadow: "0 4px 20px rgba(233,145,181,0.3)"
  },
  btnSecondary: {
    padding: "10px 20px",
    background: "#fafafa",
    color: "#888",
    border: "1px solid #f0f0f0",
    borderRadius: "50px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "13px"
  },
  btnGhost: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#ccc",
    fontSize: "18px",
    padding: "4px"
  },
  btnDark: {
    padding: "12px 24px",
    background: "#3d3533",
    color: "white",
    border: "none",
    borderRadius: "50px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "13px"
  },

  loginWrap: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #fdf8f6, #fce4ec)" },
  loginCard: { width: "380px", padding: "50px 44px", background: "white", borderRadius: "40px", boxShadow: "0 30px 80px rgba(248,187,208,0.2)", textAlign: "center" },

  overlay: { position: "fixed", inset: 0, background: "rgba(255,255,255,0.7)", backdropFilter: "blur(16px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  modal: { background: "white", borderRadius: "32px", padding: "48px", width: "90%", maxWidth: "600px", maxHeight: "85vh", overflowY: "auto", boxShadow: "0 40px 100px rgba(0,0,0,0.1)", position: "relative" },

  tag: (color) => ({
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "600",
    background: color + "22",
    color: color,
    marginRight: "4px",
    marginBottom: "4px"
  }),
  chip: (active) => ({
    padding: "6px 14px",
    borderRadius: "20px",
    border: `1px solid ${active ? "#f8bbd0" : "#f0f0f0"}`,
    background: active ? "#fce4ec" : "white",
    color: active ? "#e991b5" : "#aaa",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer"
  }),
  pill: {
    padding: "4px 12px",
    borderRadius: "20px",
    background: "#fce4ec",
    color: "#e991b5",
    fontSize: "11px",
    fontWeight: "700"
  },
  divider: { height: "1px", background: "#f5f5f5", margin: "20px 0", border: "none" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
  grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" },
  flex: (gap = 12, align = "center") => ({ display: "flex", alignItems: align, gap: `${gap}px` }),
  spacer: (h) => ({ height: `${h}px` }),
  scrollY: { overflowY: "auto" },
};

// ─── Breathing Widget ─────────────────────────────────────────────────────────

function BreathingWidget() {
  const [pattern, setPattern] = useState(0);
  const [phase, setPhase] = useState("idle");
  const [count, setCount] = useState(0);
  const [cycles, setCycles] = useState(0);
  const timerRef = useRef(null);
  const p = breathingPatterns[pattern];

  const stop = () => {
    clearInterval(timerRef.current);
    setPhase("idle");
    setCount(0);
  };

  const runCycle = () => {
    let step = 0;
    const phases = [
      { name: "inhale", dur: p.inhale },
      { name: "hold", dur: p.hold },
      { name: "exhale", dur: p.exhale },
      ...(p.holdOut ? [{ name: "holdOut", dur: p.holdOut }] : [])
    ];
    setPhase(phases[0].name);
    setCount(phases[0].dur);
    let remaining = phases[0].dur;
    timerRef.current = setInterval(() => {
      remaining--;
      if (remaining <= 0) {
        step = (step + 1) % phases.length;
        if (step === 0) setCycles(c => c + 1);
        setPhase(phases[step].name);
        remaining = phases[step].dur;
      }
      setCount(remaining);
    }, 1000);
  };

  useEffect(() => () => clearInterval(timerRef.current), []);

  const phaseLabels = { inhale: "Breathe In 🌬️", hold: "Hold 🌸", exhale: "Breathe Out 💨", holdOut: "Hold Empty 🌙", idle: "Ready" };
  const phaseScale = { inhale: "1.25", hold: "1.25", exhale: "0.85", holdOut: "0.85", idle: "1" };

  return (
    <div style={{ ...S.card, textAlign: "center" }}>
      <h2 style={S.h2}>🫁 Breathing Exercise</h2>
      <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "28px", flexWrap: "wrap" }}>
        {breathingPatterns.map((bp, i) => (
          <button key={i} style={S.chip(pattern === i)} onClick={() => { stop(); setPattern(i); }}>
            {bp.name}
          </button>
        ))}
      </div>
      <p style={{ fontSize: "13px", color: "#bbb", marginBottom: "28px" }}>{p.desc}</p>
      <div style={{ position: "relative", width: "200px", height: "200px", margin: "0 auto 28px" }}>
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          background: "linear-gradient(135deg, #fce4ec, #f8bbd0)",
          transform: `scale(${phaseScale[phase]})`,
          transition: phase !== "idle" ? `transform ${phase === "inhale" ? p.inhale : phase === "exhale" ? p.exhale : 0.3}s ease-in-out` : "none",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexDirection: "column", boxShadow: "0 10px 40px rgba(248,187,208,0.4)"
        }}>
          <div style={{ fontSize: "40px", fontWeight: "800", color: "white" }}>{phase === "idle" ? "✿" : count}</div>
          <div style={{ fontSize: "13px", color: "white", fontWeight: "600", marginTop: "4px" }}>{phaseLabels[phase]}</div>
        </div>
      </div>
      {cycles > 0 && <p style={{ fontSize: "12px", color: "#e991b5", marginBottom: "16px" }}>🌸 {cycles} cycle{cycles > 1 ? "s" : ""} complete</p>}
      <div style={S.flex(12, "center")}>
        <button style={S.btnPrimary} onClick={() => phase === "idle" ? runCycle() : stop()}>
          {phase === "idle" ? "Begin" : "Stop"}
        </button>
        {phase !== "idle" && <button style={S.btnSecondary} onClick={() => { stop(); setCycles(0); }}>Reset</button>}
      </div>
    </div>
  );
}

// ─── Mood Chart ───────────────────────────────────────────────────────────────

function MoodChart({ entries }) {
  const moodScore = { "🌸": 5, "✨": 4, "☁️": 3, "🌙": 2, "🩹": 1 };
  const moodColor = { "🌸": "#f8bbd0", "✨": "#fff176", "☁️": "#90caf9", "🌙": "#ce93d8", "🩹": "#ef9a9a" };
  const last14 = [...entries].slice(0, 14).reverse();
  const max = 5;

  return (
    <div style={S.card}>
      <h2 style={S.h2}>📊 Mood Trends</h2>
      <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "120px" }}>
        {last14.map((e, i) => {
          const score = moodScore[e.mood] || 3;
          const height = (score / max) * 100;
          return (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
              <div title={`${e.date}: ${e.mood}`} style={{
                width: "100%", height: `${height}%`, minHeight: "8px",
                background: moodColor[e.mood] || "#f0f0f0",
                borderRadius: "6px 6px 0 0",
                transition: "height 0.5s ease"
              }} />
              <span style={{ fontSize: "8px", color: "#ccc" }}>{e.date?.split("/").slice(0, 2).join("/")}</span>
            </div>
          );
        })}
        {last14.length === 0 && <p style={{ color: "#ddd", fontSize: "13px", margin: "auto" }}>No entries yet — start journaling! 🌸</p>}
      </div>
      <hr style={S.divider} />
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        {Object.entries(moodScore).map(([emoji, score]) => (
          <span key={emoji} style={{ fontSize: "12px", color: "#aaa" }}>{emoji} {["", "Heavy", "Low", "Neutral", "Good", "Glowing"][score]}</span>
        ))}
      </div>
    </div>
  );
}

// ─── Gratitude Jar ────────────────────────────────────────────────────────────

function GratitudeJar({ db, user }) {
  const [gratitudes, setGratitudes] = useState([]);
  const [input, setInput] = useState("");
  const [shaking, setShaking] = useState(false);
  const [shown, setShown] = useState(null);

  const load = async () => {
    const snap = await getDocs(collection(db, "gratitudes"));
    setGratitudes(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(g => g.userId === user.uid));
  };

  useEffect(() => { if (user) load(); }, [user]);

  const add = async () => {
    if (!input.trim()) return;
    await addDoc(collection(db, "gratitudes"), { text: input, userId: user.uid, date: new Date().toLocaleDateString() });
    setInput("");
    load();
  };

  const shake = () => {
    if (gratitudes.length === 0) return;
    setShaking(true);
    setTimeout(() => {
      setShaking(false);
      setShown(gratitudes[Math.floor(Math.random() * gratitudes.length)]);
    }, 600);
  };

  const del = async (id) => {
    await deleteDoc(doc(db, "gratitudes", id));
    load();
    if (shown?.id === id) setShown(null);
  };

  const fillPct = Math.min(gratitudes.length * 8, 95);

  return (
    <div style={S.card}>
      <h2 style={S.h2}>🫙 Gratitude Jar</h2>
      <div style={{ display: "flex", gap: "24px", alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{ flexShrink: 0, cursor: "pointer" }} onClick={shake}>
          <svg width="100" height="140" viewBox="0 0 100 140" style={{
            filter: "drop-shadow(0 8px 20px rgba(248,187,208,0.3))",
            animation: shaking ? "shake 0.6s ease" : "none"
          }}>
            <style>{`@keyframes shake { 0%,100%{transform:rotate(0)} 20%{transform:rotate(-8deg)} 40%{transform:rotate(8deg)} 60%{transform:rotate(-4deg)} 80%{transform:rotate(4deg)} }`}</style>
            <rect x="15" y="20" width="70" height="110" rx="12" fill="#fdf8f6" stroke="#f8bbd0" strokeWidth="2" />
            <rect x="25" y="10" width="50" height="18" rx="6" fill="#f8bbd0" />
            <clipPath id="fillClip"><rect x="15" y="20" width="70" height="110" rx="12" /></clipPath>
            <rect x="15" y={130 - fillPct * 1.1} width="70" height={fillPct * 1.1 + 10} fill="#fce4ec" opacity="0.6" clipPath="url(#fillClip)" />
            <text x="50" y="82" textAnchor="middle" fontSize="26">🌸</text>
            <text x="50" y="105" textAnchor="middle" fontSize="11" fill="#e991b5" fontWeight="bold">{gratitudes.length}</text>
          </svg>
          <p style={{ fontSize: "10px", color: "#ccc", textAlign: "center", marginTop: "6px" }}>tap to shake</p>
        </div>
        <div style={{ flex: 1 }}>
          {shown && (
            <div style={{ ...S.cardSm, background: "#fce4ec", marginBottom: "16px", position: "relative" }}>
              <p style={{ fontSize: "15px", color: "#e991b5", fontStyle: "italic" }}>"{shown.text}"</p>
              <p style={{ fontSize: "10px", color: "#f8bbd0", marginTop: "6px" }}>{shown.date}</p>
              <button style={{ ...S.btnGhost, position: "absolute", top: "10px", right: "10px" }} onClick={() => setShown(null)}>✕</button>
            </div>
          )}
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
            <input style={{ ...S.input, flex: 1 }} placeholder="I'm grateful for..." value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && add()} />
            <button style={S.btnPrimary} onClick={add}>+</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Letter to Future Self ────────────────────────────────────────────────────

function FutureLetter({ db, user }) {
  const [letters, setLetters] = useState([]);
  const [text, setText] = useState("");
  const [unlockDate, setUnlockDate] = useState("");
  const [selectedLetter, setSelectedLetter] = useState(null);

  const load = async () => {
    const snap = await getDocs(collection(db, "futureLetters"));
    setLetters(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(l => l.userId === user.uid)
      .sort((a, b) => new Date(a.unlockDate) - new Date(b.unlockDate)));
  };

  useEffect(() => { if (user) load(); }, [user]);

  const save = async () => {
    if (!text.trim() || !unlockDate) return;
    await addDoc(collection(db, "futureLetters"), { text, unlockDate, userId: user.uid, createdAt: new Date().toLocaleDateString() });
    setText(""); setUnlockDate(""); load();
  };

  const del = async (id) => {
    await deleteDoc(doc(db, "futureLetters", id));
    setSelectedLetter(null);
    load();
  };

  const today = new Date().toISOString().split("T")[0];
  const isUnlocked = (l) => new Date(l.unlockDate) <= new Date();

  return (
    <div style={S.card}>
      <h2 style={S.h2}>💌 Letter to Future Self</h2>
      <div style={S.grid2}>
        <div>
          <label style={S.label}>Your message</label>
          <textarea style={{ ...S.textarea, height: "140px", marginBottom: "12px" }}
            placeholder="Dear future me..." value={text} onChange={e => setText(e.target.value)} />
          <label style={S.label}>Unlock date</label>
          <input type="date" style={{ ...S.input, marginBottom: "16px" }} min={today}
            value={unlockDate} onChange={e => setUnlockDate(e.target.value)} />
          <button style={S.btnPrimary} onClick={save}>Seal & Send 💌</button>
        </div>
        <div>
          <label style={S.label}>Your letters</label>
          <div style={{ maxHeight: "260px", overflowY: "auto" }}>
            {letters.map(l => {
              const unlocked = isUnlocked(l);
              return (
                <div key={l.id} style={{ ...S.cardSm, marginBottom: "10px", cursor: unlocked ? "pointer" : "default", background: unlocked ? "white" : "#fafafa", opacity: unlocked ? 1 : 0.7 }}
                  onClick={() => unlocked && setSelectedLetter(l)}>
                  <div style={S.flex(8)}>
                    <span style={{ fontSize: "18px" }}>{unlocked ? "💌" : "🔒"}</span>
                    <div>
                      <p style={{ fontSize: "12px", fontWeight: "700", color: unlocked ? "#e991b5" : "#bbb" }}>
                        {unlocked ? "Ready to read!" : "Sealed"}
                      </p>
                      <p style={{ fontSize: "10px", color: "#ccc" }}>
                        Opens: {new Date(l.unlockDate).toLocaleDateString()}
                      </p>
                    </div>
                    <button style={{ ...S.btnGhost, marginLeft: "auto" }} onClick={e => { e.stopPropagation(); del(l.id); }}>×</button>
                  </div>
                </div>
              );
            })}
            {letters.length === 0 && <p style={{ color: "#ddd", fontSize: "13px" }}>No letters yet 💌</p>}
          </div>
        </div>
      </div>

      {selectedLetter && (
        <div style={S.overlay} onClick={() => setSelectedLetter(null)}>
          <div style={S.modal} onClick={e => e.stopPropagation()}>
            <button style={{ ...S.btnGhost, position: "absolute", top: "20px", right: "24px" }} onClick={() => setSelectedLetter(null)}>✕</button>
            <p style={{ fontSize: "12px", color: "#ccc", marginBottom: "8px" }}>Written {selectedLetter.createdAt}</p>
            <h3 style={{ ...S.h2, color: "#e991b5" }}>💌 A letter to you</h3>
            <p style={{ fontSize: "16px", lineHeight: "1.9", color: "#555", whiteSpace: "pre-wrap" }}>{selectedLetter.text}</p>
            <div style={S.spacer(28)} />
            <button style={S.btnGhost} onClick={() => del(selectedLetter.id)}>🗑 Delete letter</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Habit Tracker ────────────────────────────────────────────────────────────

function HabitTracker({ db, user }) {
  const [habits, setHabits] = useState([]);
  const [customHabit, setCustomHabit] = useState("");
  const today = new Date().toISOString().split("T")[0];

  const load = async () => {
    const snap = await getDocs(collection(db, "habits"));
    setHabits(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(h => h.userId === user.uid));
  };

  useEffect(() => { if (user) load(); }, [user]);

  const toggleDay = async (habit, dateStr) => {
    const checked = (habit.checkedDays || []).includes(dateStr);
    const updated = checked
      ? (habit.checkedDays || []).filter(d => d !== dateStr)
      : [...(habit.checkedDays || []), dateStr];
    await updateDoc(doc(db, "habits", habit.id), { checkedDays: updated });
    load();
  };

  const addHabit = async (text) => {
    if (!text.trim()) return;
    await addDoc(collection(db, "habits"), { text, userId: user.uid, checkedDays: [] });
    setCustomHabit("");
    load();
  };

  const delHabit = async (id) => {
    await deleteDoc(doc(db, "habits", id));
    load();
  };

  const streak = (habit) => {
    let s = 0;
    const d = new Date();
    while (true) {
      const str = d.toISOString().split("T")[0];
      if (!(habit.checkedDays || []).includes(str)) break;
      s++;
      d.setDate(d.getDate() - 1);
    }
    return s;
  };

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });

  const dayLabel = (str) => {
    const d = new Date(str);
    return ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"][d.getDay()];
  };

  return (
    <div style={S.card}>
      <h2 style={S.h2}>✅ Habit Tracker</h2>
      <div style={{ marginBottom: "20px" }}>
        <p style={{ ...S.label, marginBottom: "10px" }}>Quick add</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
          {habitOptions.filter(h => !habits.find(hb => hb.text === h)).map(h => (
            <button key={h} style={{ ...S.chip(false), fontSize: "12px" }} onClick={() => addHabit(h)}>{h} +</button>
          ))}
        </div>
        <div style={S.flex(8)}>
          <input style={{ ...S.input, flex: 1 }} placeholder="Custom habit..." value={customHabit} onChange={e => setCustomHabit(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addHabit(customHabit)} />
          <button style={S.btnDark} onClick={() => addHabit(customHabit)}>Add</button>
        </div>
      </div>

      {habits.length === 0 && <p style={{ color: "#ddd", fontSize: "13px" }}>Add habits above to start tracking 🌱</p>}

      {habits.length > 0 && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "12px", marginBottom: "8px" }}>
            <span style={S.label}>Habit</span>
            <div style={{ display: "flex", gap: "4px" }}>
              {last7.map(d => (
                <div key={d} style={{ width: "32px", textAlign: "center", fontSize: "10px", color: d === today ? "#e991b5" : "#ccc", fontWeight: d === today ? "700" : "400" }}>
                  {dayLabel(d)}
                </div>
              ))}
              <div style={{ width: "40px" }} />
            </div>
          </div>
          {habits.map(h => (
            <div key={h.id} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "12px", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #fafafa" }}>
              <div style={S.flex(8)}>
                <span style={{ fontSize: "13px", fontWeight: "600" }}>{h.text}</span>
                {streak(h) > 0 && <span style={{ ...S.pill, fontSize: "10px", padding: "2px 8px" }}>🔥 {streak(h)}</span>}
              </div>
              <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                {last7.map(d => {
                  const checked = (h.checkedDays || []).includes(d);
                  return (
                    <button key={d} onClick={() => toggleDay(h, d)} style={{
                      width: "32px", height: "32px", borderRadius: "8px", border: "none", cursor: "pointer",
                      background: checked ? "#f8bbd0" : "#f5f5f5", fontSize: "14px",
                      transition: "all 0.15s"
                    }}>{checked ? "✓" : ""}</button>
                  );
                })}
                <button style={{ ...S.btnGhost, width: "32px", fontSize: "14px" }} onClick={() => delHabit(h.id)}>×</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Expense Pie Chart ────────────────────────────────────────────────────────

function ExpensePieChart({ expenses }) {
  const catTotals = {};
  expenses.forEach(e => {
    const cat = e.category || "other";
    catTotals[cat] = (catTotals[cat] || 0) + (Number(e.amount) || 0);
  });
  const total = Object.values(catTotals).reduce((a, b) => a + b, 0);
  if (total === 0) return <p style={{ color: "#ddd", fontSize: "13px", textAlign: "center", padding: "20px" }}>No expenses yet 💰</p>;

  const entries = Object.entries(catTotals).filter(([, v]) => v > 0);
  let angle = -90;
  const cx = 70, cy = 70, r = 60;

  const slices = entries.map(([cat, val]) => {
    const pct = val / total;
    const a1 = (angle * Math.PI) / 180;
    angle += pct * 360;
    const a2 = (angle * Math.PI) / 180;
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2);
    const large = pct > 0.5 ? 1 : 0;
    return { cat, val, pct, path: `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z` };
  });

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
        <svg width="140" height="140" viewBox="0 0 140 140">
          {slices.map((s, i) => (
            <path key={i} d={s.path} fill={categoryColors[s.cat] || "#e0e0e0"} stroke="white" strokeWidth="2" />
          ))}
          <circle cx="70" cy="70" r="28" fill="white" />
          <text x="70" y="74" textAnchor="middle" fontSize="10" fill="#aaa" fontWeight="600">
            ${total.toFixed(0)}
          </text>
        </svg>
        <div style={{ flex: 1 }}>
          {slices.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "3px", background: categoryColors[s.cat] || "#e0e0e0", flexShrink: 0 }} />
              <span style={{ fontSize: "12px", color: "#777", flex: 1 }}>
                {expenseCategories.find(c => c.value === s.cat)?.label || s.cat}
              </span>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#555" }}>${s.val.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Weekly Intention ─────────────────────────────────────────────────────────

function WeeklyIntention({ db, user }) {
  const [intention, setIntention] = useState("");
  const [saved, setSaved] = useState("");
  const [docId, setDocId] = useState(null);

  const weekKey = () => {
    const d = new Date();
    const start = new Date(d.setDate(d.getDate() - d.getDay()));
    return start.toISOString().split("T")[0];
  };

  const load = async () => {
    const snap = await getDocs(collection(db, "intentions"));
    const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    const mine = all.find(i => i.userId === user.uid && i.week === weekKey());
    if (mine) { setSaved(mine.text); setDocId(mine.id); }
  };

  useEffect(() => { if (user) load(); }, [user]);

  const save = async () => {
    if (!intention.trim()) return;
    if (docId) {
      await updateDoc(doc(db, "intentions", docId), { text: intention });
    } else {
      const ref = await addDoc(collection(db, "intentions"), { text: intention, userId: user.uid, week: weekKey() });
      setDocId(ref.id);
    }
    setSaved(intention);
    setIntention("");
  };

  return (
    <div style={{ ...S.cardSm, background: "linear-gradient(135deg, #fff9fb, #fce4ec)", border: "1px dashed #f8bbd0" }}>
      <h3 style={{ ...S.h3, color: "#e991b5" }}>🌿 This Week's Intention</h3>
      {saved ? (
        <div>
          <p style={{ fontSize: "16px", fontStyle: "italic", color: "#777", marginBottom: "12px" }}>"{saved}"</p>
          <button style={{ ...S.btnGhost, fontSize: "12px", color: "#e991b5", textDecoration: "underline" }} onClick={() => setSaved("")}>Change intention</button>
        </div>
      ) : (
        <div style={S.flex(10)}>
          <input style={{ ...S.input, flex: 1 }} placeholder="This week I want to focus on..." value={intention} onChange={e => setIntention(e.target.value)}
            onKeyDown={e => e.key === "Enter" && save()} />
          <button style={S.btnPrimary} onClick={save}>Set</button>
        </div>
      )}
    </div>
  );
}

// ─── Language Notebook Modal ──────────────────────────────────────────────────

function LanguageNotebook({ lang, db, user, onClose }) {
  const isKorean = lang === "korean";
  const colName = isKorean ? "krWords" : "hiWords";
  const accent = isKorean ? "#e991b5" : "#7c3aed";
  const spineGradient = isKorean
    ? "linear-gradient(90deg, #f8bbd0, #fce4ec)"
    : "linear-gradient(90deg, #ddd6fe, #ede9fe)";
  const flag = isKorean ? "🇰🇷" : "🇮🇳";
  const titleText = isKorean ? "한국어 노트 ✦" : "हिंदी नोट्स ✦";
  const subText = isKorean ? "Korean vocabulary notebook" : "Hindi vocabulary notebook";
  const placeholderWord = isKorean ? "Word (한국어)" : "Word (हिंदी)";

  const [words, setWords] = useState([]);
  const [wordInput, setWordInput] = useState("");
  const [meaningInput, setMeaningInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const load = async () => {
    const snap = await getDocs(collection(db, colName));
    setWords(
      snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(w => w.userId === user.uid)
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    );
  };

  useEffect(() => { if (user) load(); }, [user]);

  const addWord = async () => {
    if (!wordInput.trim() || !meaningInput.trim()) return;
    await addDoc(collection(db, colName), {
      word: wordInput.trim(),
      meaning: meaningInput.trim(),
      userId: user.uid,
      createdAt: Date.now(),
      date: new Date().toLocaleDateString()
    });
    setWordInput("");
    setMeaningInput("");
    load();
  };

  const delWord = async (id) => {
    await deleteDoc(doc(db, colName, id));
    load();
  };

  const filtered = words.filter(w =>
    w.word?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.meaning?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Notebook line style
  const lineStyle = {
    width: "100%",
    padding: "14px 0",
    borderBottom: `1px dashed ${isKorean ? "#fce4ec" : "#ede9fe"}`,
    display: "flex",
    alignItems: "center",
    gap: "16px"
  };

  return (
    <div style={S.overlay} onClick={onClose}>
      <div
        style={{
          background: "#fffdf9",
          borderRadius: "28px",
          width: "90%",
          maxWidth: "520px",
          maxHeight: "85vh",
          overflow: "hidden",
          boxShadow: "0 40px 100px rgba(0,0,0,0.12)",
          display: "flex",
          flexDirection: "column",
          position: "relative"
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Spine */}
        <div style={{ height: "8px", background: spineGradient, flexShrink: 0 }} />

        {/* Header */}
        <div style={{
          padding: "22px 28px 16px",
          borderBottom: `1px solid ${isKorean ? "#fce4ec" : "#ede9fe"}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexShrink: 0
        }}>
          <div>
            <div style={{ fontSize: "22px", fontWeight: "800", color: accent }}>{flag} {titleText}</div>
            <div style={{ fontSize: "12px", color: "#ccc", marginTop: "3px" }}>{subText} · {words.length} words saved</div>
          </div>
          <button style={S.btnGhost} onClick={onClose}>✕</button>
        </div>

        {/* Add word row */}
        <div style={{ padding: "16px 28px", borderBottom: `1px solid ${isKorean ? "#fce4ec" : "#ede9fe"}`, flexShrink: 0 }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              style={{ ...S.input, flex: 1, fontSize: "15px", fontWeight: "600" }}
              placeholder={placeholderWord}
              value={wordInput}
              onChange={e => setWordInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addWord()}
            />
            <input
              style={{ ...S.input, flex: 1 }}
              placeholder="Meaning / Translation"
              value={meaningInput}
              onChange={e => setMeaningInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addWord()}
            />
            <button
              style={{
                ...S.btnPrimary,
                padding: "12px 20px",
                background: isKorean
                  ? "linear-gradient(135deg, #f8bbd0, #e991b5)"
                  : "linear-gradient(135deg, #ddd6fe, #7c3aed)",
                boxShadow: isKorean
                  ? "0 4px 20px rgba(233,145,181,0.3)"
                  : "0 4px 20px rgba(124,58,237,0.3)"
              }}
              onClick={addWord}
            >
              + Add
            </button>
          </div>
        </div>

        {/* Search */}
        {words.length > 3 && (
          <div style={{ padding: "12px 28px 0", flexShrink: 0 }}>
            <input
              style={{ ...S.input, background: isKorean ? "#fff9fb" : "#faf8ff" }}
              placeholder="🔍 Search words..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        {/* Word list — notebook lines */}
        <div style={{ overflowY: "auto", flex: 1, padding: "8px 28px 24px" }}>
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "#ddd" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>{isKorean ? "📚" : "📖"}</div>
              <p style={{ fontSize: "14px" }}>
                {words.length === 0 ? "Add your first word above!" : "No words match your search."}
              </p>
            </div>
          )}
          {filtered.map((w, i) => (
            <div key={w.id} style={lineStyle}>
              {/* Line number */}
              <span style={{ fontSize: "11px", color: "#e0d8d5", fontWeight: "600", minWidth: "20px", textAlign: "right" }}>
                {i + 1}
              </span>
              {/* Word */}
              <span style={{
                fontSize: "18px",
                fontWeight: "800",
                color: accent,
                minWidth: "120px",
                letterSpacing: isKorean ? "0" : "0.5px"
              }}>
                {w.word}
              </span>
              {/* Divider dot */}
              <span style={{ color: "#e0d8d5", fontSize: "16px" }}>·</span>
              {/* Meaning */}
              <span style={{ fontSize: "14px", color: "#888", flex: 1 }}>{w.meaning}</span>
              {/* Date */}
              <span style={{ fontSize: "10px", color: "#ccc", whiteSpace: "nowrap" }}>{w.date}</span>
              {/* Delete */}
              <button style={{ ...S.btnGhost, fontSize: "16px", flexShrink: 0 }} onClick={() => delWord(w.id)}>×</button>
            </div>
          ))}
        </div>

        {/* Footer */}
        {words.length > 0 && (
          <div style={{
            padding: "12px 28px",
            borderTop: `1px solid ${isKorean ? "#fce4ec" : "#ede9fe"}`,
            textAlign: "center",
            flexShrink: 0
          }}>
            <span style={{ fontSize: "11px", color: "#ccc" }}>
              {isKorean ? "💗 화이팅! Keep learning!" : "💜 बहुत बढ़िया! Keep going!"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Manifesting Page ─────────────────────────────────────────────────────────

function ManifestPage({ db, user }) {
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [visionImages, setVisionImages] = useState([]);
  const [labels, setLabels] = useState({});
  const [editingLabel, setEditingLabel] = useState(null);
  const [labelInput, setLabelInput] = useState("");
  const fileRefs = useRef([]);

  // Rotate quotes
  useEffect(() => {
    const t = setInterval(() => setQuoteIdx(i => (i + 1) % manifestQuotes.length), 4500);
    return () => clearInterval(t);
  }, []);

  // Load vision images from Firestore (stored as base64)
  const loadImages = async () => {
    const snap = await getDocs(collection(db, "visionImages"));
    const mine = snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(v => v.userId === user.uid)
      .sort((a, b) => (a.slot || 0) - (b.slot || 0));
    setVisionImages(mine);
    const lblMap = {};
    mine.forEach(v => { if (v.label) lblMap[v.slot] = v.label; });
    setLabels(lblMap);
  };

  useEffect(() => { if (user) loadImages(); }, [user]);

  const handleImageUpload = async (slot, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target.result;
      // Remove existing image in this slot
      const existing = visionImages.find(v => v.slot === slot);
      if (existing) await deleteDoc(doc(db, "visionImages", existing.id));
      await addDoc(collection(db, "visionImages"), {
        userId: user.uid,
        slot,
        base64,
        label: labels[slot] || "",
        createdAt: Date.now()
      });
      loadImages();
    };
    reader.readAsDataURL(file);
  };

  const removeImage = async (slot) => {
    const existing = visionImages.find(v => v.slot === slot);
    if (existing) {
      await deleteDoc(doc(db, "visionImages", existing.id));
      loadImages();
    }
  };

  const saveLabel = async (slot) => {
    const existing = visionImages.find(v => v.slot === slot);
    if (existing) {
      await updateDoc(doc(db, "visionImages", existing.id), { label: labelInput });
    }
    setLabels(prev => ({ ...prev, [slot]: labelInput }));
    setEditingLabel(null);
    setLabelInput("");
    loadImages();
  };

  const SLOTS = 6;
  const slotEmojis = ["🌟", "🌴", "💫", "🌸", "✈️", "💎"];
  const slotHints = ["Your dream life", "Places to visit", "Your future self", "Love & relationships", "Travel goals", "Abundance & success"];

  const gradientBg = "linear-gradient(135deg, #fff5f9 0%, #fdf8f6 40%, #f9f0ff 100%)";

  return (
    <div style={S.page}>

      {/* Hero quote banner */}
      <div style={{
        background: gradientBg,
        borderRadius: "28px",
        padding: "40px 48px",
        textAlign: "center",
        marginBottom: "28px",
        border: "1px solid #fce4ec",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Decorative blobs */}
        <div style={{ position: "absolute", top: "-30px", right: "-30px", width: "120px", height: "120px", borderRadius: "50%", background: "#fce4ec", opacity: 0.5 }} />
        <div style={{ position: "absolute", bottom: "-20px", left: "40px", width: "80px", height: "80px", borderRadius: "50%", background: "#ede9fe", opacity: 0.4 }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "3px", color: "#e991b5", textTransform: "uppercase", marginBottom: "16px" }}>
            ✦ your daily manifestation ✦
          </p>
          <p style={{
            fontSize: "26px",
            fontStyle: "italic",
            fontWeight: "800",
            color: "#c9557a",
            lineHeight: "1.5",
            marginBottom: "20px",
            transition: "opacity 0.5s",
            maxWidth: "600px",
            margin: "0 auto 20px"
          }}>
            "{manifestQuotes[quoteIdx]}"
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
            {manifestQuotes.map((_, i) => (
              <div
                key={i}
                onClick={() => setQuoteIdx(i)}
                style={{
                  width: i === quoteIdx ? "24px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  background: i === quoteIdx ? "#e991b5" : "#f8bbd0",
                  cursor: "pointer",
                  transition: "all 0.3s"
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Vision Board */}
      <div style={{ ...S.card, marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
          <h2 style={{ ...S.h2, marginBottom: 0 }}>🖼️ My Vision Board</h2>
          <span style={{ fontSize: "12px", color: "#ccc" }}>Click any frame to upload your dream</span>
        </div>
        <p style={{ fontSize: "13px", color: "#bbb", marginBottom: "24px" }}>
          Visualise it. Believe it. Receive it. ✨
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px"
        }}>
          {Array.from({ length: SLOTS }, (_, slot) => {
            const img = visionImages.find(v => v.slot === slot);
            return (
              <div key={slot} style={{ position: "relative" }}>
                <input
                  type="file"
                  accept="image/*"
                  ref={el => fileRefs.current[slot] = el}
                  style={{ display: "none" }}
                  onChange={e => handleImageUpload(slot, e.target.files[0])}
                />
                <div
                  onClick={() => !img && fileRefs.current[slot]?.click()}
                  style={{
                    borderRadius: "20px",
                    overflow: "hidden",
                    aspectRatio: "1 / 1",
                    position: "relative",
                    cursor: img ? "default" : "pointer",
                    background: img ? "transparent" : "#fafafa",
                    border: img ? "none" : "2px dashed #f5e8ec",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: "8px",
                    transition: "all 0.2s"
                  }}
                >
                  {img ? (
                    <>
                      <img
                        src={img.base64}
                        alt=""
                        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "20px" }}
                      />
                      {/* Overlay on hover */}
                      <div style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "20px",
                        background: "rgba(255,255,255,0)",
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "center",
                        padding: "12px"
                      }}>
                        {labels[slot] && (
                          <div style={{
                            background: "rgba(255,255,255,0.88)",
                            backdropFilter: "blur(8px)",
                            borderRadius: "12px",
                            padding: "6px 14px",
                            fontSize: "12px",
                            fontWeight: "700",
                            color: "#c9557a",
                            width: "100%",
                            textAlign: "center"
                          }}>
                            {labels[slot]}
                          </div>
                        )}
                      </div>
                      {/* Action buttons */}
                      <div style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        display: "flex",
                        gap: "6px"
                      }}>
                        <button
                          onClick={e => { e.stopPropagation(); fileRefs.current[slot]?.click(); }}
                          style={{
                            background: "rgba(255,255,255,0.9)",
                            border: "none",
                            borderRadius: "8px",
                            padding: "5px 8px",
                            cursor: "pointer",
                            fontSize: "12px"
                          }}
                          title="Replace image"
                        >✏️</button>
                        <button
                          onClick={e => { e.stopPropagation(); removeImage(slot); }}
                          style={{
                            background: "rgba(255,255,255,0.9)",
                            border: "none",
                            borderRadius: "8px",
                            padding: "5px 8px",
                            cursor: "pointer",
                            fontSize: "12px",
                            color: "#ef9a9a"
                          }}
                          title="Remove"
                        >×</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span style={{ fontSize: "32px" }}>{slotEmojis[slot]}</span>
                      <span style={{ fontSize: "12px", color: "#ccc", fontWeight: "600", textAlign: "center", padding: "0 12px" }}>
                        {slotHints[slot]}
                      </span>
                      <span style={{ fontSize: "11px", color: "#e0d0d5", marginTop: "2px" }}>tap to upload</span>
                    </>
                  )}
                </div>

                {/* Label editor */}
                {img && (
                  <div style={{ marginTop: "8px", textAlign: "center" }}>
                    {editingLabel === slot ? (
                      <div style={{ display: "flex", gap: "6px" }}>
                        <input
                          style={{ ...S.input, fontSize: "12px", padding: "8px 12px" }}
                          placeholder="Add a label..."
                          value={labelInput}
                          onChange={e => setLabelInput(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && saveLabel(slot)}
                          autoFocus
                        />
                        <button style={{ ...S.btnPrimary, padding: "8px 14px", fontSize: "12px" }} onClick={() => saveLabel(slot)}>✓</button>
                        <button style={{ ...S.btnSecondary, padding: "8px 12px", fontSize: "12px" }} onClick={() => { setEditingLabel(null); setLabelInput(""); }}>✕</button>
                      </div>
                    ) : (
                      <button
                        style={{ ...S.btnGhost, fontSize: "11px", color: "#e991b5", textDecoration: "underline" }}
                        onClick={() => { setEditingLabel(slot); setLabelInput(labels[slot] || ""); }}
                      >
                        {labels[slot] ? "✏️ Edit label" : "+ Add label"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Affirmation cards */}
      <div style={{ ...S.card }}>
        <h2 style={S.h2}>💜 Daily Affirmations</h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "14px"
        }}>
          {manifestAffirmations.map((aff, i) => (
            <div
              key={i}
              style={{
                padding: "20px 22px",
                borderRadius: "18px",
                background: i % 4 === 0 ? "#fff5f8" :
                             i % 4 === 1 ? "#f9f5ff" :
                             i % 4 === 2 ? "#f0fff8" : "#fffbf0",
                border: `1px solid ${i % 4 === 0 ? "#fce4ec" :
                                      i % 4 === 1 ? "#ede9fe" :
                                      i % 4 === 2 ? "#d1fae5" : "#fef3c7"}`,
                display: "flex",
                gap: "14px",
                alignItems: "flex-start"
              }}
            >
              <span style={{ fontSize: "22px", flexShrink: 0 }}>{aff.emoji}</span>
              <p style={{
                fontSize: "14px",
                lineHeight: "1.65",
                fontStyle: "italic",
                color: i % 4 === 0 ? "#c9557a" :
                       i % 4 === 1 ? "#6d28d9" :
                       i % 4 === 2 ? "#059669" : "#b45309",
                fontWeight: "600"
              }}>
                {aff.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [tab, setTab] = useState("journal");

  // Note modals
  const [noteOpen, setNoteOpen] = useState(null); // "korean" | "hindi" | null

  // Journal
  const [title, setTitle] = useState("");
  const [entry, setEntry] = useState("");
  const [mood, setMood] = useState("✨");
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [tags, setTags] = useState([]);
  const [quote, setQuote] = useState(affirmations[0]);
  const [prompt, setPrompt] = useState("");

  // Todos & Goals
  const [todos, setTodos] = useState([]);
  const [todoInput, setTodoInput] = useState("");
  const [goals, setGoals] = useState([]);
  const [goalInput, setGoalInput] = useState("");

  // Expenses
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("food");
  const [expenses, setExpenses] = useState([]);
  const [expenseFeel, setExpenseFeel] = useState("guiltfree");
  const [monthBudget, setMonthBudget] = useState(null);
  const [budgetInput, setBudgetInput] = useState("");

  const availableTags = ["#gratitude", "#anxiety", "#win", "#growth", "#love", "#work", "#health", "#family"];

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) loadAll(u.uid);
    });
    return () => unsub();
  }, []);

  const loadAll = (uid) => {
    loadEntries(uid);
    loadTodos(uid);
    loadExpenses(uid);
    loadGoals(uid);
    refreshQuote();
  };

  const refreshQuote = () => setQuote(affirmations[Math.floor(Math.random() * affirmations.length)]);
  const randomPrompt = () => setPrompt(journalPrompts[Math.floor(Math.random() * journalPrompts.length)]);

  const handleAuth = async () => {
    try {
      if (isRegistering) await createUserWithEmailAndPassword(auth, email, password);
      else await signInWithEmailAndPassword(auth, email, password);
    } catch (err) { alert(err.message); }
  };
  const handleLogout = () => signOut(auth).then(() => { setUser(null); setEntries([]); });

  const loadEntries = async (uid) => {
    const snap = await getDocs(collection(db, "entries"));
    setEntries(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(e => e.userId === uid || !e.userId)
      .sort((a, b) => new Date(b.date) - new Date(a.date)));
  };
  const loadTodos = async (uid) => {
    const snap = await getDocs(collection(db, "todos"));
    setTodos(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(t => t.userId === uid || !t.userId));
  };
  const loadGoals = async (uid) => {
    const snap = await getDocs(collection(db, "goals"));
    setGoals(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(g => g.userId === uid || !g.userId));
  };
  const loadExpenses = async (uid) => {
    const snap = await getDocs(collection(db, "expenses"));
    setExpenses(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(e => e.userId === uid || !e.userId));
  };

  const toggleTodo = async (id, cur) => { await updateDoc(doc(db, "todos", id), { completed: !cur }); loadTodos(user.uid); };
  const updateGoal = async (id, val) => { await updateDoc(doc(db, "goals", id), { progress: val }); loadGoals(user.uid); };
  const del = async (col, id) => {
    await deleteDoc(doc(db, col, id));
    if (col === "entries") { loadEntries(user.uid); setSelectedEntry(null); }
    else if (col === "todos") loadTodos(user.uid);
    else if (col === "expenses") loadExpenses(user.uid);
    else if (col === "goals") loadGoals(user.uid);
  };

  const saveEntry = async () => {
    if (!title.trim() || !entry.trim()) return;
    await addDoc(collection(db, "entries"), { title, text: entry, mood, userId: user.uid, date: new Date().toLocaleDateString(), tags });
    setTitle(""); setEntry(""); setTags([]); setPrompt(""); loadEntries(user.uid);
  };

  const totalSpent = expenses.reduce((a, b) => a + (Number(b.amount) || 0), 0);
  const thisMonth = expenses.filter(e => {
    const d = new Date(e.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const monthSpent = thisMonth.reduce((a, b) => a + (Number(b.amount) || 0), 0);

  // ── Login ─────────────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div style={S.loginWrap}>
        <div style={S.loginCard}>
          <div style={{ fontSize: "44px", marginBottom: "8px" }}>🌸</div>
          <h1 style={{ fontSize: "28px", fontWeight: "900", color: "#e991b5", marginBottom: "4px" }}>InnerBloom</h1>
          <p style={{ fontSize: "13px", color: "#ccc", marginBottom: "32px" }}>
            {isRegistering ? "Create your sanctuary" : "Be Happy, love"}
          </p>
          <input style={{ ...S.input, marginBottom: "12px" }} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input style={{ ...S.input, marginBottom: "20px" }} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAuth()} />
          <button style={{ ...S.btnPrimary, width: "100%" }} onClick={handleAuth}>{isRegistering ? "Sign Up" : "Login"}</button>
          <p style={{ marginTop: "20px", fontSize: "12px", color: "#e991b5", cursor: "pointer" }} onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? "Already have an account? Login" : "New here? Sign Up"}
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "journal", label: "📓 Journal" },
    { id: "mindfulness", label: "🧘 Mindfulness" },
    { id: "goals", label: "🎯 Goals" },
    { id: "money", label: "💰 Money" },
    { id: "manifest", label: "✨ Manifest" },
  ];

  return (
    <div style={S.app}>

      {/* Language Notebook Modals */}
      {noteOpen === "korean" && (
        <LanguageNotebook lang="korean" db={db} user={user} onClose={() => setNoteOpen(null)} />
      )}
      {noteOpen === "hindi" && (
        <LanguageNotebook lang="hindi" db={db} user={user} onClose={() => setNoteOpen(null)} />
      )}

      {/* Entry Modal */}
      {selectedEntry && (
        <div style={S.overlay} onClick={() => setSelectedEntry(null)}>
          <div style={S.modal} onClick={e => e.stopPropagation()}>
            <button style={{ ...S.btnGhost, position: "absolute", top: "20px", right: "24px" }} onClick={() => setSelectedEntry(null)}>✕</button>
            <p style={{ fontSize: "11px", color: "#ccc", marginBottom: "8px" }}>{selectedEntry.date} · {selectedEntry.mood}</p>
            <h2 style={{ fontSize: "26px", fontWeight: "800", color: "#e991b5", marginBottom: "16px" }}>{selectedEntry.title}</h2>
            {(selectedEntry.tags || []).length > 0 && (
              <div style={{ marginBottom: "16px" }}>
                {selectedEntry.tags.map(t => <span key={t} style={S.tag("#e991b5")}>{t}</span>)}
              </div>
            )}
            <p style={{ fontSize: "16px", lineHeight: "1.9", color: "#666", whiteSpace: "pre-wrap" }}>{selectedEntry.text}</p>
            <div style={S.spacer(32)} />
            <button style={{ background: "none", border: "1px solid #ffcdd2", color: "#ffcdd2", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "11px" }}
              onClick={() => del("entries", selectedEntry.id)}>Delete Memory</button>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={S.nav}>
        <span style={S.navLogo}>🌸 InnerBloom</span>
        <div style={S.navTabs}>
          {tabs.map(t => (
            <button key={t.id} style={S.navTab(tab === t.id)} onClick={() => setTab(t.id)}>{t.label}</button>
          ))}
        </div>
        <div style={S.navRight}>
          {/* Language Notebook Buttons */}
          <button
            onClick={() => setNoteOpen("korean")}
            style={{
              padding: "7px 14px",
              borderRadius: "20px",
              border: "1px solid #fce4ec",
              background: "white",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "700",
              color: "#e991b5",
              display: "flex",
              alignItems: "center",
              gap: "5px"
            }}
            title="Open Korean Notebook"
          >
            🇰🇷 Korean
          </button>
          <button
            onClick={() => setNoteOpen("hindi")}
            style={{
              padding: "7px 14px",
              borderRadius: "20px",
              border: "1px solid #ede9fe",
              background: "white",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "700",
              color: "#7c3aed",
              display: "flex",
              alignItems: "center",
              gap: "5px"
            }}
            title="Open Hindi Notebook"
          >
            🇮🇳 Hindi
          </button>
          <span style={{ fontSize: "12px", color: "#ccc" }}>{user.email}</span>
          <button style={S.btnSecondary} onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {/* ── JOURNAL TAB ── */}
      {tab === "journal" && (
        <div style={S.page}>
          <WeeklyIntention db={db} user={user} />
          <div style={{ ...S.spacer(20) }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px" }}>
            <div>
              <div style={{ ...S.cardSm, marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
                <p style={{ fontSize: "16px", fontStyle: "italic", color: "#888" }}>"{quote}"</p>
                <button style={{ ...S.btnGhost, color: "#f8bbd0", whiteSpace: "nowrap", fontSize: "12px" }} onClick={refreshQuote}>new ✦</button>
              </div>

              {prompt && (
                <div style={{ ...S.cardSm, background: "#fce4ec", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ fontSize: "14px", color: "#e991b5", fontStyle: "italic" }}>✏️ {prompt}</p>
                  <button style={S.btnGhost} onClick={() => setPrompt("")}>✕</button>
                </div>
              )}

              <div style={S.card}>
                <div style={{ ...S.flex(16), marginBottom: "20px" }}>
                  {["🌸", "☁️", "✨", "🌙", "🩹"].map(m => (
                    <button key={m} style={{ fontSize: "26px", background: "none", border: "none", cursor: "pointer", opacity: mood === m ? 1 : 0.3, transform: mood === m ? "scale(1.2)" : "scale(1)", transition: "all 0.2s" }}
                      onClick={() => setMood(m)}>{m}</button>
                  ))}
                  <button style={{ marginLeft: "auto", ...S.btnSecondary, fontSize: "12px" }} onClick={randomPrompt}>
                    ✦ Spark an idea
                  </button>
                </div>

                <input style={{ ...S.input, fontSize: "22px", fontWeight: "800", border: "none", borderBottom: "2px solid #fdf0f0", borderRadius: 0, padding: "8px 0", marginBottom: "20px", background: "transparent" }}
                  placeholder="Title of this moment..." value={title} onChange={e => setTitle(e.target.value)} />

                <textarea style={{ ...S.textarea, height: "180px", border: "none", background: "transparent", padding: 0, marginBottom: "16px" }}
                  placeholder="Start writing..." value={entry} onChange={e => setEntry(e.target.value)} />

                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
                  {availableTags.map(t => (
                    <button key={t} style={S.chip(tags.includes(t))} onClick={() => setTags(tags.includes(t) ? tags.filter(x => x !== t) : [...tags, t])}>{t}</button>
                  ))}
                </div>

                <div style={{ textAlign: "right" }}>
                  <button style={S.btnPrimary} onClick={saveEntry}>Save to Journey 🌸</button>
                </div>
              </div>
            </div>

            <div>
              <div style={{ ...S.card, marginBottom: "20px" }}>
                <h2 style={S.h2}>📖 Journey</h2>
                <div style={{ maxHeight: "320px", overflowY: "auto" }}>
                  {entries.map(e => (
                    <div key={e.id} style={{ padding: "14px", background: "#fafafa", borderRadius: "16px", marginBottom: "8px", cursor: "pointer" }}
                      onClick={() => setSelectedEntry(e)}>
                      <div style={{ fontSize: "10px", color: "#bbb", marginBottom: "4px" }}>{e.date} <span style={{ marginLeft: "4px" }}>{e.mood}</span></div>
                      <div style={{ fontSize: "13px", fontWeight: "700", color: "#555", marginBottom: "4px" }}>{e.title}</div>
                      {(e.tags || []).length > 0 && <div>{e.tags.map(t => <span key={t} style={S.tag("#e991b5")}>{t}</span>)}</div>}
                    </div>
                  ))}
                  {entries.length === 0 && <p style={{ color: "#ddd", fontSize: "13px" }}>No entries yet 🌱</p>}
                </div>
              </div>
              <MoodChart entries={entries} />
            </div>
          </div>
        </div>
      )}

      {/* ── MINDFULNESS TAB ── */}
      {tab === "mindfulness" && (
        <div style={S.page}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            <BreathingWidget />
            <GratitudeJar db={db} user={user} />
          </div>
          <div style={S.spacer(24)} />
          <FutureLetter db={db} user={user} />
        </div>
      )}

      {/* ── GOALS TAB ── */}
      {tab === "goals" && (
        <div style={S.page}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            <div style={S.card}>
              <h2 style={S.h2}>✏️ Today's Intentions</h2>
              <div style={S.flex(8)}>
                <input style={{ ...S.input, flex: 1 }} placeholder="+ New intention" value={todoInput} onChange={e => setTodoInput(e.target.value)}
                  onKeyDown={async e => {
                    if (e.key === "Enter" && todoInput.trim()) {
                      await addDoc(collection(db, "todos"), { text: todoInput, userId: user.uid, completed: false });
                      setTodoInput(""); loadTodos(user.uid);
                    }
                  }} />
                <button style={S.btnDark} onClick={async () => {
                  if (!todoInput.trim()) return;
                  await addDoc(collection(db, "todos"), { text: todoInput, userId: user.uid, completed: false });
                  setTodoInput(""); loadTodos(user.uid);
                }}>Add</button>
              </div>
              <div style={S.spacer(12)} />
              <div style={{ maxHeight: "340px", overflowY: "auto" }}>
                {todos.map(t => (
                  <div key={t.id} style={{ ...S.flex(12), padding: "12px 14px", background: t.completed ? "#fafafa" : "white", borderRadius: "14px", marginBottom: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
                    <input type="checkbox" checked={t.completed || false} onChange={() => toggleTodo(t.id, t.completed)}
                      style={{ accentColor: "#f8bbd0", width: "16px", height: "16px" }} />
                    <span style={{ flex: 1, textDecoration: t.completed ? "line-through" : "none", color: t.completed ? "#ccc" : "#544a47", fontSize: "14px" }}>{t.text}</span>
                    <button style={S.btnGhost} onClick={() => del("todos", t.id)}>×</button>
                  </div>
                ))}
                {todos.length === 0 && <p style={{ color: "#ddd", fontSize: "13px" }}>Nothing here yet 🌿</p>}
              </div>
            </div>

            <div style={S.card}>
              <h2 style={S.h2}>🎯 2026 Goals</h2>
              <div style={S.flex(8)}>
                <input style={{ ...S.input, flex: 1 }} placeholder="+ A goal for 2026" value={goalInput} onChange={e => setGoalInput(e.target.value)}
                  onKeyDown={async e => {
                    if (e.key === "Enter" && goalInput.trim()) {
                      await addDoc(collection(db, "goals"), { text: goalInput, userId: user.uid, progress: 0 });
                      setGoalInput(""); loadGoals(user.uid);
                    }
                  }} />
                <button style={S.btnDark} onClick={async () => {
                  if (!goalInput.trim()) return;
                  await addDoc(collection(db, "goals"), { text: goalInput, userId: user.uid, progress: 0 });
                  setGoalInput(""); loadGoals(user.uid);
                }}>Add</button>
              </div>
              <div style={S.spacer(12)} />
              <div style={{ maxHeight: "340px", overflowY: "auto" }}>
                {goals.map(g => (
                  <div key={g.id} style={{ padding: "16px", background: "white", borderRadius: "16px", marginBottom: "10px", boxShadow: "0 4px 15px rgba(0,0,0,0.02)", border: "1px solid #fff5f7" }}>
                    <div style={{ ...S.flex(8), marginBottom: "10px" }}>
                      <span style={{ flex: 1, fontSize: "13px", fontWeight: "600" }}>{g.text}</span>
                      {g.progress === 100 && <span style={S.pill}>🎉 Done!</span>}
                      <button style={S.btnGhost} onClick={() => del("goals", g.id)}>×</button>
                    </div>
                    <input type="range" min="0" max="100" value={g.progress}
                      onChange={e => updateGoal(g.id, parseInt(e.target.value))}
                      style={{ width: "100%", accentColor: "#f8bbd0", cursor: "pointer" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                      <span style={{ fontSize: "10px", color: "#ddd" }}>0%</span>
                      <span style={{ fontSize: "10px", color: "#e991b5", fontWeight: "700" }}>{g.progress}%</span>
                      <span style={{ fontSize: "10px", color: "#ddd" }}>100%</span>
                    </div>
                    <div style={{ height: "6px", background: "#fdf0f0", borderRadius: "6px", marginTop: "6px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${g.progress}%`, background: "linear-gradient(90deg, #f8bbd0, #e991b5)", borderRadius: "6px", transition: "width 0.3s" }} />
                    </div>
                  </div>
                ))}
                {goals.length === 0 && <p style={{ color: "#ddd", fontSize: "13px" }}>Dream big 🌠</p>}
              </div>
            </div>
          </div>
          <HabitTracker db={db} user={user} />
        </div>
      )}

      {/* ── MONEY TAB ── */}
      {tab === "money" && (
        <div style={S.page}>
          <div style={{ display: "grid", gridTemplateColumns: "420px 1fr", gap: "24px" }}>
            <div>
              <div style={S.card}>
                <h2 style={S.h2}>💰 Log a Spend</h2>

                {monthBudget ? (
                  <div style={{ marginBottom: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ fontSize: "12px", color: "#aaa" }}>Monthly Budget</span>
                      <span style={{ fontSize: "12px", fontWeight: "700", color: monthSpent > monthBudget ? "#ef9a9a" : "#a5d6a7" }}>
                        ${monthSpent.toFixed(2)} / ${monthBudget}
                      </span>
                    </div>
                    <div style={{ height: "8px", background: "#f5f5f5", borderRadius: "8px", overflow: "hidden" }}>
                      <div style={{
                        height: "100%", width: `${Math.min((monthSpent / monthBudget) * 100, 100)}%`,
                        background: monthSpent > monthBudget * 0.85 ? "linear-gradient(90deg, #ef9a9a, #e57373)" : "linear-gradient(90deg, #a5d6a7, #66bb6a)",
                        borderRadius: "8px", transition: "width 0.4s"
                      }} />
                    </div>
                    {monthSpent > monthBudget * 0.85 && <p style={{ fontSize: "11px", color: "#ef9a9a", marginTop: "6px" }}>⚠️ Getting close to your budget!</p>}
                    <button style={{ ...S.btnGhost, fontSize: "11px", color: "#ccc", marginTop: "4px" }} onClick={() => setMonthBudget(null)}>Change budget</button>
                  </div>
                ) : (
                  <div style={{ ...S.flex(8), marginBottom: "20px" }}>
                    <input style={{ ...S.input, flex: 1 }} type="number" placeholder="Set monthly budget ($)" value={budgetInput} onChange={e => setBudgetInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && budgetInput && setMonthBudget(parseFloat(budgetInput))} />
                    <button style={S.btnDark} onClick={() => budgetInput && setMonthBudget(parseFloat(budgetInput))}>Set</button>
                  </div>
                )}

                <label style={S.label}>Item name</label>
                <input style={{ ...S.input, marginBottom: "12px" }} placeholder="What did you spend on?" value={expenseName} onChange={e => setExpenseName(e.target.value)} />

                <div style={S.grid2}>
                  <div>
                    <label style={S.label}>Amount ($)</label>
                    <input style={{ ...S.input, marginBottom: "12px" }} type="number" placeholder="0.00" value={expenseAmount} onChange={e => setExpenseAmount(e.target.value)} />
                  </div>
                  <div>
                    <label style={S.label}>Category</label>
                    <select style={{ ...S.input, marginBottom: "12px" }} value={expenseCategory} onChange={e => setExpenseCategory(e.target.value)}>
                      {expenseCategories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                </div>

                <label style={S.label}>How did it feel?</label>
                <div style={{ ...S.flex(8), marginBottom: "16px" }}>
                  {[{ v: "guiltfree", l: "😊 Guilt-free" }, { v: "neutral", l: "😐 Neutral" }, { v: "regret", l: "😬 Regret" }].map(f => (
                    <button key={f.v} style={S.chip(expenseFeel === f.v)} onClick={() => setExpenseFeel(f.v)}>{f.l}</button>
                  ))}
                </div>

                <button style={{ ...S.btnPrimary, width: "100%" }} onClick={async () => {
                  if (!expenseName.trim() || !expenseAmount) return;
                  await addDoc(collection(db, "expenses"), {
                    name: expenseName, amount: parseFloat(expenseAmount), category: expenseCategory,
                    feel: expenseFeel, userId: user.uid, date: new Date().toLocaleString()
                  });
                  setExpenseName(""); setExpenseAmount(""); loadExpenses(user.uid);
                }}>Log Spend</button>
              </div>
            </div>

            <div>
              <div style={{ ...S.card, marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <h2 style={{ ...S.h2, marginBottom: 0 }}>Spending Breakdown</h2>
                  <span style={{ fontSize: "20px", fontWeight: "900", color: "#e991b5" }}>${totalSpent.toFixed(2)}</span>
                </div>
                <ExpensePieChart expenses={expenses} />
              </div>

              <div style={S.card}>
                <h2 style={S.h2}>All Spends</h2>
                <div style={{ maxHeight: "320px", overflowY: "auto" }}>
                  {expenses.map(exp => (
                    <div key={exp.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #fafafa" }}>
                      <div style={S.flex(10)}>
                        <div style={{ width: "10px", height: "10px", borderRadius: "3px", background: categoryColors[exp.category] || "#e0e0e0", flexShrink: 0 }} />
                        <div>
                          <p style={{ fontSize: "13px", fontWeight: "600", marginBottom: "2px" }}>{exp.name}</p>
                          <p style={{ fontSize: "10px", color: "#ccc" }}>{exp.date?.split(",")[0]} · {exp.feel === "guiltfree" ? "😊" : exp.feel === "regret" ? "😬" : "😐"}</p>
                        </div>
                      </div>
                      <div style={S.flex(8)}>
                        <strong style={{ fontSize: "14px" }}>${Number(exp.amount).toFixed(2)}</strong>
                        <button style={S.btnGhost} onClick={() => del("expenses", exp.id)}>×</button>
                      </div>
                    </div>
                  ))}
                  {expenses.length === 0 && <p style={{ color: "#ddd", fontSize: "13px" }}>No spends logged yet 💸</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MANIFEST TAB ── */}
      {tab === "manifest" && (
        <ManifestPage db={db} user={user} />
      )}
    </div>
  );
}

export default App;