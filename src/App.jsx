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
      const image = data.data?.[0]?.url;

      if (image) {
        setResult(image);
      } else {
        setResult("Ошибка генерации");
      }
    } catch (err) {
      setResult("Ошибка сервера");
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a12",
        color: "white",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <h1 style={{ textAlign: "center" }}>KOKOS AI</h1>
        <h2 style={{ textAlign: "center", marginBottom: "30px" }}>Mini App</h2>

        <div
          style={{
            background: "#151520",
            borderRadius: "20px",
            padding: "20px",
          }}
        >
          <p style={{ textAlign: "center", fontSize: "22px" }}>
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
            }}
          />

          <button
            onClick={handleGenerate}
            disabled={loading}
            style={{
              marginTop: "15px",
              width: "100%",
              padding: "14px",
              background: "#67e8f9",
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {loading ? "Генерируется..." : "Сгенерировать"}
          </button>

          {result && (
            <img
              src={result}
              alt="result"
              style={{
                marginTop: "20px",
                width: "100%",
                borderRadius: "12px",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}