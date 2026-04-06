import { useMemo, useRef, useState } from "react";

const stylesList = [
  {
    id: "cinematic",
    title: "Cinematic",
    prompt: "cinematic lighting, dramatic composition, premium commercial look, high detail",
  },
  {
    id: "carads",
    title: "Car Ads",
    prompt: "luxury car advertisement, glossy reflections, bold angles, premium automotive campaign",
  },
  {
    id: "luxury",
    title: "Luxury",
    prompt: "premium luxury aesthetic, elegant lighting, expensive visual style, refined details",
  },
  {
    id: "street",
    title: "Street",
    prompt: "urban night atmosphere, street lights, realistic city mood, bold composition",
  },
  {
    id: "viral",
    title: "Viral TikTok",
    prompt: "viral social media style, eye-catching, trendy, high contrast, scroll-stopping content",
  },
  {
    id: "anime",
    title: "Anime",
    prompt: "anime style, dynamic composition, detailed illustration, vibrant mood",
  },
];

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("cinematic");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const [uploadedName, setUploadedName] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const fileInputRef = useRef(null);

  const activeStyle = useMemo(
    () => stylesList.find((item) => item.id === selectedStyle),
    [selectedStyle]
  );

  const finalPrompt = useMemo(() => {
    if (!prompt.trim()) return "";
    return `${prompt}, ${activeStyle?.prompt || ""}`;
  }, [prompt, activeStyle]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert("Напиши промт");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt: finalPrompt })
      });

      const data = await res.json();

      const imageUrl = data.data?.[0]?.url;
      const imageBase64 = data.data?.[0]?.b64_json;

      if (imageUrl) {
        setResult(imageUrl);
      } else if (imageBase64) {
        setResult(`data:image/png;base64,${imageBase64}`);
      } else if (data.error?.message) {
        setResult(`Ошибка: ${data.error.message}`);
      } else {
        console.log(data);
        setResult("Ошибка генерации");
      }
    } catch (err) {
      console.error(err);
      setResult("Ошибка сервера");
    }

    setLoading(false);
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

  const isImage =
    typeof result === "string" &&
    (result.startsWith("data:image") || result.startsWith("http"));

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #15121d 0%, #09090c 45%, #050507 100%)",
        color: "#ffffff",
        padding: "28px 18px 60px",
        fontFamily:
          "Inter, Arial, Helvetica, sans-serif",
      }}
    >
      <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
        <section
          style={{
            border: "1px solid rgba(212,175,55,0.16)",
            borderRadius: "28px",
            padding: "24px",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015))",
            boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "18px",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              marginBottom: "22px",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "12px",
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color: "#d4af37",
                  marginBottom: "14px",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "999px",
                    background: "#d4af37",
                    display: "inline-block",
                    boxShadow: "0 0 18px rgba(212,175,55,0.45)",
                  }}
                />
                KOKOS AI STUDIO
              </div>

              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(34px, 7vw, 64px)",
                  lineHeight: 1,
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                }}
              >
                Create Viral
                <br />
                Content Faster
              </h1>

              <p
                style={{
                  marginTop: "16px",
                  maxWidth: "640px",
                  color: "rgba(255,255,255,0.72)",
                  fontSize: "16px",
                  lineHeight: 1.7,
                }}
              >
                AI studio for creators. Fast. Simple. Premium.
                Built for trend-ready content, stylish visuals, and scroll-stopping results.
              </p>
            </div>

            <div
              style={{
                border: "1px solid rgba(212,175,55,0.2)",
                borderRadius: "18px",
                padding: "12px 14px",
                background: "rgba(212,175,55,0.06)",
                minWidth: "220px",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.18em",
                  color: "#d4af37",
                  marginBottom: "8px",
                }}
              >
                Current mode
              </div>
              <div style={{ fontSize: "18px", fontWeight: 700 }}>
                Image Generation
              </div>
              <div
                style={{
                  marginTop: "8px",
                  color: "rgba(255,255,255,0.64)",
                  fontSize: "14px",
                  lineHeight: 1.6,
                }}
              >
                Powered by Nano Banana Pro
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 0.8fr",
              gap: "18px",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "24px",
                padding: "18px",
              }}
            >
              <div
                style={{
                  marginBottom: "12px",
                  color: "#d4af37",
                  fontSize: "13px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                Prompt box
              </div>

              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your idea..."
                style={{
                  width: "100%",
                  height: "170px",
                  background: "#0b0b10",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.14)",
                  borderRadius: "18px",
                  padding: "16px",
                  fontSize: "16px",
                  resize: "none",
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />

              <div
                style={{
                  marginTop: "14px",
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  style={{
                    flex: 1,
                    minWidth: "180px",
                    padding: "15px 18px",
                    borderRadius: "16px",
                    border: "none",
                    background:
                      "linear-gradient(135deg, #d4af37 0%, #f0d77a 100%)",
                    color: "#080808",
                    fontSize: "16px",
                    fontWeight: 800,
                    cursor: "pointer",
                    boxShadow: "0 10px 30px rgba(212,175,55,0.2)",
                  }}
                >
                  {loading ? "Generating..." : "Generate ⚡"}
                </button>

                <div
                  style={{
                    flex: 1,
                    minWidth: "220px",
                    borderRadius: "16px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.03)",
                    padding: "14px 16px",
                    color: "rgba(255,255,255,0.72)",
                    fontSize: "14px",
                  }}
                >
                  <div style={{ color: "#d4af37", fontWeight: 700, marginBottom: "6px" }}>
                    Active style
                  </div>
                  <div>{activeStyle?.title}</div>
                </div>
              </div>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "24px",
                padding: "18px",
              }}
            >
              <div
                style={{
                  marginBottom: "12px",
                  color: "#d4af37",
                  fontSize: "13px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                Why KOKOS AI
              </div>

              <div style={{ display: "grid", gap: "12px" }}>
                {[
                  {
                    title: "Fast",
                    text: "Generate content in seconds without wasting time on complex tools."
                  },
                  {
                    title: "Trend-ready",
                    text: "Built around styles and presets that fit viral content trends."
                  },
                  {
                    title: "Simple",
                    text: "No clutter. No learning curve. Just type, choose style, get result."
                  }
                ].map((item) => (
                  <div
                    key={item.title}
                    style={{
                      borderRadius: "18px",
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "#0b0b10",
                      padding: "14px",
                    }}
                  >
                    <div
                      style={{
                        color: "#ffffff",
                        fontSize: "16px",
                        fontWeight: 700,
                        marginBottom: "8px",
                      }}
                    >
                      {item.title}
                    </div>
                    <div
                      style={{
                        color: "rgba(255,255,255,0.64)",
                        fontSize: "14px",
                        lineHeight: 1.6,
                      }}
                    >
                      {item.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section style={{ marginTop: "24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              flexWrap: "wrap",
              marginBottom: "14px",
            }}
          >
            <div>
              <div
                style={{
                  color: "#d4af37",
                  fontSize: "13px",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  marginBottom: "8px",
                }}
              >
                Choose your style
              </div>
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                }}
              >
                Ready presets for trends
              </div>
            </div>

            <div
              style={{
                color: "rgba(255,255,255,0.62)",
                fontSize: "14px",
                maxWidth: "420px",
                lineHeight: 1.6,
              }}
            >
              Built for content. Faster prompts, simpler workflow, stronger output.
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "12px",
            }}
          >
            {stylesList.map((item) => {
              const active = item.id === selectedStyle;

              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedStyle(item.id)}
                  style={{
                    textAlign: "left",
                    padding: "16px",
                    borderRadius: "20px",
                    border: active
                      ? "1px solid rgba(212,175,55,0.6)"
                      : "1px solid rgba(255,255,255,0.08)",
                    background: active
                      ? "linear-gradient(180deg, rgba(212,175,55,0.12), rgba(255,255,255,0.03))"
                      : "rgba(255,255,255,0.02)",
                    color: "#ffffff",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 800,
                      marginBottom: "8px",
                      color: active ? "#f0d77a" : "#ffffff",
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{
                      color: "rgba(255,255,255,0.58)",
                      fontSize: "13px",
                      lineHeight: 1.5,
                    }}
                  >
                    {item.prompt}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section
          style={{
            marginTop: "24px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "18px",
          }}
        >
          <div
            style={{
              borderRadius: "26px",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.02)",
              padding: "18px",
            }}
          >
            <div
              style={{
                color: "#d4af37",
                fontSize: "13px",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                marginBottom: "10px",
              }}
            >
              Result
            </div>

            {result && isImage ? (
              <img
                src={result}
                alt="result"
                style={{
                  width: "100%",
                  borderRadius: "18px",
                  display: "block",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              />
            ) : (
              <div
                style={{
                  minHeight: "420px",
                  borderRadius: "20px",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015))",
                  border: "1px dashed rgba(255,255,255,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(255,255,255,0.45)",
                  textAlign: "center",
                  padding: "20px",
                  lineHeight: 1.7,
                }}
              >
                {result
                  ? result
                  : "Your generated image will appear here."}
              </div>
            )}
          </div>

          <div
            style={{
              display: "grid",
              gap: "18px",
            }}
          >
            <div
              style={{
                borderRadius: "26px",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.02)",
                padding: "18px",
              }}
            >
              <div
                style={{
                  color: "#d4af37",
                  fontSize: "13px",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  marginBottom: "10px",
                }}
              >
                Upgrade your content
              </div>

              <div
                style={{
                  fontSize: "28px",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  marginBottom: "10px",
                }}
              >
                Enhance images
              </div>

              <div
                style={{
                  color: "rgba(255,255,255,0.62)",
                  fontSize: "14px",
                  lineHeight: 1.7,
                  marginBottom: "16px",
                }}
              >
                Upload a photo and prepare it for a stronger AI-enhanced result.
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />

              <button
                onClick={handleUploadClick}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "16px",
                  border: "1px solid rgba(212,175,55,0.32)",
                  background: "rgba(212,175,55,0.08)",
                  color: "#f0d77a",
                  fontSize: "15px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Upload image ✨
              </button>

              {uploadedName ? (
                <div
                  style={{
                    marginTop: "12px",
                    color: "rgba(255,255,255,0.7)",
                    fontSize: "14px",
                  }}
                >
                  Selected: {uploadedName}
                </div>
              ) : null}

              {previewImage ? (
                <img
                  src={previewImage}
                  alt="uploaded"
                  style={{
                    marginTop: "14px",
                    width: "100%",
                    borderRadius: "18px",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                />
              ) : null}
            </div>

            <div
              style={{
                borderRadius: "26px",
                border: "1px solid rgba(255,255,255,0.08)",
                background:
                  "linear-gradient(180deg, rgba(212,175,55,0.08), rgba(255,255,255,0.02))",
                padding: "18px",
              }}
            >
              <div
                style={{
                  color: "#d4af37",
                  fontSize: "13px",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  marginBottom: "10px",
                }}
              >
                Coming soon
              </div>

              <div
                style={{
                  fontSize: "28px",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  marginBottom: "10px",
                }}
              >
                AI Video Generation
              </div>

              <div
                style={{
                  color: "rgba(255,255,255,0.62)",
                  fontSize: "14px",
                  lineHeight: 1.7,
                }}
              >
                Generate trend-ready video content next. Fast workflows for creators,
                ads, reels, and short-form content.
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}