import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./NovoSimulado.css";
import logo from "../assets/images/logo.png";

export default function NovoSimulado() {
  const navigate = useNavigate();

  const [quantidade, setQuantidade] = useState(180);
  const [dominio, setDominio] = useState("Todos");
  const [dificuldade, setDificuldade] = useState("Todas");
  const [modo, setModo] = useState("Exame");

  function iniciarSimulado() {
    console.log({
      quantidade,
      dominio,
      dificuldade,
      modo,
    });

    navigate("/simulado");
  }

  return (
    <div className="novoSimuladoPage">
      <main className="novoSimuladoContent">

        <header className="novoSimuladoTopbar">
          <div className="novoSimuladoBrand">
            <img
              src={logo}
              alt="Pavel Consultoria"
              className="novoSimuladoLogo"
            />

            <div className="novoSimuladoTitle">
              <h1>Novo Simulado</h1>
              <p>Configure o seu exame PMP® exatamente como desejar.</p>
            </div>
          </div>
        </header>

        <section className="novoSimuladoCard">
          <div className="secaoCabecalho">
            <div>
              <h2>Configuração do Simulado</h2>
              <p>Defina os critérios para o seu próximo exame.</p>
            </div>
          </div>

          <div className="linha" />

          <div className="formulario">
            <div className="campo">
              <label htmlFor="quantidade">Quantidade de Questões</label>
              <select
                id="quantidade"
                value={quantidade}
                onChange={(e) => setQuantidade(Number(e.target.value))}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={180}>180</option>
              </select>
            </div>

            <div className="campo">
              <label htmlFor="dominio">Domínio ECO</label>
              <select
                id="dominio"
                value={dominio}
                onChange={(e) => setDominio(e.target.value)}
              >
                <option>Todos</option>
                <option>People</option>
                <option>Process</option>
                <option>Business Environment</option>
              </select>
            </div>

            <div className="campo">
              <label htmlFor="dificuldade">Dificuldade</label>
              <select
                id="dificuldade"
                value={dificuldade}
                onChange={(e) => setDificuldade(e.target.value)}
              >
                <option>Todas</option>
                <option>Fácil</option>
                <option>Média</option>
                <option>Difícil</option>
              </select>
            </div>

            <div className="campo">
              <label htmlFor="modo">Modo</label>
              <select
                id="modo"
                value={modo}
                onChange={(e) => setModo(e.target.value)}
              >
                <option>Exame</option>
                <option>Estudo</option>
              </select>
            </div>
          </div>

          <section className="resumo">
            <div className="resumoTitulo">
              <h2>Resumo do Simulado</h2>
              <p>Confira as configurações selecionadas antes de começar.</p>
            </div>

            <div className="cardsResumo">
              <div className="itemResumo">
                <span>Questões</span>
                <strong>{quantidade}</strong>
              </div>

              <div className="itemResumo">
                <span>Domínio</span>
                <strong>{dominio}</strong>
              </div>

              <div className="itemResumo">
                <span>Dificuldade</span>
                <strong>{dificuldade}</strong>
              </div>

              <div className="itemResumo">
                <span>Modo</span>
                <strong>{modo}</strong>
              </div>
            </div>
          </section>

          <div className="botoes">
            <button
              type="button"
              className="btnPrimario"
              onClick={iniciarSimulado}
            >
              🚀 Iniciar Simulado
            </button>

            <button
              type="button"
              className="btnSecundario"
              onClick={() => navigate("/")}
            >
              Voltar
            </button>
          </div>
        </section>

      </main>
    </div>
  );
}