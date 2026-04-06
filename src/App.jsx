import { useEffect, useMemo, useRef, useState } from "react";

const STYLES = [
  {
    id: "cinematic",
    title: "Cinematic",
    prompt:
      "cinematic lighting, dramatic composition, premium commercial look, realistic, high detail",
  },
  {
    id: "realistic",
    title: "Realistic",
    prompt:
      "ultra realistic, natural lighting, realistic textures, premium photo quality",
  },
  {
    id: "luxury",
    title: "Luxury",
    prompt:
      "luxury aesthetic, refined details, elegant mood, expensive visual style",
  },
  {
    id: "street",
    title: "Street",
    prompt:
      "urban night atmosphere, street lights, realistic city vibe, bold composition",
  },
  {
    id: "carads",
    title: "Car Ads",
    prompt:
      "luxury car advertisement, glossy reflections, bold camera angle, automotive campaign",
  },
  {
    id: "anime",
    title: "Anime",
    prompt:
      "anime style, vibrant colors, dynamic composition, polished illustration",
  },
];

const SURPRISE_PROMPTS = [
  "red bmw drifting through neon city at night",
  "luxury perfume bottle on black glass with gold reflections",
  "cyberpunk samurai standing in rain under city lights",
  "porsche 911 in mountain fog cinematic shot",
  "ultra premium burger ad with dramatic lighting",
  "fashion portrait of a model in luxury studio",
];

const loadLocal = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("cinematic");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [copied, setCopied] = useState(false);

  const [credits, setCredits] = useState(() => loadLocal("kokos_credits", 10));
  const [history, setHistory] = useState(() => loadLocal("kokos_history", []));

  const [uploadedName, setUploadedName] = useState("");
  const [previewImage, setPreviewImage] = useState("");

  const fileInputRef = useRef(null);

  const activeStyle = useMemo(
    () => STYLES.find((item) => item.id === selectedStyle),
    [selectedStyle]
  );

  const finalPrompt = useMemo(() => {
    if (!prompt.trim()) return "";
    return `${prompt}, ${activeStyle?.prompt || ""}`;
  }, [prompt, activeStyle]);

  const isImage =
    typeof result === "string" &&
    (result.startsWith("data:image") || result.startsWith("http"));

  useEffect(() => {
    localStorage.setItem("kokos_credits", JSON.stringify(credits));
  }, [credits]);

  useEffect(() => {
    localStorage.setItem("kokos_history", JSON.stringify(history.slice(0, 12)));
  }, [history]);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1400);
    return () => clearTimeout(t);
  }, [copied]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setErrorText("Напиши промт.");
      return;
    }

    if (credits <= 0) {
      setErrorText("Кредиты закончились.");
      return;
    }

    setLoading(true);
    setErrorText("");
    setResult("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: finalPrompt }),
      });

      const data = await res.json();

      const imageUrl = data?.data?.[0]?.url;
      const imageBase64 = data?.data?.[0]?.b64_json;

      let finalImage = "";

      if (imageUrl) {
        finalImage = imageUrl;
      } else if (imageBase64) {
        finalImage = `data:image/png;base64,${imageBase64}`;
      } else if (data?.error?.message) {
        setErrorText(data.error.message);
      } else {
        setErrorText("Ошибка генерации.");
      }

      if (finalImage) {
        setResult(finalImage);
        setCredits((prev) => prev - 1);
        setHistory((prev) => [
          {
            id: Date.now(),
            img: finalImage,
            prompt,
            fullPrompt: finalPrompt,
            style: activeStyle?.title || "",
          },
          ...prev,
        ]);
      }
    } catch (error) {
      setErrorText("Ошибка сервера.");
    } finally {
      setLoading(false);
    }
  };

  const handleSurprise = () => {
    const random =
      SURPRISE_PROMPTS[Math.floor(Math.random() * SURPRISE_PROMPTS.length)];
    setPrompt(random);
    setErrorText("");
  };

  const handleClear = () => {
    setPrompt("");
    setResult("");
    setErrorText("");
    setUploadedName("");
    setPreviewImage("");
  };

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(finalPrompt || prompt);
      setCopied(true);
    } catch {}
  };

  const handleDownload = () => {
    if (!isImage) return;
    const link = document.createElement("a");
    link.href = result;
    link.download = `kokos-ai-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleHistoryClick = (item) => {
    setPrompt(item.prompt || "");
    const styleObj = STYLES.find((s) => s.title === item.style);
    if (styleObj) setSelectedStyle(styleObj.id);
    setResult(item.img);
    setErrorText("");
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPreviewImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        html, body, #root { margin: 0; min-height: 100%; }
        body {
          background:
            radial-gradient(circle at top, #17152a 0%, #0b0b13 45%, #06060a 100%);
          color: #fff;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif;
        }
        .app-shell {
          min-height: 100vh;
          padding: 24px 16px 56px;
        }
        .container {
          width: 100%;
          max-width: 1220px;
          margin: 0 auto;
        }
        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 18px;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 800;
          letter-spacing: 0.02em;
        }
        .brand-dot {
          width: 12px;
          height: 12px;
          border-radius: 999px;
          background: linear-gradient(135deg, #f3d46d, #c89f23);
          box-shadow: 0 0 18px rgba(212,175,55,0.45);
        }
        .credits {
          padding: 10px 14px;
          border-radius: 14px;
          border: 1px solid rgba(212,175,55,0.28);
          background: rgba(212,175,55,0.08);
          color: #f0d77a;
          font-weight: 700;
          backdrop-filter: blur(12px);
        }
        .hero {
          border: 1px solid rgba(255,255,255,0.08);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02));
          box-shadow:
            0 20px 60px rgba(0,0,0,0.28),
            inset 0 1px 0 rgba(255,255,255,0.04);
          border-radius: 28px;
          padding: 26px;
          backdrop-filter: blur(18px);
        }
        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #d4af37;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.22em;
          margin-bottom: 14px;
        }
        .eyebrow span {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #d4af37;
          box-shadow: 0 0 16px rgba(212,175,55,0.42);
        }
        .hero-title {
          margin: 0;
          font-size: clamp(34px, 7vw, 70px);
          line-height: 0.96;
          letter-spacing: -0.05em;
          font-weight: 800;
        }
        .hero-sub {
          margin-top: 16px;
          max-width: 760px;
          color: rgba(255,255,255,0.68);
          line-height: 1.7;
          font-size: 16px;
        }
        .hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(300px, 0.85fr);
          gap: 18px;
          margin-top: 22px;
        }
        .card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 18px;
          backdrop-filter: blur(16px);
          transition: transform .28s ease, border-color .28s ease, box-shadow .28s ease;
        }
        .card:hover {
          transform: translateY(-2px);
          border-color: rgba(212,175,55,0.18);
          box-shadow: 0 14px 34px rgba(0,0,0,0.2);
        }
        .card-label {
          margin-bottom: 12px;
          color: #d4af37;
          font-size: 12px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .textarea {
          width: 100%;
          height: 180px;
          resize: none;
          outline: none;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(7,7,12,0.9);
          color: white;
          padding: 16px;
          font-size: 16px;
          line-height: 1.6;
          transition: border-color .24s ease, box-shadow .24s ease, transform .24s ease;
        }
        .textarea:focus {
          border-color: rgba(212,175,55,0.45);
          box-shadow: 0 0 0 4px rgba(212,175,55,0.08);
        }
        .action-row {
          display: grid;
          grid-template-columns: minmax(0,1fr) minmax(210px, 260px);
          gap: 12px;
          margin-top: 14px;
        }
        .gold-btn {
          border: none;
          cursor: pointer;
          border-radius: 18px;
          padding: 16px 18px;
          font-size: 16px;
          font-weight: 800;
          color: #0a0a0a;
          background: linear-gradient(135deg, #d4af37 0%, #f0d77a 100%);
          box-shadow: 0 0 24px rgba(212,175,55,0.22);
          transition: transform .25s ease, box-shadow .25s ease, opacity .25s ease;
        }
        .gold-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 0 42px rgba(212,175,55,0.38);
        }
        .gold-btn:disabled {
          opacity: 0.72;
          cursor: default;
          transform: none;
        }
        .ghost-info {
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .ghost-info-title {
          color: #d4af37;
          font-weight: 700;
          margin-bottom: 6px;
        }
        .why-grid {
          display: grid;
          gap: 12px;
        }
        .why-item {
          border-radius: 18px;
          background: rgba(8,8,12,0.88);
          border: 1px solid rgba(255,255,255,0.06);
          padding: 16px;
          transition: transform .25s ease, border-color .25s ease;
        }
        .why-item:hover {
          transform: translateY(-1px);
          border-color: rgba(212,175,55,0.2);
        }
        .section-head {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 14px;
          margin: 24px 0 14px;
        }
        .section-title {
          font-size: 30px;
          font-weight: 800;
          letter-spacing: -0.04em;
        }
        .section-sub {
          color: rgba(255,255,255,0.62);
          line-height: 1.6;
          max-width: 440px;
          font-size: 14px;
        }
        .style-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 12px;
        }
        .style-btn {
          text-align: left;
          padding: 16px;
          border-radius: 20px;
          cursor: pointer;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.02);
          color: white;
          transition: transform .22s ease, border-color .22s ease, background .22s ease, box-shadow .22s ease;
        }
        .style-btn:hover {
          transform: translateY(-2px);
          border-color: rgba(212,175,55,0.2);
        }
        .style-btn.active {
          border-color: rgba(212,175,55,0.55);
          background: linear-gradient(180deg, rgba(212,175,55,0.12), rgba(255,255,255,0.03));
          box-shadow: 0 10px 25px rgba(212,175,55,0.08);
        }
        .style-title {
          font-weight: 800;
          margin-bottom: 8px;
        }
        .style-desc {
          color: rgba(255,255,255,0.56);
          font-size: 13px;
          line-height: 1.55;
        }
        .result-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(320px, 0.88fr);
          gap: 18px;
          margin-top: 24px;
        }
        .result-box {
          min-height: 520px;
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.02);
          padding: 18px;
        }
        .result-placeholder {
          min-height: 430px;
          border-radius: 20px;
          border: 1px dashed rgba(255,255,255,0.12);
          background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015));
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.45);
          text-align: center;
          padding: 20px;
          line-height: 1.7;
        }
        .result-image {
          width: 100%;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.08);
          display: block;
        }
        .toolbar {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 14px;
        }
        .soft-btn {
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          color: white;
          cursor: pointer;
          border-radius: 14px;
          padding: 12px 14px;
          font-weight: 600;
          transition: transform .22s ease, border-color .22s ease, background .22s ease;
        }
        .soft-btn:hover {
          transform: translateY(-1px);
          border-color: rgba(212,175,55,0.22);
          background: rgba(255,255,255,0.05);
        }
        .upload-card {
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.02);
          padding: 18px;
        }
        .upload-btn {
          width: 100%;
          padding: 14px;
          border-radius: 16px;
          border: 1px solid rgba(212,175,55,0.32);
          background: rgba(212,175,55,0.08);
          color: #f0d77a;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: transform .22s ease, box-shadow .22s ease;
        }
        .upload-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 0 28px rgba(212,175,55,0.12);
        }
        .preview-img {
          margin-top: 14px;
          width: 100%;
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.08);
          display: block;
        }
        .soon-card {
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.08);
          background: linear-gradient(180deg, rgba(212,175,55,0.08), rgba(255,255,255,0.02));
          padding: 18px;
        }
        .history-wrap {
          margin-top: 28px;
        }
        .history-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 12px;
        }
        .history-item {
          width: 100%;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.08);
          cursor: pointer;
          transition: transform .22s ease, border-color .22s ease, box-shadow .22s ease;
          display: block;
        }
        .history-item:hover {
          transform: translateY(-2px);
          border-color: rgba(212,175,55,0.25);
          box-shadow: 0 10px 24px rgba(0,0,0,0.24);
        }
        .error-box {
          margin-top: 14px;
          color: #ffd9d9;
          background: rgba(255,70,70,0.08);
          border: 1px solid rgba(255,70,70,0.16);
          border-radius: 14px;
          padding: 12px 14px;
          line-height: 1.6;
        }
        .copied-badge {
          color: #f0d77a;
          font-size: 13px;
          font-weight: 700;
        }

        @media (max-width: 980px) {
          .hero-grid,
          .result-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .app-shell {
            padding: 16px 12px 36px;
          }
          .hero {
            padding: 18px;
            border-radius: 22px;
          }
          .hero-title {
            font-size: 42px;
          }
          .action-row {
            grid-template-columns: 1fr;
          }
          .section-title {
            font-size: 24px;
          }
          .result-box {
            min-height: auto;
          }
          .result-placeholder {
            min-height: 260px;
          }
        }
      `}</style>

      <div className="app-shell">
        <div className="container">
          <div className="topbar">
            <div className="brand">
              <span className="brand-dot" />
              <span>KOKOS AI STUDIO</span>
            </div>

            <div className="credits">Credits: {credits}</div>
          </div>

          <section className="hero">
            <div className="eyebrow">
              <span />
              KOKOS AI STUDIO
            </div>

            <h1 className="hero-title">
              Create Viral
              <br />
              Content Faster
            </h1>

            <div className="hero-sub">
              Fast. Simple. Premium. Built for creators who want scroll-stopping
              content with smooth workflow and strong visual output.
            </div>

            <div className="hero-grid">
              <div className="card">
                <div className="card-label">Prompt Box</div>

                <textarea
                  className="textarea"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your idea..."
                />

                <div className="action-row">
                  <button
                    className="gold-btn"
                    onClick={handleGenerate}
                    disabled={loading}
                  >
                    {loading ? "Generating..." : "Generate ⚡"}
                  </button>

                  <div className="ghost-info">
                    <div className="ghost-info-title">Active style</div>
                    <div>{activeStyle?.title}</div>
                  </div>
                </div>

                <div className="toolbar">
                  <button className="soft-btn" onClick={handleSurprise}>
                    Surprise me
                  </button>
                  <button className="soft-btn" onClick={handleCopyPrompt}>
                    Copy prompt
                  </button>
                  <button className="soft-btn" onClick={handleClear}>
                    Clear
                  </button>
                  {copied ? <span className="copied-badge">Copied</span> : null}
                </div>

                {errorText ? <div className="error-box">{errorText}</div> : null}
              </div>

              <div className="card">
                <div className="card-label">Why KOKOS AI</div>

                <div className="why-grid">
                  {[
                    {
                      title: "⚡ Fast",
                      text: "Generate content in seconds without wasting time on complex tools.",
                    },
                    {
                      title: "🔥 Trend-ready",
                      text: "Built around presets that fit viral content and social trends.",
                    },
                    {
                      title: "💎 Premium feel",
                      text: "Smooth Apple-like experience with clean premium presentation.",
                    },
                  ].map((item) => (
                    <div key={item.title} className="why-item">
                      <div style={{ fontWeight: 800, marginBottom: 8 }}>{item.title}</div>
                      <div style={{ color: "rgba(255,255,255,0.62)", lineHeight: 1.6 }}>
                        {item.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="section-head">
              <div>
                <div className="card-label" style={{ marginBottom: 8 }}>
                  Choose your style
                </div>
                <div className="section-title">Ready presets for trends</div>
              </div>

              <div className="section-sub">
                Built for content. Faster prompts, simpler workflow, stronger output,
                and less friction between idea and result.
              </div>
            </div>

            <div className="style-grid">
              {STYLES.map((item) => {
                const active = item.id === selectedStyle;
                return (
                  <button
                    key={item.id}
                    className={`style-btn ${active ? "active" : ""}`}
                    onClick={() => setSelectedStyle(item.id)}
                  >
                    <div className="style-title">{item.title}</div>
                    <div className="style-desc">{item.prompt}</div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="result-grid">
            <div className="result-box">
              <div className="card-label">Result</div>

              {result && isImage ? (
                <>
                  <img className="result-image" src={result} alt="result" />

                  <div className="toolbar">
                    <button className="soft-btn" onClick={handleDownload}>
                      Download
                    </button>
                    <button className="soft-btn" onClick={handleCopyPrompt}>
                      Copy prompt
                    </button>
                  </div>
                </>
              ) : (
                <div className="result-placeholder">
                  {result ? result : "Your generated image will appear here."}
                </div>
              )}
            </div>

            <div style={{ display: "grid", gap: 18 }}>
              <div className="upload-card">
                <div className="card-label">Upgrade your content</div>

                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    marginBottom: 10,
                  }}
                >
                  Enhance images
                </div>

                <div
                  style={{
                    color: "rgba(255,255,255,0.62)",
                    fontSize: 14,
                    lineHeight: 1.7,
                    marginBottom: 16,
                  }}
                >
                  Upload a photo and keep it ready for future enhancement workflow.
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />

                <button className="upload-btn" onClick={handleUploadClick}>
                  Upload image ✨
                </button>

                {uploadedName ? (
                  <div
                    style={{
                      marginTop: 12,
                      color: "rgba(255,255,255,0.72)",
                      fontSize: 14,
                    }}
                  >
                    Selected: {uploadedName}
                  </div>
                ) : null}

                {previewImage ? (
                  <img className="preview-img" src={previewImage} alt="uploaded" />
                ) : null}
              </div>

              <div className="soon-card">
                <div className="card-label">Coming soon</div>

                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    marginBottom: 10,
                  }}
                >
                  AI Video Generation
                </div>

                <div
                  style={{
                    color: "rgba(255,255,255,0.62)",
                    fontSize: 14,
                    lineHeight: 1.7,
                  }}
                >
                  Generate trend-ready videos next. Built for reels, ads, short-form
                  content, and creator workflows.
                </div>
              </div>
            </div>
          </section>

          {history.length > 0 && (
            <section className="history-wrap">
              <div className="card-label">History</div>

              <div className="history-grid">
                {history.map((item) => (
                  <img
                    key={item.id}
                    className="history-item"
                    src={item.img}
                    alt={item.prompt}
                    onClick={() => handleHistoryClick(item)}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}