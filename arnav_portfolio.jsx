
import { useState, useEffect, useRef, useCallback } from "react";

// ── Framer Motion shim (uses CSS animations since framer-motion isn't bundled) ──
// We'll use pure CSS + intersection-observer for animations

const SKILLS = [
  { name: "Python", level: 92, cat: "Core", icon: "🐍" },
  { name: "Machine Learning", level: 88, cat: "AI/ML", icon: "🤖" },
  { name: "Deep Learning", level: 82, cat: "AI/ML", icon: "🧠" },
  { name: "NLP", level: 78, cat: "AI/ML", icon: "💬" },
  { name: "Computer Vision", level: 75, cat: "AI/ML", icon: "👁️" },
  { name: "Generative AI", level: 85, cat: "AI/ML", icon: "✨" },
  { name: "SQL / MySQL", level: 80, cat: "Data", icon: "🗄️" },
  { name: "FastAPI", level: 72, cat: "Backend", icon: "⚡" },
  { name: "Streamlit", level: 83, cat: "Backend", icon: "📊" },
  { name: "Docker", level: 68, cat: "DevOps", icon: "🐳" },
  { name: "JavaScript", level: 76, cat: "Core", icon: "⚙️" },
  { name: "GitHub", level: 88, cat: "DevOps", icon: "🔗" },
  { name: "Firebase", level: 70, cat: "Data", icon: "🔥" },
  { name: "HTML / CSS", level: 85, cat: "Core", icon: "🎨" },
];

const PROJECTS = [
  {
    title: "Coupon Hub",
    subtitle: "Marketplace for Coupon Exchange",
    desc: "A secure digital marketplace enabling users to buy, sell, and trade discount coupons. Features real-time listings, user authentication, and transaction management.",
    tech: ["Python", "HTML", "CSS", "JavaScript"],
    cat: "Web",
    github: "https://github.com/Arnav-Kapoor12",
    demo: "#",
    gradient: "linear-gradient(135deg,#06b6d4,#3b82f6)",
    emoji: "🎟️",
  },
  {
    title: "Ocean Guard",
    subtitle: "Crowdsourced Disaster Management",
    desc: "An AI-powered disaster management platform integrating social media analytics to deliver early warnings for ocean-related risks and coordinate emergency responses.",
    tech: ["Python", "ML", "Social Analytics", "Firebase"],
    cat: "AI/ML",
    github: "https://github.com/Arnav-Kapoor12",
    demo: "#",
    gradient: "linear-gradient(135deg,#0ea5e9,#14b8a6)",
    emoji: "🌊",
  },
  {
    title: "AI Chatbot Engine",
    subtitle: "NLP-Powered Conversational AI",
    desc: "Generative AI chatbot built with transformer-based models, featuring context retention, multi-turn conversations, and a Streamlit front-end for rapid deployment.",
    tech: ["Python", "NLP", "Streamlit", "FastAPI"],
    cat: "AI/ML",
    github: "https://github.com/Arnav-Kapoor12",
    demo: "#",
    gradient: "linear-gradient(135deg,#8b5cf6,#ec4899)",
    emoji: "🤖",
  },
  {
    title: "Vision Classifier",
    subtitle: "Deep Learning Image Recognition",
    desc: "CNN-based image classification system achieving high accuracy on custom datasets. Includes data augmentation pipeline and a REST API endpoint via FastAPI.",
    tech: ["Python", "CV", "Deep Learning", "Docker"],
    cat: "AI/ML",
    github: "https://github.com/Arnav-Kapoor12",
    demo: "#",
    gradient: "linear-gradient(135deg,#f59e0b,#ef4444)",
    emoji: "👁️",
  },
];

const TIMELINE = [
  {
    year: "2024 – Present",
    title: "B.Tech CSE Student",
    org: "Chandigarh Group of Colleges, Landran",
    desc: "Specialising in CSE, Data Structures & Algorithms, and Software Engineering. CGPA: 7.032.",
    type: "edu",
    icon: "🎓",
  },
  {
    year: "2025 – 2026",
    title: "Main Coordinator",
    org: "Career Sprint & Career Launchpad — TPP Dept.",
    desc: "Led end-to-end coordination of placement drives and career events for the entire department cohort.",
    type: "exp",
    icon: "🚀",
  },
  {
    year: "2025",
    title: "Management Head",
    org: "Code Rangers Club, CEC",
    desc: "Managed club operations, organised coding contests, and mentored junior members in DSA and web dev.",
    type: "exp",
    icon: "💻",
  },
  {
    year: "2024",
    title: "GSSoC Contributor",
    org: "GirlScript Summer of Code",
    desc: "Open-source contributor across multiple repositories, improving documentation and fixing bugs.",
    type: "exp",
    icon: "🌐",
  },
  {
    year: "2023 – 2024",
    title: "Intermediate (CBSE)",
    org: "Pathania Public School, Rohtak",
    desc: "Scored 75% in Class XII. Built foundational skills in Mathematics and Computer Science.",
    type: "edu",
    icon: "📚",
  },
];

const CERTS = [
  { title: "Cyber Job Simulation", org: "Deloitte", icon: "🔐", color: "#06b6d4" },
  { title: "Fundamentals of Generative AI", org: "Microsoft", icon: "✨", color: "#8b5cf6" },
  { title: "Algo Quiz – DSA MCQ Faceoff", org: "Unstop", icon: "🏆", color: "#f59e0b" },
  { title: "Cybersecurity Bootcamp", org: "Kali Linux Labs", icon: "🛡️", color: "#14b8a6" },
];

const ACHIEVEMENTS = [
  { title: "2nd Place – National Science Day", desc: "Inter-college event, CGC 2024", icon: "🥈" },
  { title: "Regional Winner – SAP Hackfest", desc: "Competed and won at regional level", icon: "🏆" },
  { title: "GSSoC Contributor", desc: "GirlScript Summer of Code open-source programme", icon: "⭐" },
  { title: "Cybersecurity Bootcamp", desc: "Completed practical Kali Linux labs", icon: "🛡️" },
];

const COUNTERS = [
  { label: "Projects Built", val: 4, suffix: "+" },
  { label: "Certifications", val: 4, suffix: "" },
  { label: "Hackathons", val: 3, suffix: "+" },
  { label: "CGPA", val: 7.0, suffix: "", decimals: 1 },
];

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function Counter({ val, suffix, decimals = 0 }) {
  const [cur, setCur] = useState(0);
  const [ref, inView] = useInView(0.5);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = val / 60;
    const id = setInterval(() => {
      start += step;
      if (start >= val) { setCur(val); clearInterval(id); }
      else setCur(start);
    }, 16);
    return () => clearInterval(id);
  }, [inView, val]);
  return <span ref={ref}>{cur.toFixed(decimals)}{suffix}</span>;
}

function SkillBar({ name, level, icon, delay }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{ marginBottom: 14, opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transition: `all 0.5s ease ${delay}ms` }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 13, fontWeight: 600 }}>
        <span>{icon} {name}</span><span style={{ opacity: 0.6 }}>{level}%</span>
      </div>
      <div style={{ height: 6, borderRadius: 99, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 99, background: "linear-gradient(90deg,#06b6d4,#8b5cf6)", width: inView ? `${level}%` : "0%", transition: `width 0.9s cubic-bezier(0.4,0,0.2,1) ${delay + 200}ms` }} />
      </div>
    </div>
  );
}

export default function Portfolio() {
  const [dark, setDark] = useState(true);
  const [activeNav, setActiveNav] = useState("home");
  const [projFilter, setProjFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [scrollPct, setScrollPct] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", msg: "" });
  const [formErr, setFormErr] = useState({});
  const [formSent, setFormSent] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
      setScrollPct(pct);
      setShowTop(el.scrollTop > 400);
      const sections = ["home","about","skills","projects","timeline","certifications","achievements","contact"];
      for (const id of [...sections].reverse()) {
        const el2 = document.getElementById(id);
        if (el2 && el2.getBoundingClientRect().top < 120) { setActiveNav(id); break; }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); };

  const bg = dark ? "#070d1a" : "#f0f4ff";
  const text = dark ? "#e8f0fe" : "#0d1b3e";
  const card = dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,30,0.04)";
  const border = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,30,0.1)";
  const subtext = dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,60,0.5)";

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = "Valid email required";
    if (form.msg.length < 10) errs.msg = "Message must be at least 10 characters";
    return errs;
  };

  const handleSend = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setFormErr(errs); return; }
    setFormSent(true);
  };

  const filteredProjects = projFilter === "All" ? PROJECTS : PROJECTS.filter(p => p.cat === projFilter);

  const navLinks = ["home","about","skills","projects","timeline","certifications","achievements","contact"];

  if (loading) return (
    <div style={{ position: "fixed", inset: 0, background: "#070d1a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
      <div style={{ fontSize: 48, marginBottom: 24, animation: "spin 1.5s linear infinite" }}>⚡</div>
      <div style={{ color: "#06b6d4", fontFamily: "'Syne', sans-serif", fontSize: 22, letterSpacing: 4, marginBottom: 12 }}>ARNAV KAPOOR</div>
      <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, letterSpacing: 2 }}>Loading Portfolio…</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ background: bg, color: text, fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", transition: "background 0.4s, color 0.4s" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:linear-gradient(#06b6d4,#8b5cf6);border-radius:99px}
        ::selection{background:#06b6d440}
        a{color:inherit;text-decoration:none}
        .hover-lift{transition:transform 0.25s,box-shadow 0.25s}
        .hover-lift:hover{transform:translateY(-4px);box-shadow:0 20px 60px rgba(6,182,212,0.18)}
        .tag{display:inline-block;padding:3px 10px;border-radius:99px;font-size:11px;font-weight:600;background:rgba(6,182,212,0.12);color:#06b6d4;border:1px solid rgba(6,182,212,0.2);margin:3px}
        .glass{backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px)}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes gradient-shift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse-ring{0%{box-shadow:0 0 0 0 rgba(6,182,212,0.4)}70%{box-shadow:0 0 0 16px rgba(6,182,212,0)}100%{box-shadow:0 0 0 0 rgba(6,182,212,0)}}
        .nav-link{position:relative;font-size:13px;font-weight:500;letter-spacing:0.5px;padding:6px 2px;opacity:0.6;cursor:pointer;transition:opacity 0.2s;text-transform:capitalize}
        .nav-link.active,.nav-link:hover{opacity:1}
        .nav-link.active::after{content:'';position:absolute;bottom:-2px;left:0;right:0;height:2px;background:linear-gradient(90deg,#06b6d4,#8b5cf6);border-radius:99px}
        input,textarea{background:transparent;border:1px solid;outline:none;font-family:inherit;font-size:14px;border-radius:12px;padding:14px 16px;width:100%;transition:border-color 0.2s,box-shadow 0.2s}
        input:focus,textarea:focus{box-shadow:0 0 0 3px rgba(6,182,212,0.15)}
      `}</style>

      {/* Progress bar */}
      <div style={{ position: "fixed", top: 0, left: 0, height: 3, width: `${scrollPct}%`, background: "linear-gradient(90deg,#06b6d4,#8b5cf6)", zIndex: 999, transition: "width 0.1s" }} />

      {/* NAV */}
      <nav className="glass" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, borderBottom: `1px solid ${border}`, background: dark ? "rgba(7,13,26,0.85)" : "rgba(240,244,255,0.85)", padding: "0 5%" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, background: "linear-gradient(90deg,#06b6d4,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", cursor: "pointer" }} onClick={() => scrollTo("home")}>AK</div>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <div style={{ display: "flex", gap: 20 }}>
              {navLinks.slice(0,6).map(l => <div key={l} className={`nav-link${activeNav===l?" active":""}`} onClick={() => scrollTo(l)}>{l}</div>)}
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button onClick={() => setDark(!dark)} style={{ background: "none", border: `1px solid ${border}`, borderRadius: 99, padding: "6px 12px", cursor: "pointer", fontSize: 14, color: text, transition: "all 0.2s" }}>{dark ? "☀️" : "🌙"}</button>
              <a href="#" download style={{ background: "linear-gradient(135deg,#06b6d4,#8b5cf6)", color: "#fff", padding: "7px 16px", borderRadius: 99, fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer", letterSpacing: 0.5 }}>Resume ↓</a>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section id="home" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5%", position: "relative", overflow: "hidden" }}>
        {/* BG blobs */}
        {[["#06b6d4","-10%","20%"],["#8b5cf6","80%","60%"],["#f59e0b","40%","-5%"]].map(([c,l,t],i) => (
          <div key={i} style={{ position: "absolute", left: l, top: t, width: 400, height: 400, borderRadius: "50%", background: c, opacity: 0.08, filter: "blur(80px)", animation: `float ${4+i}s ease-in-out infinite`, animationDelay: `${i*0.8}s`, pointerEvents: "none" }} />
        ))}
        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div style={{ animation: "fadeUp 0.8s ease both" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)", borderRadius: 99, padding: "6px 16px", marginBottom: 24, fontSize: 12, fontWeight: 600, color: "#06b6d4", letterSpacing: 1 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#06b6d4", animation: "pulse-ring 2s infinite" }} />
              AVAILABLE FOR OPPORTUNITIES
            </div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(42px,5vw,68px)", fontWeight: 800, lineHeight: 1.1, marginBottom: 16 }}>
              Hi, I'm <span style={{ background: "linear-gradient(135deg,#06b6d4,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Arnav</span><br />Kapoor
            </h1>
            <p style={{ fontSize: 22, fontWeight: 600, color: "#06b6d4", marginBottom: 16, letterSpacing: 0.3 }}>AI/ML Engineer & Full-Stack Developer</p>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: subtext, marginBottom: 32, maxWidth: 480 }}>
              B.Tech CSE student passionate about building intelligent systems — from Generative AI and Computer Vision to scalable web platforms. Winner at SAP Hackfest. Open-source contributor.
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 40 }}>
              <button onClick={() => scrollTo("projects")} style={{ background: "linear-gradient(135deg,#06b6d4,#8b5cf6)", color: "#fff", padding: "14px 28px", borderRadius: 99, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 14, letterSpacing: 0.5 }}>View Projects →</button>
              <button onClick={() => scrollTo("contact")} style={{ background: "none", color: text, padding: "14px 28px", borderRadius: 99, border: `1.5px solid ${border}`, cursor: "pointer", fontWeight: 600, fontSize: 14, transition: "all 0.2s" }}>Get In Touch</button>
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              {[["GitHub","https://github.com/Arnav-Kapoor12","#333","🐙"],["LinkedIn","#","#0a66c2","🔗"],["Email","mailto:cec231072.cse.cec@cgc.edu.in","#ea4335","✉️"]].map(([l,h,c,ic]) => (
                <a key={l} href={h} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 99, border: `1px solid ${border}`, fontSize: 12, fontWeight: 600, transition: "all 0.2s", background: card }} className="hover-lift">{ic} {l}</a>
              ))}
            </div>
          </div>
          {/* Avatar card */}
          <div style={{ display: "flex", justifyContent: "center", animation: "fadeUp 0.8s ease 0.2s both" }}>
            <div style={{ position: "relative", animation: "float 4s ease-in-out infinite" }}>
              <div style={{ width: 320, height: 380, borderRadius: 32, background: "linear-gradient(135deg,rgba(6,182,212,0.15),rgba(139,92,246,0.15))", border: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, backdropFilter: "blur(20px)", position: "relative", overflow: "hidden" }}>
                <div style={{ fontSize: 100, lineHeight: 1 }}>👨‍💻</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20 }}>Arnav Kapoor</div>
                <div style={{ fontSize: 12, color: "#06b6d4", fontWeight: 600, letterSpacing: 1 }}>CSE ENGINEER</div>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,#06b6d4,#8b5cf6,#f59e0b)", backgroundSize: "200% 200%", animation: "gradient-shift 3s ease infinite" }} />
              </div>
              {/* floating tags */}
              {[["🤖 CSE","-40px","30%"],["⚡ FastAPI","110%","20%"],["🐍 Python","-30px","70%"]].map(([l,left,top]) => (
                <div key={l} style={{ position: "absolute", left, top, background: dark ? "rgba(7,13,26,0.9)" : "rgba(240,244,255,0.9)", border: `1px solid ${border}`, borderRadius: 99, padding: "6px 14px", fontSize: 11, fontWeight: 700, backdropFilter: "blur(10px)", whiteSpace: "nowrap" }}>{l}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div style={{ background: dark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)", borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}`, padding: "40px 5%" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
          {COUNTERS.map((c, i) => (
            <div key={i} style={{ textAlign: "center", padding: 24 }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 42, fontWeight: 800, background: "linear-gradient(135deg,#06b6d4,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                <Counter val={c.val} suffix={c.suffix} decimals={c.decimals} />
              </div>
              <div style={{ fontSize: 12, color: subtext, fontWeight: 600, letterSpacing: 1, marginTop: 4, textTransform: "uppercase" }}>{c.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ABOUT */}
      <SectionWrapper id="about" title="About Me" subtitle="Who I am & what drives me">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div>
            <p style={{ fontSize: 16, lineHeight: 2, color: subtext, marginBottom: 20 }}>
              I'm a motivated B.Tech CSE student at Chandigarh Group of Colleges, passionate about building intelligent systems at the intersection of AI, data, and software engineering.
            </p>
            <p style={{ fontSize: 16, lineHeight: 2, color: subtext, marginBottom: 32 }}>
              From winning regional hackathons to contributing to open-source projects, I thrive where technical excellence meets real-world impact. My goal: leverage cutting-edge AI/ML to solve meaningful problems.
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {["Rohtak, Haryana","DOB: 12 Dec 2005","English · Hindi · Punjabi"].map(l => (
                <div key={l} style={{ padding: "8px 16px", borderRadius: 99, border: `1px solid ${border}`, fontSize: 12, fontWeight: 600, background: card }}>📍 {l}</div>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[["🔭","Focus","AI/ML & Generative AI systems"],["🌱","Learning","LLMs, RAG, MLOps pipelines"],["💡","Strengths","Problem-solving, leadership"],["🎯","Goal","Full-time AI/ML Engineer role"]].map(([ic,t,d]) => (
              <div key={t} className="hover-lift" style={{ padding: 24, borderRadius: 20, background: card, border: `1px solid ${border}` }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{ic}</div>
                <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 14 }}>{t}</div>
                <div style={{ fontSize: 13, color: subtext, lineHeight: 1.6 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* SKILLS */}
      <SectionWrapper id="skills" title="Skills & Tech" subtitle="Technologies I work with" alt dark={dark} border={border} card={card}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 32 }}>
          {["Core","AI/ML","Data","Backend","DevOps"].map(cat => {
            const catSkills = SKILLS.filter(s => s.cat === cat);
            if (!catSkills.length) return null;
            return (
              <div key={cat} style={{ padding: 28, borderRadius: 24, background: card, border: `1px solid ${border}` }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, marginBottom: 20, fontSize: 14, letterSpacing: 1, textTransform: "uppercase", color: "#06b6d4" }}>{cat}</div>
                {catSkills.map((s, i) => <SkillBar key={s.name} name={s.name} level={s.level} icon={s.icon} delay={i * 80} />)}
              </div>
            );
          })}
        </div>
      </SectionWrapper>

      {/* PROJECTS */}
      <SectionWrapper id="projects" title="Projects" subtitle="Things I've built">
        <div style={{ display: "flex", gap: 10, marginBottom: 32, flexWrap: "wrap" }}>
          {["All","Web","AI/ML"].map(f => (
            <button key={f} onClick={() => setProjFilter(f)} style={{ padding: "8px 20px", borderRadius: 99, border: `1px solid ${f===projFilter?"#06b6d4":border}`, background: f===projFilter ? "rgba(6,182,212,0.15)" : "none", color: f===projFilter ? "#06b6d4" : text, fontWeight: 600, cursor: "pointer", fontSize: 13, transition: "all 0.2s" }}>{f}</button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 24 }}>
          {filteredProjects.map((p, i) => <ProjectCard key={p.title} p={p} i={i} dark={dark} border={border} card={card} subtext={subtext} />)}
        </div>
      </SectionWrapper>

      {/* TIMELINE */}
      <SectionWrapper id="timeline" title="Experience & Education" subtitle="My journey so far" alt dark={dark} border={border} card={card}>
        <div style={{ position: "relative", maxWidth: 800, margin: "0 auto" }}>
          <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 2, background: `linear-gradient(to bottom,#06b6d4,#8b5cf6)`, transform: "translateX(-50%)", opacity: 0.3 }} />
          {TIMELINE.map((t, i) => <TimelineItem key={i} item={t} i={i} left={i%2===0} dark={dark} border={border} card={card} subtext={subtext} />)}
        </div>
      </SectionWrapper>

      {/* CERTIFICATIONS */}
      <SectionWrapper id="certifications" title="Certifications" subtitle="Credentials I've earned">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20 }}>
          {CERTS.map((c, i) => (
            <FadeIn key={c.title} delay={i*100}>
              <div className="hover-lift" style={{ padding: 28, borderRadius: 24, border: `1px solid ${border}`, background: card, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${c.color},transparent)` }} />
                <div style={{ fontSize: 36, marginBottom: 12 }}>{c.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{c.title}</div>
                <div style={{ fontSize: 12, color: c.color, fontWeight: 600 }}>{c.org}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </SectionWrapper>

      {/* ACHIEVEMENTS */}
      <SectionWrapper id="achievements" title="Achievements" subtitle="Milestones & recognition" alt dark={dark} border={border} card={card}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20 }}>
          {ACHIEVEMENTS.map((a, i) => (
            <FadeIn key={a.title} delay={i*100}>
              <div className="hover-lift" style={{ padding: 28, borderRadius: 24, border: `1px solid ${border}`, background: card }}>
                <div style={{ fontSize: 40, marginBottom: 14 }}>{a.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{a.title}</div>
                <div style={{ fontSize: 13, color: subtext, lineHeight: 1.6 }}>{a.desc}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </SectionWrapper>

      {/* CONTACT */}
      <SectionWrapper id="contact" title="Get In Touch" subtitle="Let's build something amazing">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start" }}>
          <div>
            <p style={{ fontSize: 16, lineHeight: 1.9, color: subtext, marginBottom: 32 }}>
              Whether you have an exciting project, a collaboration idea, or just want to say hello — my inbox is always open. I typically respond within 24 hours.
            </p>
            {[["✉️","Email","cec231072.cse.cec@cgc.edu.in"],["📱","Phone","+91 95887 89891"],["📍","Location","Rohtak, Haryana, India"]].map(([ic,l,v]) => (
              <div key={l} style={{ display: "flex", gap: 16, marginBottom: 20, alignItems: "center" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(6,182,212,0.1)", border: `1px solid rgba(6,182,212,0.2)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{ic}</div>
                <div><div style={{ fontSize: 11, fontWeight: 700, color: "#06b6d4", letterSpacing: 1, textTransform: "uppercase" }}>{l}</div><div style={{ fontSize: 14, marginTop: 2 }}>{v}</div></div>
              </div>
            ))}
            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              {[["GitHub","https://github.com/Arnav-Kapoor12","🐙"],["LinkedIn","#","🔗"],["Email","mailto:cec231072.cse.cec@cgc.edu.in","✉️"],["Instagram","#","📸"]].map(([l,h,ic]) => (
                <a key={l} href={h} target="_blank" rel="noreferrer" className="hover-lift" style={{ width: 44, height: 44, borderRadius: 12, background: card, border: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{ic}</a>
              ))}
            </div>
          </div>
          <div style={{ padding: 32, borderRadius: 28, background: card, border: `1px solid ${border}` }}>
            {formSent ? (
              <div style={{ textAlign: "center", padding: 40 }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 20, marginBottom: 8 }}>Message Sent!</div>
                <div style={{ color: subtext, fontSize: 14 }}>I'll get back to you shortly.</div>
              </div>
            ) : (
              <>
                {[["name","text","Your Name"],["email","email","Your Email"]].map(([field,type,ph]) => (
                  <div key={field} style={{ marginBottom: 16 }}>
                    <input type={type} placeholder={ph} value={form[field]} onChange={e => { setForm({...form,[field]:e.target.value}); setFormErr({...formErr,[field]:""}); }}
                      style={{ color: "inherit", borderColor: formErr[field] ? "#ef4444" : border }} />
                    {formErr[field] && <div style={{ color: "#ef4444", fontSize: 11, marginTop: 4 }}>{formErr[field]}</div>}
                  </div>
                ))}
                <div style={{ marginBottom: 20 }}>
                  <textarea rows={5} placeholder="Your message…" value={form.msg} onChange={e => { setForm({...form,msg:e.target.value}); setFormErr({...formErr,msg:""}); }}
                    style={{ color: "inherit", borderColor: formErr.msg ? "#ef4444" : border, resize: "vertical" }} />
                  {formErr.msg && <div style={{ color: "#ef4444", fontSize: 11, marginTop: 4 }}>{formErr.msg}</div>}
                </div>
                <button onClick={handleSend} style={{ width: "100%", background: "linear-gradient(135deg,#06b6d4,#8b5cf6)", color: "#fff", padding: 16, borderRadius: 14, border: "none", fontWeight: 700, fontSize: 15, cursor: "pointer", letterSpacing: 0.5 }}>Send Message ✉️</button>
              </>
            )}
          </div>
        </div>
      </SectionWrapper>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${border}`, padding: "32px 5%", textAlign: "center" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, background: "linear-gradient(90deg,#06b6d4,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 8 }}>Arnav Kapoor</div>
          <div style={{ fontSize: 12, color: subtext, marginBottom: 16 }}>AI/ML Engineer · Full-Stack Developer · Open-Source Contributor</div>
          <div style={{ fontSize: 11, color: subtext }}>© {new Date().getFullYear()} Arnav Kapoor · Built with React & ♥</div>
        </div>
      </footer>

      {/* Back to top */}
      {showTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ position: "fixed", bottom: 32, right: 32, width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,#06b6d4,#8b5cf6)", border: "none", cursor: "pointer", fontSize: 18, color: "#fff", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 32px rgba(6,182,212,0.4)" }}>↑</button>
      )}
    </div>
  );
}

function SectionWrapper({ id, title, subtitle, children, alt, dark, border, card }) {
  const [ref, inView] = useInView();
  const bg2 = alt ? (dark ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.02)") : "transparent";
  return (
    <section id={id} style={{ padding: "100px 5%", background: bg2 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div ref={ref} style={{ textAlign: "center", marginBottom: 60, opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(24px)", transition: "all 0.6s ease" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: "#06b6d4", textTransform: "uppercase", marginBottom: 12 }}>{subtitle}</div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(28px,4vw,44px)" }}>{title}</h2>
        </div>
        {children}
      </div>
    </section>
  );
}

function FadeIn({ children, delay = 0 }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(24px)", transition: `all 0.5s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

function ProjectCard({ p, i, dark, border, card, subtext }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className="hover-lift" style={{ borderRadius: 24, border: `1px solid ${border}`, background: card, overflow: "hidden", opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)", transition: `all 0.5s ease ${i * 100}ms` }}>
      <div style={{ height: 140, background: p.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56 }}>{p.emoji}</div>
      <div style={{ padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 17 }}>{p.title}</div>
            <div style={{ fontSize: 12, color: "#06b6d4", fontWeight: 600, marginTop: 2 }}>{p.subtitle}</div>
          </div>
          <span className="tag" style={{ flexShrink: 0, marginLeft: 8 }}>{p.cat}</span>
        </div>
        <p style={{ fontSize: 13, lineHeight: 1.7, color: subtext, marginBottom: 16 }}>{p.desc}</p>
        <div style={{ marginBottom: 16 }}>{p.tech.map(t => <span key={t} className="tag">{t}</span>)}</div>
        <div style={{ display: "flex", gap: 10 }}>
          <a href={p.github} target="_blank" rel="noreferrer" style={{ flex: 1, textAlign: "center", padding: "9px 0", borderRadius: 10, border: `1px solid ${border}`, fontSize: 12, fontWeight: 600, transition: "all 0.2s" }}>🐙 GitHub</a>
          <a href={p.demo} target="_blank" rel="noreferrer" style={{ flex: 1, textAlign: "center", padding: "9px 0", borderRadius: 10, background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.2)", color: "#06b6d4", fontSize: 12, fontWeight: 600, transition: "all 0.2s" }}>🚀 Demo</a>
        </div>
      </div>
    </div>
  );
}

function TimelineItem({ item, i, left, dark, border, card, subtext }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{ display: "grid", gridTemplateColumns: "1fr 40px 1fr", gap: 16, marginBottom: 40, alignItems: "center", opacity: inView ? 1 : 0, transform: inView ? "translateX(0)" : `translateX(${left?"-30px":"30px"})`, transition: `all 0.6s ease ${i * 100}ms` }}>
      {left ? (
        <>
          <div style={{ padding: 24, borderRadius: 20, background: card, border: `1px solid ${border}`, textAlign: "right" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#06b6d4", letterSpacing: 1, marginBottom: 6 }}>{item.year}</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, marginBottom: 4 }}>{item.title}</div>
            <div style={{ fontSize: 12, color: "#8b5cf6", fontWeight: 600, marginBottom: 8 }}>{item.org}</div>
            <div style={{ fontSize: 13, color: subtext, lineHeight: 1.6 }}>{item.desc}</div>
          </div>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#06b6d4,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, zIndex: 1 }}>{item.icon}</div>
          <div />
        </>
      ) : (
        <>
          <div />
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#8b5cf6,#f59e0b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, zIndex: 1 }}>{item.icon}</div>
          <div style={{ padding: 24, borderRadius: 20, background: card, border: `1px solid ${border}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#8b5cf6", letterSpacing: 1, marginBottom: 6 }}>{item.year}</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, marginBottom: 4 }}>{item.title}</div>
            <div style={{ fontSize: 12, color: "#06b6d4", fontWeight: 600, marginBottom: 8 }}>{item.org}</div>
            <div style={{ fontSize: 13, color: subtext, lineHeight: 1.6 }}>{item.desc}</div>
          </div>
        </>
      )}
    </div>
  );
}
