import "../styles/dashboard.css";

function Dashboard() {

  const usuario =
    localStorage.getItem("usuario") || "Usuário";

  const nome =
    usuario
      .split(" ")
      .map(
        palavra =>
          palavra.charAt(0).toUpperCase() +
          palavra.slice(1)
      )
      .join(" ");

  return (
    <div className="dashboard">

      <h1>Bem-vindo(a), {nome}! 👋</h1>

      <p className="subtitle">
        Plataforma Inteligente para Certificação PMP®
      </p>

      <div className="cards">

        <div className="card">
          <h2>📚</h2>
          <h3>Banco de Questões</h3>
          <p>
            Consulte, filtre, cadastre e edite questões.
          </p>
        </div>

        <div className="card">
          <h2>📝</h2>
          <h3>Novo Simulado</h3>
          <p>
            Inicie um simulado personalizado.
          </p>
        </div>

        <div className="card">
          <h2>📊</h2>
          <h3>Estatísticas</h3>
          <p>
            Veja sua evolução e desempenho.
          </p>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;