import { useState } from "react";

const stylesList = [
  "Cinematic",
  "Realistic",
  "Anime",
  "Luxury",
  "Cyberpunk"
];

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [style, setStyle] = useState("Cinematic");

  const [credits, setCredits] = useState(10);
  const [history, setHistory] = useState([]);

  const finalPrompt = `${prompt}, ${style} style, ultra detailed, 4k`;

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert("Напиши промт");
      return;
    }

    if (credits <= 0) {
      setResult("Нет кредитов");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      // ⚠️ ПОКА ФЕЙК ГЕНЕРАЦИЯ (потом подключим API)
      const fakeImage =
        "https://images.unsplash.com/photo-1606112219348-204d7d8b94ee";

      await new Promise((r) => setTimeout(r, 1000));

      setResult(fakeImage);

      setHistory((prev) => [
        { img: fakeImage, prompt: finalPrompt },
        ...prev
      ]);

      setCredits((prev) => prev - 1);
    } catch (err) {
      setResult("Ошибка");
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #1a1a2e, #0f0f1a)",
        color: "white",
        padding: "20px",
        fontFamily: "sans-serif"
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        
        {/* 🔝 TOP BAR */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px"
          }}
        >
          <div style={{ fontWeight: "bold" }}>
            🟡 KOKOS AI STUDIO
          </div>

          <div
            style={{
              padding: "6px 12px",
              borderRadius: "10px",
              background: "rgba(212,175,55,0.1)",
              border: "1px solid rgba(212,175,55,0.4)",
              color: "#f0d77a"
            }}
          >
            Credits: {credits}
          </div>
        </div>

        {/* 🔥 HERO */}
        <h1 style={{ fontSize: "42px", fontWeight: "900" }}>
          Create Viral Content Faster
        </h1>

        <p style={{ color: "#aaa", marginBottom: "20px" }}>
          Fast. Simple. Premium. Built for creators.
        </p>

        {/* 🎛 MAIN GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "20px"
          }}
        >
          {/* LEFT */}
          <div
            style={{
              background: "#111",
              padding: "20px",
              borderRadius: "20px"
            }}
          >
            <div style={{ marginBottom: "10px" }}>
              PROMPT
            </div>

            <textarea
              placeholder="Describe your idea..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              style={{
                width: "100%",
                height: "100px",
                background: "#000",
                color: "white",
                border: "none",
                borderRadius: "10px",
                padding: "10px"
              }}
            />

            {/* 🎨 STYLE */}
            <div style={{ marginTop: "10px" }}>
              STYLE:
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              {stylesList.map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "10px",
                    border:
                      style === s
                        ? "1px solid gold"
                        : "1px solid #333",
                    background: "transparent",
                    color:
                      style === s ? "gold" : "white",
                    cursor: "pointer"
                  }}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* ⚡ BUTTON */}
            <button
              onClick={handleGenerate}
              style={{
                marginTop: "15px",
                width: "100%",
                padding: "12px",
                borderRadius: "14px",
                border: "none",
                background:
                  "linear-gradient(135deg,#d4af37,#f0d77a)",
                color: "#000",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow:
                  "0 0 20px rgba(212,175,55,0.3)",
                transition: "0.3s"
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 0 40px rgba(212,175,55,0.6)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 0 20px rgba(212,175,55,0.3)")
              }
            >
              {loading ? "Generating..." : "Generate ⚡"}
            </button>

            {/* 🖼 RESULT */}
            {result && (
              <img
                src={result}
                style={{
                  width: "100%",
                  marginTop: "20px",
                  borderRadius: "12px"
                }}
              />
            )}
          </div>

          {/* RIGHT */}
          <div
            style={{
              background: "#111",
              padding: "20px",
              borderRadius: "20px"
            }}
          >
            <div style={{ marginBottom: "10px" }}>
              WHY KOKOS AI
            </div>

            <div style={{ marginBottom: "10px" }}>
              ⚡ Fast
            </div>
            <div style={{ marginBottom: "10px" }}>
              🔥 Trend-ready
            </div>
            <div style={{ marginBottom: "10px" }}>
              💎 Premium feel
            </div>
          </div>
        </div>

        {/* 🧠 HISTORY */}
        {history.length > 0 && (
          <div style={{ marginTop: "30px" }}>
            <div style={{ marginBottom: "10px" }}>
              HISTORY
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(120px,1fr))",
                gap: "10px"
              }}
            >
              {history.map((item, i) => (
                <img
                  key={i}
                  src={item.img}
                  onClick={() => setResult(item.img)}
                  style={{
                    width: "100%",
                    borderRadius: "10px",
                    cursor: "pointer"
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}