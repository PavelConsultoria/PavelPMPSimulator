import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import NovoSimulado from "./pages/NovoSimulado";
import Simulado from "./pages/Simulado";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Tela inicial */}
        <Route path="/" element={<Login />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/novo-simulado" element={<NovoSimulado />} />

        <Route path="/simulado" element={<Simulado />} />

      </Routes>
    </BrowserRouter>
  );
}