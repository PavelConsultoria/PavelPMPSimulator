import { Link, useNavigate } from "react-router-dom";
import "../styles/home.css";
import logo from "../assets/images/logo.png";

export default function Home() {

  const usuario = localStorage.getItem("usuario") || "Usuário";
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

          <Link to="/dashboard" className="menu active">
            🏠
            <span>Início</span>
          </Link>

          <Link to="/favoritas" className="menu">
            ⭐
            <span>Revisão</span>
          </Link>

          <Link to="/desempenho" className="menu">
            📈
            <span>Desempenho</span>
          </Link>

          <Link to="/relatorios" className="menu">
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

          <Link to="/sobre-pavel" className="menu">
            ⓘ
            <span>Sobre a Pavel</span>
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

        <section className="hero">

          <img
            src={logo}
            alt="Pavel"
            className="hero-logo"
          />

          <h2>Bem-vinda, {usuario}!</h2>

          <p>
            Escolha uma das opções abaixo para iniciar seus estudos.
          </p>

        </section>

        <section className="cards">

          <Link to="/novo-simulado" className="card">

            <h3>🎯 Novo Simulado</h3>

            <p>
              Inicie um exame completo baseado na prova PMP®.
            </p>

          </Link>

          <Link to="/banco-questoes" className="card">

            <h3>📚 Banco de Questões</h3>

            <p>
              Consulte, pesquise e filtre todas as questões.
            </p>

          </Link>

          <Link to="/estatisticas" className="card">

            <h3>📊 Estatísticas</h3>

            <p>
              Analise sua evolução por domínio e desempenho.
            </p>

          </Link>

        </section>

        <section className="kpis">

          <div className="kpi-card">
            <span className="kpi-title">Questões</span>
            <h2>3</h2>
          </div>

          <div className="kpi-card">
            <span className="kpi-title">Respondidas</span>
            <h2>0</h2>
          </div>

          <div className="kpi-card">
            <span className="kpi-title">Desempenho</span>
            <h2>0%</h2>
          </div>

          <div className="kpi-card">
            <span className="kpi-title">Tempo de Estudo</span>
            <h2>00:00</h2>
          </div>

        </section>

        <section className="dashboard">

          <div className="panel large">

            <div className="panel-header">
              <h3>Desempenho por Área</h3>
            </div>

            <div className="chart-placeholder">

              <div className="bar bar1"></div>
              <div className="bar bar2"></div>
              <div className="bar bar3"></div>
              <div className="bar bar4"></div>
              <div className="bar bar5"></div>

            </div>

          </div>

          <div className="panel">

            <div className="panel-header">
              <h3>Último Simulado</h3>
            </div>

            <div className="last-exam">

              <p><strong>Data:</strong> --</p>
              <p><strong>Questões:</strong> 180</p>
              <p><strong>Acertos:</strong> --</p>
              <p><strong>Resultado:</strong> --</p>

            </div>

          </div>

        </section>

        <footer className="footer">

          <div className="footer-item">
            <strong>3</strong>
            <span>Questões</span>
          </div>

          <div className="footer-item">
            <strong>PMBOK®</strong>
            <span>8ª Edição</span>
          </div>

          <div className="footer-item">
            <strong>ECO</strong>
            <span>PMI</span>
          </div>

          <div className="footer-item">
            <strong>2026</strong>
            <span>Atualizado</span>
          </div>

        </footer>

      </main>

    </div>
  );
}
