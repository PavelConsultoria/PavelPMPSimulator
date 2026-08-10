import { Link, useNavigate } from "react-router-dom";
import "../styles/home.css";
import logo from "../assets/images/logo.png";

export default function Relatorios() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    navigate("/");
  };

  return (
    <div className="home-container">

      <aside className="sidebar">

        <div className="logo-area">
          <img src={logo} alt="Pavel" className="logo-sidebar" />
        </div>

        <nav>

          <Link to="/dashboard" className="menu">
            🏠
            <span>Início</span>
          </Link>

          <Link to="/favoritas" className="menu">
            ⭐
            <span>Favoritas</span>
          </Link>

          <Link to="/relatorios" className="menu active">
            📑
            <span>Relatórios</span>
          </Link>

          <Link to="/configuracoes" className="menu">
            ⚙
            <span>Configurações</span>
          </Link>

          <Link to="/ajuda" className="menu">
            ❓
            <span>Ajuda</span>
          </Link>

          <button
            type="button"
            className="btnSair"
            onClick={handleLogout}
          >
            ⎋
            <span>Sair</span>
          </button>

        </nav>

      </aside>

      <main className="content">

        <header className="topbar">
          <div>
            <h1>Simulador® PMP</h1>
            <p>Plataforma completa para preparação da certificação PMP®</p>
          </div>
        </header>

        <section
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "70vh",
          }}
        >

          <div
            style={{
              width: "100%",
              maxWidth: "1000px",
              textAlign: "center",
            }}
          >

            <h2
              style={{
                color: "#fff",
                fontSize: "34px",
                marginBottom: "8px",
              }}
            >
              📄 Relatórios
            </h2>

            <p
              style={{
                color: "#9ca3af",
                fontSize: "16px",
                marginBottom: "45px",
              }}
            >
              Consulte seus resultados e acompanhe seu histórico nos simulados.
            </p>

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

        </section>

      </main>

    </div>
  );
}