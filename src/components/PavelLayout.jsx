import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { supabase } from "../lib/supabase";
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
  ["/sobre-simulador", "ⓘ", "Sobre o Simulador"],
  ["/sobre-pavel", "ⓘ", "Sobre a Pavel"],
];

function LogoutIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10 5V4a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2v-1" />
    <path d="M14 12H3m4-4-4 4 4 4" />
  </svg>;
}

export default function PavelLayout({ titulo, subtitulo, children, shellClassName = "", contentClassName = "pavelMain", hideHeader = false }) {
  const navigate = useNavigate();

  async function sair() {
    try {
      await supabase.auth.signOut();
    } finally {
      localStorage.removeItem("usuario");
      navigate("/login");
    }
  }

  return <div className={`pavelShell ${shellClassName}`.trim()}>
    <aside className="pavelSidebar">
      <img src={logo} alt="Pavel PMP Simulator" />
      <nav aria-label="Menu principal">
        {itens.map(([rota, icone, texto]) => <NavLink key={rota} to={rota} className={({ isActive }) => `pavelMenu${isActive ? " active" : ""}`}>
          <span aria-hidden="true">{icone}</span>{texto}
        </NavLink>)}
        <button type="button" className="pavelMenu" onClick={sair}><span aria-hidden="true"><LogoutIcon /></span>Sair</button>
      </nav>
    </aside>
    <main className={contentClassName}>
      {!hideHeader && <header className="pageHeading"><h1>{titulo}</h1><p>{subtitulo}</p></header>}
      {children}
    </main>
  </div>;
}
