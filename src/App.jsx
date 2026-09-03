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
import RotaProtegida from "./components/RotaProtegida";

export default function App() {
  return (
    <HashRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<RotaProtegida><Home /></RotaProtegida>} />

        <Route path="/novo-simulado" element={<RotaProtegida><NovoSimulado /></RotaProtegida>} />

        <Route path="/simulado" element={<RotaProtegida><Simulado /></RotaProtegida>} />

        <Route path="/relatorio-exame" element={<RotaProtegida><RelatorioExame /></RotaProtegida>} />

        <Route path="/banco-questoes" element={<RotaProtegida><BancoQuestoes /></RotaProtegida>} />

        <Route path="/estatisticas" element={<RotaProtegida><Estatisticas /></RotaProtegida>} />

        <Route path="/desempenho" element={<RotaProtegida><Desempenho /></RotaProtegida>} />

        <Route path="/relatorios" element={<RotaProtegida><Relatorios /></RotaProtegida>} />

        <Route path="/favoritas" element={<RotaProtegida><Favoritas /></RotaProtegida>} />

        <Route path="/configuracoes" element={<RotaProtegida><Configuracoes /></RotaProtegida>} />

        <Route path="/ajuda" element={<RotaProtegida><Ajuda /></RotaProtegida>} />

        <Route path="/sobre-simulador" element={<RotaProtegida><SobreSimulador /></RotaProtegida>} />

        <Route path="/sobre-pavel" element={<RotaProtegida><SobrePavel /></RotaProtegida>} />

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
