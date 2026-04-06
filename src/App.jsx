export default function App() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a12",
      color: "white",
      padding: "20px",
      fontFamily: "Arial"
    }}>
      <h1>KOKOS AI</h1>
      <h2>Mini App</h2>

      <div style={{
        marginTop: "20px",
        padding: "20px",
        background: "#151520",
        borderRadius: "20px"
      }}>
        <p>Генерация изображений</p>
        <textarea
          placeholder="Напиши промт..."
          style={{
            width: "100%",
            height: "120px",
            marginTop: "10px",
            background: "#0f0f17",
            color: "white",
            borderRadius: "10px",
            padding: "10px"
          }}
        />

        <button style={{
          marginTop: "10px",
          padding: "10px",
          width: "100%",
          background: "#67e8f9",
          border: "none",
          borderRadius: "10px"
        }}>
          Сгенерировать
        </button>
      </div>
    </div>
  );
}