import { NavLink } from "react-router-dom";
import "../styles/sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="logoArea">

        <div className="logoIcon">
          ▲
        </div>

        <div>
          <h2>PAVEL</h2>
          <span>PMP Simulator®</span>
        </div>

      </div>

      <nav>

        <NavLink to="/">
          🏠
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/simulado">
          🎯
          <span>Novo Simulado</span>
        </NavLink>

        <NavLink to="/questoes">
          📚
          <span>Banco de Questões</span>
        </NavLink>

        <NavLink to="/favoritas">
          ⭐
          <span>Favoritas</span>
        </NavLink>

        <NavLink to="/configuracoes">
          ⚙️
          <span>Configurações</span>
        </NavLink>

      </nav>

    </aside>
  );
}
