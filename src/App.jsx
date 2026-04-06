import { useState } from "react";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

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
        body: JSON.stringify({ prompt })
      });

      const data = await res.json();

      const imageUrl = data.data?.[0]?.url;
      const imageBase64 = data.data?.[0]?.b64_json;

      if (imageUrl) {
        setResult(imageUrl);
      } else if (imageBase64) {
        setResult(`data:image/png;base64,${imageBase64}`);
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

  const isImage =
    typeof result === "string" &&
    (result.startsWith("data:image") || result.startsWith("http"));

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a12",
        color: "white",
        padding: "20px",
        fontFamily: "Arial, sans-serif"
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <h1 style={{ textAlign: "center", marginBottom: "10px" }}>KOKOS AI</h1>
        <h2 style={{ textAlign: "center", marginTop: 0, marginBottom: "30px" }}>
          Mini App
        </h2>

        <div
          style={{
            background: "#151520",
            borderRadius: "20px",
            padding: "20px",
            boxShadow: "0 0 20px rgba(0,0,0,0.25)"
          }}
        >
          <p style={{ textAlign: "center", fontSize: "22px", marginBottom: "20px" }}>
            Генерация изображений
          </p>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Напиши промт..."
            style={{
              width: "100%",
              height: "140px",
              background: "#0f0f17",
              color: "white",
              border: "1px solid #444",
              borderRadius: "12px",
              padding: "14px",
              fontSize: "16px",
              resize: "none",
              boxSizing: "border-box"
            }}
          />

          <button
            onClick={handleGenerate}
            disabled={loading}
            style={{
              marginTop: "16px",
              width: "100%",
              padding: "14px",
              background: loading ? "#4aa8b8" : "#67e8f9",
              color: "black",
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            {loading ? "Генерируется..." : "Сгенерировать"}
          </button>

          {result && isImage && (
            <img
              src={result}
              alt="result"
              style={{
                marginTop: "20px",
                width: "100%",
                borderRadius: "12px"
              }}
            />
          )}

          {result && !isImage && (
            <div
              style={{
                marginTop: "20px",
                background: "#0f0f17",
                border: "1px solid #333",
                borderRadius: "12px",
                padding: "16px",
                color: "#d1d5db",
                lineHeight: "1.6"
              }}
            >
              {result}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}