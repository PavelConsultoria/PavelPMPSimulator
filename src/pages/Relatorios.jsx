import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";

export default function Relatorios() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    navigate("/");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#000",
        color: "#fff",
        display: "flex",
      }}
    >
      {/* MENU LATERAL */}
      <aside
        style={{
          width: "220px",
          minHeight: "100vh",
          borderRight: "1px solid #374151",
          padding: "15px 20px",
          boxSizing: "border-box",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          <img
            src={logo}
            alt="Pavel"
            style={{
              width: "75px",
              height: "auto",
            }}
          />
        </div>

        <nav>
          <Link
            to="/dashboard"
            style={{
              display: "block",
              color: "#fff",
              textDecoration: "none",
              padding: "12px 15px",
              marginBottom: "5px",
              fontSize: "18px",
            }}
          >
            🏠 &nbsp;Início
          </Link>

          <Link
            to="/favoritas"
            style={{
              display: "block",
              color: "#fff",
              textDecoration: "none",
              padding: "12px 15px",
              marginBottom: "5px",
              fontSize: "18px",
            }}
          >
            ⭐ &nbsp;Favoritas
          </Link>

          <Link
            to="/relatorios"
            style={{
              display: "block",
              color: "#fff",
              textDecoration: "none",
              padding: "12px 15px",
              marginBottom: "5px",
              fontSize: "18px",
              backgroundColor: "#16a34a",
              borderRadius: "12px",
              fontWeight: "bold",
            }}
          >
            📄 &nbsp;Relatórios
          </Link>

          <Link
            to="/configuracoes"
            style={{
              display: "block",
              color: "#fff",
              textDecoration: "none",
              padding: "12px 15px",
              marginBottom: "5px",
              fontSize: "18px",
            }}
          >
            ⚙️ &nbsp;Configurações
          </Link>

          <Link
            to="/ajuda"
            style={{
              display: "block",
              color: "#fff",
              textDecoration: "none",
              padding: "12px 15px",
              marginBottom: "5px",
              fontSize: "18px",
            }}
          >
            ❓ &nbsp;Ajuda
          </Link>

          <button
            onClick={handleLogout}
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              background: "none",
              border: "none",
              color: "#fff",
              padding: "12px 15px",
              marginTop: "5px",
              fontSize: "18px",
              cursor: "pointer",
            }}
          >
            ◉ &nbsp;Sair
          </button>
        </nav>
      </aside>

      {/* CONTEÚDO */}
      <main
        style={{
          flex: 1,
          minHeight: "100vh",
          padding: "45px 50px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              color: "#fff",
              fontSize: "34px",
              marginBottom: "8px",
            }}
          >
            📄 Relatórios
          </h1>

          <p
            style={{
              color: "#9ca3af",
              fontSize: "16px",
              marginBottom: "45px",
            }}
          >
            Consulte seus resultados e acompanhe seu histórico nos simulados.
          </p>

          {/* CARTÃO DE CONTATO */}
          <div
            style={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "16px",
              padding: "42px 35px",
              maxWidth: "640px",
              margin: "0 auto",
              boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
            }}
          >
            <h2
              style={{
                color: "#22c55e",
                fontSize: "30px",
                marginBottom: "25px",
              }}
            >
              Pavel Consultoria
            </h2>

            <p
              style={{
                color: "#fff",
                fontSize: "21px",
                fontWeight: "bold",
                marginBottom: "12px",
              }}
            >
              Karolina Poznyakov, MSc
            </p>

            <p
              style={{
                color: "#ddd",
                fontSize: "18px",
                marginBottom: "30px",
              }}
            >
              📱 WhatsApp: (21) 99571-6270
            </p>

            <a
              href="https://wa.me/5521995716270"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                backgroundColor: "#22c55e",
                color: "#000",
                textDecoration: "none",
                fontWeight: "bold",
                fontSize: "17px",
                padding: "17px 30px",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              FALAR PELO WHATSAPP
            </a>

            <br />

            <button
              type="button"
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
              VOLTAR À TELA PRINCIPAL
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}