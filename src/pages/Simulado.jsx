import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Simulado.css";
import { carregarQuestoesExcel, embaralharQuestoes } from "../data/carregarQuestoesExcel";
import AnaliseRespostas from "./AnaliseRespostas";

export default function Simulado() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mostrarContato, setMostrarContato] = useState(false);

  const TEMPO_TOTAL = 230 * 60;
  const quantidadeSelecionada = location.state?.quantidade || 180;
  const modoSelecionado = location.state?.modo || "Exame";
  // ROTINA TEMPORÁRIA: ativada exclusivamente por /novo-simulado?teste=1.
  const rotinaTeste = location.state?.rotinaTeste === true;
  const quantidadeEfetiva = rotinaTeste ? 5 : quantidadeSelecionada;

  const [questoes, setQuestoes] = useState([]);
  const [erroCarregamento, setErroCarregamento] = useState(null);
  const [tempoRestante, setTempoRestante] = useState(TEMPO_TOTAL);
  const [questaoAtual, setQuestaoAtual] = useState(1);
  const [respostas, setRespostas] = useState({});
  const [marcadas, setMarcadas] = useState([]);
  const [mostrarMensagem, setMostrarMensagem] = useState(false);
  const [mostrarAnalise, setMostrarAnalise] = useState(false);

  const modoEstudo = modoSelecionado.toLowerCase() === "estudo";

  const TOTAL_QUESTOES = questoes.length;
  const questao = questoes[questaoAtual - 1];

  useEffect(() => {
    let ativo = true;

    carregarQuestoesExcel()
      .then((questoesCarregadas) => {
        if (ativo) {
          setQuestoes(
            embaralharQuestoes(questoesCarregadas).slice(0, quantidadeEfetiva)
          );
        }
      })
      .catch((erro) => {
        if (ativo) {
          setErroCarregamento(erro);
        }
      });

    return () => {
      ativo = false;
    };
  }, [quantidadeEfetiva]);

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

  function respostasEstaoCompletas(resposta, questaoRespondida) {
    return resposta?.length === questaoRespondida.corretas.length;
  }

  function respostaEstaCorreta(resposta, questaoRespondida) {
    return (
      respostasEstaoCompletas(resposta, questaoRespondida) &&
      resposta.every((indice) => questaoRespondida.corretas.includes(indice))
    );
  }

  function calcularAcertos() {
    return questoes.reduce((total, questaoDoSimulado, indice) => {
      return respostaEstaCorreta(respostas[indice + 1], questaoDoSimulado)
        ? total + 1
        : total;
    }, 0);
  }

  function calcularResultadoExame() {
    const porDominio = ["People", "Process", "Business Environment"].reduce((resultado, dominio) => {
      const questoesDominio = questoes.filter((item) => item.dominio === dominio);
      const acertos = questoesDominio.filter((item) => {
        const indice = questoes.indexOf(item) + 1;
        return respostaEstaCorreta(respostas[indice], item);
      }).length;
      resultado[dominio] = questoesDominio.length ? Math.round((acertos / questoesDominio.length) * 100) : 0;
      return resultado;
    }, {});

    return { percentual: Math.round((calcularAcertos() / TOTAL_QUESTOES) * 100), porDominio };
  }

  function selecionarResposta(indice) {
    const respostasAtuais = respostas[questaoAtual] || [];
    let novasRespostas;

    if (questao.tipoResposta === "Multiple Response") {
      if (respostasAtuais.includes(indice)) {
        novasRespostas = respostasAtuais.filter((resposta) => resposta !== indice);
      } else if (respostasAtuais.length < questao.corretas.length) {
        novasRespostas = [...respostasAtuais, indice];
      } else {
        novasRespostas = respostasAtuais;
      }
    } else {
      novasRespostas = [indice];
    }

    setRespostas({
      ...respostas,
      [questaoAtual]: novasRespostas,
    });

    if (
      questaoAtual === TOTAL_QUESTOES &&
      respostasEstaoCompletas(novasRespostas, questao)
    ) {
      setMostrarMensagem(true);
    }
  }

  function marcarRevisao() {
    if (marcadas.includes(questaoAtual)) {
      setMarcadas(marcadas.filter((q) => q !== questaoAtual));
    } else {
      setMarcadas([...marcadas, questaoAtual]);
    }
  }

  function proxima() {
    if (
      questaoAtual < TOTAL_QUESTOES &&
      respostasEstaoCompletas(respostas[questaoAtual], questao)
    ) {
      setQuestaoAtual(questaoAtual + 1);
    }
  }

  function anterior() {
    if (questaoAtual > 1) {
      setMostrarMensagem(false);
      setQuestaoAtual(questaoAtual - 1);
    }
  }

  function finalizar() {
    if (window.confirm("Deseja realmente finalizar o simulado?")) {
      if (modoEstudo) {
        navigate("/dashboard");
      } else {
        navigate("/relatorio-exame", { state: { resultado: calcularResultadoExame() } });
      }
    }
  }

  const progresso = (questaoAtual / TOTAL_QUESTOES) * 100;

  if (erroCarregamento) {
    console.error(erroCarregamento);
    return null;
  }

  if (!questao) {
    return null;
  }

  if (mostrarAnalise && modoEstudo) {
    return (
      <AnaliseRespostas
        questao={questao}
        respostaAluno={respostas[questaoAtual]}
        numero={questaoAtual}
        total={TOTAL_QUESTOES}
        onVoltar={() => setMostrarAnalise(false)}
        onProxima={() => {
          setMostrarAnalise(false);
          setQuestaoAtual(questaoAtual + 1);
        }}
      />
    );
  }

  return (
    <div className="simuladoPage">
      <header className="headerSimulado">
        <div>
          <h1>MODO {modoSelecionado.toUpperCase()}</h1>

          <span>
            {rotinaTeste ? "TESTE TEMPORÁRIO — " : ""}
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
                  respostas[questaoAtual]?.includes(indice)
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

          <div className={modoEstudo ? "acoes acoesEstudo" : "acoes"}>

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

            {modoEstudo && (
              <button
                className="btnAnalise"
                onClick={() => setMostrarAnalise(true)}
                disabled={!respostasEstaoCompletas(respostas[questaoAtual], questao)}
              >
                Análise das Respostas
              </button>
            )}

            {questaoAtual < TOTAL_QUESTOES ? (
              <button
                className="btnProxima"
                onClick={proxima}
                disabled={!respostasEstaoCompletas(respostas[questaoAtual], questao)}
              >
                Próxima ▶
              </button>
            ) : null}

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
                  onClick={() => {
                    setMostrarMensagem(false);
                    setQuestaoAtual(numero);
                  }}
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
            Finalizar Demonstração
          </button>
        </aside>
      </div>

      {mostrarMensagem && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.82)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            style={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "16px",
              padding: "40px",
              maxWidth: "700px",
              width: "100%",
              textAlign: "center",
              boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
            }}
          >
            <div
              style={{
                fontSize: "48px",
                marginBottom: "15px",
              }}
            >
              🎯
            </div>

            <h2
              style={{
                color: "#22c55e",
                fontSize: "28px",
                marginBottom: "20px",
              }}
            >
              Você concluiu a demonstração!
            </h2>

            <p
              style={{
                color: "#fff",
                fontSize: "18px",
                lineHeight: "1.7",
                marginBottom: "15px",
              }}
            >
              Estas 3 questões foram apenas uma amostra do
              <strong> Simulador® Pavel PMP</strong>.
            </p>

            <p
              style={{
                color: "#ddd",
                fontSize: "17px",
                lineHeight: "1.7",
                marginBottom: "15px",
              }}
            >
              Na versão completa, você terá acesso ao banco de
              questões para continuar sua preparação para a
              certificação PMP, com questões organizadas por
              <strong> área, processo e nível de dificuldade</strong>.
            </p>

            <p
              style={{
                color: "#22c55e",
                fontSize: "19px",
                fontWeight: "bold",
                lineHeight: "1.5",
                marginBottom: "25px",
              }}
            >
              🚀 Continue sua preparação e avance rumo à
              certificação PMP!
            </p>

            <button
              style={{
                backgroundColor: "#22c55e",
                color: "#000",
                border: "none",
                borderRadius: "8px",
                padding: "14px 28px",
                fontSize: "17px",
                fontWeight: "bold",
                cursor: "pointer",
                marginBottom: "12px",
              }}
             onClick={() => setMostrarContato(true)}
            >
              QUERO CONHECER A VERSÃO COMPLETA
            </button>

            <br />

            <button
              style={{
                backgroundColor: "transparent",
                color: "#aaa",
                border: "none",
                padding: "10px 20px",
                fontSize: "15px",
                cursor: "pointer",
              }}
              onClick={() => setMostrarMensagem(false)}
            >
              Continuar
            </button>
          </div>
        </div>
      )}
      {mostrarContato && (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10000,
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "#1f2937",
          border: "1px solid #374151",
          borderRadius: "16px",
          padding: "40px",
          maxWidth: "600px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
        }}
      >
        <h2
          style={{
            color: "#22c55e",
            fontSize: "28px",
            marginBottom: "25px",
          }}
        >
          Pavel Consultoria
        </h2>

        <p
          style={{
            color: "#fff",
            fontSize: "20px",
            fontWeight: "bold",
            marginBottom: "8px",
          }}
        >
          Karolina Poznyakov, MSc
        </p>

        <p
          style={{
            color: "#ddd",
            fontSize: "18px",
            marginBottom: "30px",
          }}
        >
          📱 WhatsApp: (21) 99571-6270
        </p>

        <a
          href="https://wa.me/5521995716270"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            backgroundColor: "#22c55e",
            color: "#000",
            textDecoration: "none",
            borderRadius: "8px",
            padding: "14px 28px",
            fontSize: "17px",
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          FALAR PELO WHATSAPP
        </a>

        <br />

        <button
          onClick={() => navigate("/dashboard")}
          style={{
            backgroundColor: "#374151",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "12px 24px",
            fontSize: "15px",
            cursor: "pointer",
          }}
        >
          VOLTAR À TELA PRINCIPAL
        </button>
      </div>
    </div>
  )}

    </div>
  );
}
