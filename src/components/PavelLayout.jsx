import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import "../styles/pavel-dashboard.css";

const itens = [
  ["/dashboard", "⌂", "Início"],
  ["/novo-simulado", "◎", "Novo Simulado"],
  ["/banco-questoes", "▤", "Banco de Questões"],
  ["/favoritas", "★", "Revisão"],
  ["/desempenho", "↗", "Desempenho"],
  ["/estatisticas", "▥", "Estatísticas"],
  ["/relatorios", "▧", "Relatórios"],
  ["/configuracoes", "⚙", "Configurações"],
  ["/ajuda", "?", "Ajuda"],
  ["/sobre-pavel", "ⓘ", "Sobre a Pavel"],
];

export default function PavelLayout({ titulo, subtitulo, children }) {
  const navigate = useNavigate();
  return <div className="pavelShell">
    <aside className="pavelSidebar">
      <img src={logo} alt="Pavel PMP Simulator" />
      <nav aria-label="Menu principal">
        {itens.map(([rota, icone, texto]) => <NavLink key={rota} to={rota} className={({ isActive }) => `pavelMenu${isActive ? " active" : ""}`}>
          <span aria-hidden="true">{icone}</span>{texto}
        </NavLink>)}
        <button type="button" className="pavelMenu" onClick={() => { localStorage.removeItem("usuario"); navigate("/"); }}><span aria-hidden="true">⎋</span>Sair</button>
      </nav>
    </aside>
    <main className="pavelMain">
      <header className="pageHeading"><h1>{titulo}</h1><p>{subtitulo}</p></header>
      {children}
    </main>
  </div>;
}
