import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./NovoSimulado.css";

export default function NovoSimulado() {
  const navigate = useNavigate();

  const [quantidade, setQuantidade] = useState(180);
  const [dominio, setDominio] = useState("Todos");
  const [dificuldade, setDificuldade] = useState("Todas");
  const [modo, setModo] = useState("Exame");

  function iniciarSimulado() {
    // Depois estes dados serão enviados para o banco/API.
    console.log({
      quantidade,
      dominio,
      dificuldade,
      modo,
    });

    navigate("/simulado");
  }

  return (
    <div className="NovoSimuladoPage">

      <div className="NovoSimuladoCard">

        <div className="topo">

          <div>
            <h1>Novo Simulado</h1>

            <p>
              Configure o seu exame PMP® exatamente como desejar.
            </p>
          </div>

          <div className="iconeTopo">
            🎯
          </div>

        </div>

        <div className="linha"></div>

        <div className="formulario">

          <div className="campo">

            <label>
              Quantidade de Questões
            </label>

            <select
              value={quantidade}
              onChange={(e) =>
                setQuantidade(Number(e.target.value))
              }
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={180}>180</option>
            </select>

          </div>

          <div className="campo">

            <label>
              Domínio ECO
            </label>

            <select
              value={dominio}
              onChange={(e) =>
                setDominio(e.target.value)
              }
            >
              <option>Todos</option>
              <option>People</option>
              <option>Process</option>
              <option>Business Environment</option>
            </select>

          </div>

          <div className="campo">

            <label>
              Dificuldade
            </label>

            <select
              value={dificuldade}
              onChange={(e) =>
                setDificuldade(e.target.value)
              }
            >
              <option>Todas</option>
              <option>Fácil</option>
              <option>Média</option>
              <option>Difícil</option>
            </select>

          </div>

          <div className="campo">

            <label>
              Modo
            </label>

            <select
              value={modo}
              onChange={(e) =>
                setModo(e.target.value)
              }
            >
              <option>Exame</option>
              <option>Estudo</option>
            </select>

          </div>

        </div>

        <div className="resumo">

          <div className="resumoTitulo">
            Resumo do Simulado
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

        </div>

        <div className="botoes">

          <button
            className="btnPrimario"
            onClick={iniciarSimulado}
          >
            🚀 Iniciar Simulado
          </button>

          <button
            className="btnSecundario"
            onClick={() => navigate("/")}
          >
            Voltar
          </button>

        </div>

      </div>

    </div>
  );
}