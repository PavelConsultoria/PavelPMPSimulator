import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Simulado.css";
import questoes from "../data/questoes";

export default function Simulado() {
  const navigate = useNavigate();

  const TOTAL_QUESTOES = questoes.length;
  const TEMPO_TOTAL = 230 * 60;

  const [tempoRestante, setTempoRestante] = useState(TEMPO_TOTAL);
  const [questaoAtual, setQuestaoAtual] = useState(1);
  const [respostas, setRespostas] = useState({});
  const [marcadas, setMarcadas] = useState([]);

  // Questão atualmente exibida
  const questao = questoes[questaoAtual - 1];

  useEffect(() => {
    const timer = setInterval(() => {
      setTempoRestante((valor) => {
        if (valor <= 1) {
          clearInterval(timer);
          return 0;
        }
        return valor - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  function formatarTempo(segundos) {
    const h = Math.floor(segundos / 3600);
    const m = Math.floor((segundos % 3600) / 60);
    const s = segundos % 60;

    return (
      String(h).padStart(2, "0") +
      ":" +
      String(m).padStart(2, "0") +
      ":" +
      String(s).padStart(2, "0")
    );
  }

  function selecionarResposta(indice) {
    setRespostas({
      ...respostas,
      [questaoAtual]: indice,
    });
  }

  function marcarRevisao() {
    if (marcadas.includes(questaoAtual)) {
      setMarcadas(marcadas.filter((q) => q !== questaoAtual));
    } else {
      setMarcadas([...marcadas, questaoAtual]);
    }
  }

  function proxima() {
    if (questaoAtual < TOTAL_QUESTOES) {
      setQuestaoAtual(questaoAtual + 1);
    }
  }

  function anterior() {
    if (questaoAtual > 1) {
      setQuestaoAtual(questaoAtual - 1);
    }
  }

  function finalizar() {
    if (window.confirm("Deseja realmente finalizar o simulado?")) {
      navigate("/");
    }
  }

  const progresso = (questaoAtual / TOTAL_QUESTOES) * 100;

  return (
    <div className="simuladoPage">
      <header className="headerSimulado">
        <div>
          <h1>VERSÃO DE DEMONSTRAÇÃO</h1>
          <span>
            Questão {questaoAtual} de {TOTAL_QUESTOES}
          </span>
        </div>

        <div className="cronometro">
          ⏱ {formatarTempo(tempoRestante)}
        </div>
      </header>

      <div className="barra">
        <div
          className="barraInterna"
          style={{ width: `${progresso}%` }}
        />
      </div>

      <div className="conteudoSimulado">
        <div className="questaoCard">
          <div className="cabecalhoQuestao">
            <h2>
              Questão {questaoAtual}
            </h2>

            <button
              className={
                marcadas.includes(questaoAtual)
                  ? "btnRevisao ativo"
                  : "btnRevisao"
              }
              onClick={marcarRevisao}
            >
              ⭐ Marcar para Revisão
            </button>
          </div>

          <p className="enunciado">
            {questao.enunciado}
          </p>

          <div className="alternativas">
            {questao.alternativas.map((alt, indice) => (
              <button
                key={indice}
                className={
                  respostas[questaoAtual] === indice
                    ? "alternativa selecionada"
                    : "alternativa"
                }
                onClick={() => selecionarResposta(indice)}
              >
                <span className="letra">
                  {String.fromCharCode(65 + indice)}
                </span>

                <span className="textoAlternativa">
                  {alt}
                </span>
              </button>
            ))}
          </div>

          <div className="acoes">
            <button
              className="btnAnterior"
              onClick={anterior}
              disabled={questaoAtual === 1}
            >
              ◀ Anterior
            </button>

            <button
              className="btnMenuPrincipal"
              onClick={() => navigate("/dashboard")}
            >
              Voltar à Tela Principal
            </button>

            {questaoAtual < TOTAL_QUESTOES ? (
              <button
                className="btnProxima"
                onClick={proxima}
              >
                Próxima ▶
              </button>
            ) : (
              <button
                className="btnProxima"
                onClick={() =>
                  alert(`🎉 Parabéns!

Você concluiu a Versão de Demonstração.

Em breve você será direcionado para conhecer a versão completa.`)
                }
              >
                🏁 Encerrar Demonstração
              </button>
            )}
          </div>
        </div>

        <aside className="painelDireito">
          <h3>Navegação</h3>

          <div className="gradeQuestoes">
            {Array.from(
              { length: TOTAL_QUESTOES },
              (_, i) => i + 1
            ).map((numero) => {
              let classe = "numeroQuestao";

              if (numero === questaoAtual) {
                classe += " atual";
              }

              if (respostas[numero] !== undefined) {
                classe += " respondida";
              }

              if (marcadas.includes(numero)) {
                classe += " revisao";
              }

              return (
                <button
                  key={numero}
                  className={classe}
                  onClick={() => setQuestaoAtual(numero)}
                >
                  {numero}
                </button>
              );
            })}
          </div>

          <button
            className="btnFinalizar"
            onClick={finalizar}
          >
            Finalizar Simulado
          </button>
        </aside>
      </div>
    </div>
  );
}