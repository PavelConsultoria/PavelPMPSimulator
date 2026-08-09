import { useNavigate } from "react-router-dom";

export default function Relatorios() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#000",
        color: "#fff",
        padding: "50px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            color: "#22c55e",
            fontSize: "36px",
            marginBottom: "15px",
          }}
        >
          📄 Relatórios
        </h1>

        <p
          style={{
            color: "#ddd",
            fontSize: "18px",
            marginBottom: "40px",
          }}
        >
          Consulte seus resultados e acompanhe seu histórico nos simulados.
        </p>

        <div
          style={{
            backgroundColor: "#1f2937",
            borderRadius: "12px",
            padding: "40px",
            border: "1px solid #374151",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              fontSize: "48px",
              marginBottom: "15px",
            }}
          >
            📊
          </div>

          <h2
            style={{
              color: "#22c55e",
              marginBottom: "15px",
            }}
          >
            Seus relatórios aparecerão aqui
          </h2>

          <p
            style={{
              color: "#ccc",
              fontSize: "17px",
              lineHeight: "1.6",
              maxWidth: "700px",
              margin: "0 auto",
            }}
          >
            Após realizar seus simulados, esta área poderá apresentar
            relatórios com seus resultados, percentual de acertos,
            desempenho por área e histórico de evolução.
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          style={{
            backgroundColor: "#374151",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "12px 28px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Voltar
        </button>

        <div
          style={{
            marginTop: "45px",
            color: "#777",
            fontSize: "14px",
          }}
        >
          Simulador® Pavel PMP
        </div>
      </div>
    </div>
  );
}