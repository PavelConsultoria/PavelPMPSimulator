/* eslint-disable react/only-export-components */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/home.css";
import logo from "../assets/images/logo.png";
import { carregarQuestoesExcel } from "../data/carregarQuestoesExcel";

export const CHAVE_REVISAO = "pavel-revisao";
export const LIMITE_REVISAO = 180;
const estadoInicial = { pendentes: [], ciclo: null };

function normalizarEstado(dados) {
  const pendentes = [...new Set((dados?.pendentes || []).filter(Number.isFinite))];
  const cicloValido = dados?.ciclo && Number.isFinite(dados.ciclo.totalInicial);
  return {
    pendentes,
    ciclo: cicloValido ? {
      totalInicial: dados.ciclo.totalInicial,
      revisadas: Number.isFinite(dados.ciclo.revisadas) ? dados.ciclo.revisadas : 0,
      bloqueado: Boolean(dados.ciclo.bloqueado),
    } : null,
  };
}

export function carregarRevisao() {
  try {
    const dados = localStorage.getItem(CHAVE_REVISAO);
    return dados ? normalizarEstado(JSON.parse(dados)) : estadoInicial;
  } catch {
    return estadoInicial;
  }
}

export function salvarRevisao(revisao) {
  localStorage.setItem(CHAVE_REVISAO, JSON.stringify(normalizarEstado(revisao)));
}

export function concluirQuestaoRevisao(questaoId) {
  const revisao = carregarRevisao();
  if (!revisao.pendentes.includes(questaoId)) return revisao;

  const pendentes = revisao.pendentes.filter((id) => id !== questaoId);
  let ciclo = revisao.ciclo;

  if (ciclo) {
    ciclo = { ...ciclo, revisadas: ciclo.revisadas + 1 };
    if (ciclo.bloqueado && ciclo.revisadas >= Math.ceil(ciclo.totalInicial / 2)) {
      ciclo.bloqueado = false;
    }
  }

  if (pendentes.length === 0) ciclo = null;
  const atualizado = { pendentes, ciclo };
  salvarRevisao(atualizado);
  return atualizado;
}

export default function Favoritas() {
  const navigate = useNavigate();
  const [revisao] = useState(carregarRevisao);
  const [questoes, setQuestoes] = useState([]);

  useEffect(() => {
    carregarQuestoesExcel().then((questoesCarregadas) => {
      const porId = new Map(questoesCarregadas.map((questao) => [questao.id, questao]));
      setQuestoes(revisao.pendentes.map((id) => porId.get(id)).filter(Boolean));
    });
  }, [revisao.pendentes]);

  const revisadas = revisao.ciclo?.revisadas || 0;
  const totalCiclo = revisao.ciclo?.totalInicial || revisao.pendentes.length + revisadas;

  return (
    <div className="home-container">
      <aside className="sidebar">
        <div className="logo-area"><img src={logo} alt="Pavel" className="logo-sidebar" /></div>
        <nav>
          <Link to="/dashboard" className="menu">🏠<span>Início</span></Link>
          <Link to="/favoritas" className="menu active">⭐<span>Revisão</span></Link>
          <Link to="/relatorios" className="menu">📑<span>Relatórios</span></Link>
          <Link to="/configuracoes" className="menu">⚙<span>Configurações</span></Link>
          <Link to="/ajuda" className="menu">❓<span>Ajuda</span></Link>
          <button type="button" className="btnSair" onClick={() => { localStorage.removeItem("usuario"); navigate("/"); }}>⎋<span>Sair</span></button>
        </nav>
      </aside>

      <main className="content">
        <header className="topbar"><div><h1>Questões Revisadas</h1><p>Refaça as questões pendentes para consolidar seu aprendizado.</p></div></header>
        <section style={{ maxWidth: "1000px", margin: "24px auto" }}>
          <div style={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "16px", padding: "28px", boxShadow: "0 10px 25px rgba(0,0,0,0.25)" }}>
            <h2 style={{ margin: "0 0 10px", color: "#22c55e", fontSize: "26px" }}>Progresso da Revisão</h2>
            <p style={{ margin: "0 0 8px", color: "#fff", fontSize: "20px", fontWeight: "bold" }}>{revisadas} / {totalCiclo}</p>
            <p style={{ margin: "0 0 22px", color: "#d1d5db" }}>{revisao.pendentes.length} questões pendentes</p>

            {revisao.pendentes.length > 0 ? <>
              <button type="button" onClick={() => navigate("/simulado", { state: { modo: "Revisão", fluxoRevisao: true, idsRevisao: revisao.pendentes } })} style={{ backgroundColor: "#22c55e", color: "#000", border: "none", borderRadius: "8px", padding: "14px 28px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", marginBottom: "22px" }}>INICIAR REVISÃO</button>
              <div style={{ display: "grid", gap: "10px" }}>{questoes.map((questao) => <div key={questao.id} style={{ padding: "14px 16px", border: "1px solid #374151", borderRadius: "10px", color: "#d1d5db" }}><strong style={{ color: "#22c55e" }}>Questão {questao.id}</strong><p style={{ margin: "6px 0 0" }}>{questao.enunciado}</p></div>)}</div>
            </> : <p style={{ margin: 0, color: "#d1d5db" }}>Não há questões pendentes para revisão.</p>}
          </div>
        </section>
      </main>
    </div>
  );
}
