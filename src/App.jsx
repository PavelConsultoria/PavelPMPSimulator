import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import NovoSimulado from "./pages/NovoSimulado";
import Simulado from "./pages/Simulado";
import BancoQuestoes from "./pages/BancoQuestoes";
import Estatisticas from "./pages/Estatisticas";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<Home />} />

        <Route path="/novo-simulado" element={<NovoSimulado />} />

        <Route path="/simulado" element={<Simulado />} />

        <Route path="/banco-questoes" element={<BancoQuestoes />} />

        <Route path="/estatisticas" element={<Estatisticas />} />

      </Routes>
    </BrowserRouter>
  );
}