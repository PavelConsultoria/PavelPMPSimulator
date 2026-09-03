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
import SobreSimulador from "./pages/SobreSimulador";
import SobrePavel from "./pages/SobrePavel";
import RelatorioExame from "./pages/RelatorioExame";
import AcessoBloqueado from "./components/AcessoBloqueado";
import { MENSAGENS_BLOQUEIO } from "./components/mensagensBloqueio";

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

        <Route path="/sobre-simulador" element={<SobreSimulador />} />

        <Route path="/sobre-pavel" element={<SobrePavel />} />

        <Route
          path="/acesso-expirado"
          element={
            <AcessoBloqueado
              mensagem={MENSAGENS_BLOQUEIO.LICENCA_EXPIRADA}
            />
          }
        />

        <Route
          path="/acesso-nao-autorizado"
          element={
            <AcessoBloqueado
              mensagem={MENSAGENS_BLOQUEIO.ACESSO_NAO_AUTORIZADO}
            />
          }
        />

      </Routes>
    </HashRouter>
  );
}
