import { HashRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import NovoSimulado from "./pages/NovoSimulado";
import Simulado from "./pages/Simulado";
import BancoQuestoes from "./pages/BancoQuestoes";
import Estatisticas from "./pages/Estatisticas";
import Desempenho from "./pages/Desempenho";
import Relatorios from "./pages/Relatorios";
import Favoritas from "./pages/Favoritas";
import Configuracoes from "./pages/Configuracoes";
import Ajuda from "./pages/Ajuda";
import SobrePavel from "./pages/SobrePavel";
import RelatorioExame from "./pages/RelatorioExame";

export default function App() {
  return (
    <HashRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<Home />} />

        <Route path="/novo-simulado" element={<NovoSimulado />} />

        <Route path="/simulado" element={<Simulado />} />

        <Route path="/relatorio-exame" element={<RelatorioExame />} />

        <Route path="/banco-questoes" element={<BancoQuestoes />} />

        <Route path="/estatisticas" element={<Estatisticas />} />

        <Route path="/desempenho" element={<Desempenho />} />

        <Route path="/relatorios" element={<Relatorios />} />

        <Route path="/favoritas" element={<Favoritas />} />

        <Route path="/configuracoes" element={<Configuracoes />} />

        <Route path="/ajuda" element={<Ajuda />} />

        <Route path="/sobre-pavel" element={<SobrePavel />} />

      </Routes>
    </HashRouter>
  );
}
