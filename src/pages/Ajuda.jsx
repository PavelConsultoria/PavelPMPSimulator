import { Link, useNavigate } from "react-router-dom";
import "../styles/home.css";
import logo from "../assets/images/logo.png";

export default function Ajuda() {
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

          <Link to="/relatorios" className="menu">
            📑
            <span>Relatórios</span>
          </Link>

          <Link to="/configuracoes" className="menu">
            ⚙
            <span>Configurações</span>
          </Link>

          <Link to="/ajuda" className="menu active">
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
            <p>
              Plataforma completa para preparação da certificação PMP®
            </p>
          </div>
        </header>

        <section
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "70vh",
            padding: "20px",
            boxSizing: "border-box",
          }}
        >

          <div
            style={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "16px",
              padding: "40px",
              maxWidth: "600px",
              width: "100%",
              textAlign: "center",
              boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
              boxSizing: "border-box",
            }}
          >

            <h2
              style={{
                color: "#22c55e",
                fontSize: "28px",
                marginBottom: "25px",
              }}
            >
              Pavel Consultoria
            </h2>

            <p
              style={{
                color: "#ffffff",
                fontSize: "20px",
                fontWeight: "bold",
                marginBottom: "8px",
              }}
            >
              Karolina Poznyakov, MSc
            </p>

            <p
              style={{
                color: "#dddddd",
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
                color: "#000000",
                textDecoration: "none",
                borderRadius: "8px",
                padding: "14px 28px",
                fontSize: "17px",
                fontWeight: "bold",
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
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                padding: "12px 24px",
                fontSize: "15px",
                cursor: "pointer",
              }}
            >
              VOLTAR À TELA PRINCIPAL
            </button>

          </div>

        </section>

      </main>

    </div>
  );
}