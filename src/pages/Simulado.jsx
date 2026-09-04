import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Simulado.css";
import AnaliseRespostas from "./AnaliseRespostas";
import ConteudoProtegido from "../components/ConteudoProtegido";
import { carregarRevisao, concluirQuestaoRevisao, LIMITE_REVISAO, salvarRevisao } from "./Favoritas";
import { carregarSessoes, salvarSessao } from "../data/progresso";
import { supabase } from "../lib/supabase";
import { obterSessaoAplicacao } from "../lib/sessaoAplicacao";

const IDS_REVISAO_VAZIOS = [];
const FILTROS_PADRAO = {
  dominio: "Todos", dificuldade: "Todas", tipoResposta: "Todos os tipos",
  abordagem: "Todas", areaConhecimento: "Todas", modoTreinamento: "Todas as questões",
};

function obterResultado(data) {
  return Array.isArray(data) ? data[0] : data;
}

function agruparCaseStudies(questoes) {
  const grupos = new Map();

  questoes.forEach((questao) => {
    if (!questao.caseStudy) return;
    const grupo = grupos.get(questao.caseStudy.id) || { ...questao.caseStudy, questoes: [] };
    grupo.questoes.push(questao);
    grupos.set(questao.caseStudy.id, grupo);
  });

  grupos.forEach((grupo) => {
    if (grupo.questoes.length !== grupo.quantidadeQuestoes) {
      throw new Error(`O Case Study ${grupo.id} possui questões incompletas.`);
    }
  });

  return [...grupos.values()];
}

function converterQuestaoSegura(linha) {
  const quantidadeRespostas = Number(linha.quantidade_respostas);
  if (!Number.isInteger(quantidadeRespostas) || quantidadeRespostas < 1) {
    throw new Error(`A questão ${linha.id_questao} possui quantidade de respostas inválida.`);
  }

  const alternativas = [
    { texto: linha.alternativa_a, letraOriginal: "A" },
    { texto: linha.alternativa_b, letraOriginal: "B" },
    { texto: linha.alternativa_c, letraOriginal: "C" },
    { texto: linha.alternativa_d, letraOriginal: "D" },
  ];

  for (let indice = alternativas.length - 1; indice > 0; indice -= 1) {
    const indiceAleatorio = Math.floor(Math.random() * (indice + 1));
    [alternativas[indice], alternativas[indiceAleatorio]] = [
      alternativas[indiceAleatorio],
      alternativas[indice],
    ];
  }

  return {
    id: linha.id_questao,
    enunciado: linha.enunciado,
    alternativas: alternativas.map(({ texto }) => texto),
    letrasOriginais: alternativas.map(({ letraOriginal }) => letraOriginal),
    quantidadeRespostas,
    corretas: Array.from({ length: quantidadeRespostas }),
    tipoResposta: linha.tipo_resposta,
    instrucao: linha.instrucao,
    dominio: linha.dominio_eco,
    dificuldade: linha.dificuldade,
    areaConhecimento: linha.area_conhecimento,
    grupoProcesso: linha.grupo_processo,
    tema: linha.tema,
    abordagem: linha.abordagem,
    palavrasChave: linha.palavra_chave,
    tempoQuestao: linha.tempo_questao,
    caseStudy: linha.case_id ? {
      id: linha.case_id,
      contexto: linha.contexto,
      quantidadeQuestoes: linha.quantidade_questoes,
      ordemNoCase: linha.ordem_no_case,
    } : null,
  };
}

function aplicarCorrecao(questao, correcao) {
  const letrasCorretas = String(correcao.resposta_correta || "").match(/[A-D]/g) || [];
  const justificativasOriginais = {
    A: correcao.justificativa_a,
    B: correcao.justificativa_b,
    C: correcao.justificativa_c,
    D: correcao.justificativa_d,
  };

  return {
    ...questao,
    corretas: questao.letrasOriginais
      .map((letra, indice) => letrasCorretas.includes(letra) ? indice : null)
      .filter((indice) => indice !== null),
    explicacao: correcao.explicacao,
    justificativas: questao.letrasOriginais.map((letra) => justificativasOriginais[letra]),
    comoPMIPensa: correcao.como_pmi_pensa,
    pegadinha: correcao.pegadinha,
  };
}

export default function Simulado() {
  const navigate = useNavigate();
  const location = useLocation();
  const TEMPO_TOTAL = 230 * 60;
  const quantidadeSelecionada = location.state?.quantidade || 180;
  const modoSelecionado = location.state?.modo || "Exame";
  const fluxoRevisao = location.state?.fluxoRevisao === true;
  const idsRevisao = location.state?.idsRevisao || IDS_REVISAO_VAZIOS;
  const idsQuestoes = location.state?.idsQuestoes || IDS_REVISAO_VAZIOS;
  const origem = location.state?.origem || "/dashboard";
  const filtros = location.state?.filtros || FILTROS_PADRAO;
  const estudoCaseStudy = !fluxoRevisao && modoSelecionado === "Estudo" && quantidadeSelecionada === "Case Study";

  const [questoes, setQuestoes] = useState([]);
  const [erroCarregamento, setErroCarregamento] = useState(null);
  const [avisoQuantidade, setAvisoQuantidade] = useState("");
  const [tempoRestante, setTempoRestante] = useState(TEMPO_TOTAL);
  const [questaoAtual, setQuestaoAtual] = useState(1);
  const [maiorQuestaoAcessada, setMaiorQuestaoAcessada] = useState(1);
  const [respostas, setRespostas] = useState({});
  const [revisao, setRevisao] = useState(carregarRevisao);
  const [revisadasNestaSessao, setRevisadasNestaSessao] = useState([]);
  const [mostrarAnalise, setMostrarAnalise] = useState(false);
  const [estudoFinalizado, setEstudoFinalizado] = useState(false);
  const [tentativaId, setTentativaId] = useState(null);
  const [correcaoEmAndamento, setCorrecaoEmAndamento] = useState(false);
  const sessaoRegistrada = useRef(false);

  const modoEstudo = modoSelecionado.toLowerCase() === "estudo";
  const revisaoBloqueada = Boolean(revisao.ciclo?.bloqueado);

  const TOTAL_QUESTOES = questoes.length;
  const questao = questoes[questaoAtual - 1];
  const questaoPendente = revisao.pendentes.includes(questao?.id);
  const indiceNoCase = questoes.filter((item) => item.caseStudy?.id === questao?.caseStudy?.id).indexOf(questao) + 1;
  const casesDaSessao = estudoCaseStudy ? agruparCaseStudies(questoes) : [];
  const indiceCaseAtual = estudoCaseStudy
    ? casesDaSessao.findIndex((item) => item.id === questao?.caseStudy?.id) + 1
    : 0;

  useEffect(() => {
    let ativo = true;

    async function carregarTentativa() {
      try {
        const sessionId = obterSessaoAplicacao();
        if (!sessionId) throw new Error("Sessão da aplicação não encontrada.");

        const idsTreinamento = fluxoRevisao
          ? idsRevisao
          : idsQuestoes.length
            ? idsQuestoes
            : obterIdsTreinamento(filtros.modoTreinamento);
        const quantidadeSolicitada = fluxoRevisao
          ? idsRevisao.length
          : idsQuestoes.length
            ? idsQuestoes.length
            : estudoCaseStudy
              ? 100
              : Number(quantidadeSelecionada);

        const { data: selecao, error: erroSelecao } = await supabase.rpc(
          "iniciar_tentativa_segura",
          {
            p_session_id: sessionId,
            p_modo: fluxoRevisao ? "Estudo" : modoSelecionado,
            p_quantidade: quantidadeSolicitada,
            p_dominio: filtros.dominio,
            p_dificuldade: filtros.dificuldade,
            p_tipo_resposta: filtros.tipoResposta,
            p_abordagem: filtros.abordagem,
            p_area_conhecimento: filtros.areaConhecimento,
            p_case_study: estudoCaseStudy,
            p_ids_treinamento: idsTreinamento ? [...idsTreinamento] : null,
          },
        );

        if (erroSelecao) throw erroSelecao;

        const itensSelecionados = Array.isArray(selecao) ? selecao : [];
        const idTentativa = itensSelecionados[0]?.tentativa_id;
        const idsSelecionados = [...itensSelecionados]
          .sort((a, b) => a.ordem_selecao - b.ordem_selecao)
          .map((item) => item.id_questao);

        if (!idTentativa || idsSelecionados.length === 0) {
          if (ativo) {
            setAvisoQuantidade(
              estudoCaseStudy
                ? "Não há Case Studies completos que atendam simultaneamente a todos os filtros selecionados."
                : `Sua combinação de filtros possui 0 questão(ões) disponível(is). A sessão usará somente essas questões, sem incluir itens fora dos critérios.`,
            );
          }
          return;
        }

        const { data: dadosQuestoes, error: erroQuestoes } = await supabase.rpc(
          "obter_questoes_seguras",
          { p_session_id: sessionId, p_ids: idsSelecionados },
        );

        if (erroQuestoes) throw erroQuestoes;

        const linhas = Array.isArray(dadosQuestoes) ? dadosQuestoes : [];
        const porId = new Map(linhas.map((linha) => [linha.id_questao, linha]));
        const questoesCarregadas = idsSelecionados
          .map((id) => porId.get(id))
          .filter(Boolean)
          .map(converterQuestaoSegura);

        if (questoesCarregadas.length !== idsSelecionados.length) {
          throw new Error("A tentativa retornou questões incompletas.");
        }

        if (ativo) {
          setTentativaId(idTentativa);
          setQuestoes(questoesCarregadas);
          if (!estudoCaseStudy && questoesCarregadas.length < quantidadeSolicitada) {
            setAvisoQuantidade(`Sua combinação de filtros possui ${questoesCarregadas.length} questão(ões) disponível(is). A sessão usará somente essas questões, sem incluir itens fora dos critérios.`);
          }
        }
      } catch (erro) {
        if (ativo) {
          setErroCarregamento(erro);
        }
      }
    }

    carregarTentativa();

    return () => {
      ativo = false;
    };
  }, [fluxoRevisao, idsRevisao, idsQuestoes, quantidadeSelecionada, modoSelecionado, estudoCaseStudy, filtros]);

  function obterIdsTreinamento(modoTreinamento) {
    if (modoTreinamento === "Revisão") return new Set(carregarRevisao().pendentes);
    if (modoTreinamento === "Apenas Erro") {
      return new Set(carregarSessoes().flatMap((sessao) =>
        (sessao.detalhes || []).filter((item) => item.acertou === false).map((item) => item.id),
      ));
    }
    return null;
  }

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
    return resposta?.length === questaoRespondida.quantidadeRespostas;
  }

  function respostaEstaCorreta(resposta, questaoRespondida) {
    if (
      questaoRespondida.respostaCorrigida &&
      JSON.stringify(resposta) === JSON.stringify(questaoRespondida.respostaCorrigida)
    ) {
      return questaoRespondida.acertouServidor;
    }

    return (
      respostasEstaoCompletas(resposta, questaoRespondida) &&
      resposta.every((indice) => questaoRespondida.corretas.includes(indice))
    );
  }

  function calcularAcertos(questoesCorrigidas = questoes) {
    return questoesCorrigidas.reduce((total, questaoDoSimulado, indice) => {
      return respostaEstaCorreta(respostas[indice + 1], questaoDoSimulado)
        ? total + 1
        : total;
    }, 0);
  }

  function calcularResultadoExame(questoesCorrigidas = questoes) {
    const porDominio = ["People", "Process", "Business Environment"].reduce((resultado, dominio) => {
      const questoesDominio = questoesCorrigidas.filter((item) => item.dominio === dominio);
      const acertos = questoesDominio.filter((item) => {
        const indice = questoesCorrigidas.indexOf(item) + 1;
        return respostaEstaCorreta(respostas[indice], item);
      }).length;
      resultado[dominio] = questoesDominio.length ? Math.round((acertos / questoesDominio.length) * 100) : 0;
      return resultado;
    }, {});

    return { percentual: Math.round((calcularAcertos(questoesCorrigidas) / TOTAL_QUESTOES) * 100), porDominio };
  }

  function registrarSessaoConcluida(questoesCorrigidas = questoes) {
    if (sessaoRegistrada.current) return;
    const respondidas = questoesCorrigidas.filter((item, indice) => respostasEstaoCompletas(respostas[indice + 1], item)).length;
    const acertos = calcularAcertos(questoesCorrigidas);
    const porDominio = ["People", "Process", "Business Environment"].reduce((resultado, dominio) => {
      const itens = questoesCorrigidas.map((item, indice) => ({ item, resposta: respostas[indice + 1] })).filter(({ item, resposta }) => item.dominio === dominio && respostasEstaoCompletas(resposta, item));
      resultado[dominio] = { questoes: itens.length, acertos: itens.filter(({ item, resposta }) => respostaEstaCorreta(resposta, item)).length };
      return resultado;
    }, {});
    salvarSessao({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      data: new Date().toISOString(),
      modo: modoEstudo ? "Estudo" : "Exame",
      questoes: TOTAL_QUESTOES,
      respondidas,
      acertos,
      percentual: respondidas ? Math.round((acertos / respondidas) * 100) : 0,
      tempoSegundos: TEMPO_TOTAL - tempoRestante,
      porDominio,
      detalhes: questoesCorrigidas.flatMap((item, indice) => {
        const resposta = respostas[indice + 1];
        return respostasEstaoCompletas(resposta, item)
          ? [{ id: item.id, resposta, acertou: respostaEstaCorreta(resposta, item) }]
          : [];
      }),
    });
    sessaoRegistrada.current = true;
  }

  function selecionarResposta(indice) {
    const respostasAtuais = respostas[questaoAtual] || [];
    let novasRespostas;

    if (questao.tipoResposta === "Multiple Response") {
      if (respostasAtuais.includes(indice)) {
        novasRespostas = respostasAtuais.filter((resposta) => resposta !== indice);
      } else if (respostasAtuais.length < questao.quantidadeRespostas) {
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
      fluxoRevisao &&
      respostasEstaoCompletas(novasRespostas, questao) &&
      !revisadasNestaSessao.includes(questao.id)
    ) {
      setRevisao(concluirQuestaoRevisao(questao.id));
      setRevisadasNestaSessao([...revisadasNestaSessao, questao.id]);
    }

  }

  function marcarRevisao() {
    if (revisao.pendentes.includes(questao.id)) return;
    if (revisao.ciclo?.bloqueado || revisao.pendentes.length >= LIMITE_REVISAO) return;

    const pendentes = [...revisao.pendentes, questao.id];
    const ciclo = pendentes.length === LIMITE_REVISAO
      ? { totalInicial: LIMITE_REVISAO, revisadas: 0, bloqueado: true }
      : revisao.ciclo
        ? { ...revisao.ciclo, totalInicial: revisao.ciclo.totalInicial + 1 }
        : { totalInicial: pendentes.length, revisadas: 0, bloqueado: false };
    const atualizado = { pendentes, ciclo };
    salvarRevisao(atualizado);
    setRevisao(atualizado);
  }

  async function corrigirQuestao(questaoParaCorrigir, resposta) {
    if (
      questaoParaCorrigir.corrigida &&
      JSON.stringify(resposta) === JSON.stringify(questaoParaCorrigir.respostaCorrigida)
    ) return questaoParaCorrigir;

    const sessionId = obterSessaoAplicacao();
    if (!sessionId || !tentativaId) throw new Error("Tentativa segura não encontrada.");

    const respostasOriginais = resposta.map(
      (indice) => questaoParaCorrigir.letrasOriginais[indice],
    );
    const { data, error } = await supabase.rpc("corrigir_questao_segura", {
      p_session_id: sessionId,
      p_tentativa_id: tentativaId,
      p_id_questao: questaoParaCorrigir.id,
      p_respostas: respostasOriginais,
    });

    if (error) throw error;
    const correcao = obterResultado(data);
    if (!correcao || correcao.id_questao !== questaoParaCorrigir.id) {
      throw new Error("A correção da questão retornou dados inválidos.");
    }

    return {
      ...aplicarCorrecao(questaoParaCorrigir, correcao),
      corrigida: true,
      respostaCorrigida: [...resposta],
      acertouServidor: correcao.acertou === true,
    };
  }

  async function corrigirRespondidas() {
    const corrigidas = [...questoes];
    const pendentes = questoes
      .map((item, indice) => ({ item, indice, resposta: respostas[indice + 1] }))
      .filter(({ item, resposta }) => respostasEstaoCompletas(resposta, item));
    let proxima = 0;

    async function processar() {
      while (proxima < pendentes.length) {
        const atual = pendentes[proxima];
        proxima += 1;
        corrigidas[atual.indice] = await corrigirQuestao(atual.item, atual.resposta);
      }
    }

    await Promise.all(Array.from({ length: Math.min(6, pendentes.length) }, processar));
    setQuestoes(corrigidas);
    return corrigidas;
  }

  async function exibirAnalise() {
    setCorrecaoEmAndamento(true);
    try {
      const questaoCorrigida = await corrigirQuestao(questao, respostas[questaoAtual]);
      setQuestoes((atuais) => atuais.map((item) =>
        item.id === questaoCorrigida.id ? questaoCorrigida : item
      ));
      setMostrarAnalise(true);
    } catch (erro) {
      setErroCarregamento(erro);
    } finally {
      setCorrecaoEmAndamento(false);
    }
  }

  function proxima() {
    if (
      questaoAtual < TOTAL_QUESTOES &&
      respostasEstaoCompletas(respostas[questaoAtual], questao)
    ) {
      const proximaQuestao = questaoAtual + 1;
      setQuestaoAtual(proximaQuestao);
      setMaiorQuestaoAcessada((maiorAtual) => Math.max(maiorAtual, proximaQuestao));
    }
  }

  function anterior() {
    if (questaoAtual > 1) {
      setQuestaoAtual(questaoAtual - 1);
    }
  }

  async function finalizar() {
    const nomeSessao = modoEstudo ? "estudo" : "simulado";
    if (window.confirm(`Deseja realmente finalizar o ${nomeSessao}?`)) {
      if (fluxoRevisao) {
        navigate("/favoritas");
      } else {
        setCorrecaoEmAndamento(true);
        try {
          const questoesCorrigidas = await corrigirRespondidas();
          registrarSessaoConcluida(questoesCorrigidas);
          if (modoEstudo) {
            setEstudoFinalizado(true);
          } else {
            navigate("/relatorio-exame", { state: { resultado: calcularResultadoExame(questoesCorrigidas) } });
          }
        } catch (erro) {
          setErroCarregamento(erro);
        } finally {
          setCorrecaoEmAndamento(false);
        }
      }
    }
  }

  const progresso = (questaoAtual / TOTAL_QUESTOES) * 100;

  if (erroCarregamento) {
    console.error(erroCarregamento);
    return (
      <div className="simuladoPage">
        <main className="questaoCard" style={{ maxWidth: "720px", margin: "80px auto" }}>
          <h1>Não foi possível carregar o simulado.</h1>
          <p>Tente atualizar a página. Se o problema persistir, volte à tela principal e inicie o simulado novamente.</p>
        </main>
      </div>
    );
  }

  if (!questao) {
    if (avisoQuantidade) {
      return (
        <div className="simuladoPage">
          <main className="questaoCard" style={{ maxWidth: "720px", margin: "80px auto" }}>
            <h1>Nenhuma questão disponível</h1>
            <p>{avisoQuantidade}</p>
            <button className="btnMenuPrincipal" type="button" onClick={() => navigate("/novo-simulado")}>Voltar aos filtros</button>
          </main>
        </div>
      );
    }
    return (
      <div className="simuladoPage">
        <main className="questaoCard" style={{ maxWidth: "720px", margin: "80px auto" }}>
          <p>Carregando simulado...</p>
        </main>
      </div>
    );
  }

  if (mostrarAnalise && (modoEstudo || fluxoRevisao)) {
    return (
      <AnaliseRespostas
        questao={questao}
        respostaAluno={respostas[questaoAtual]}
        numero={questaoAtual}
        total={TOTAL_QUESTOES}
        onVoltar={() => setMostrarAnalise(false)}
        onProxima={() => {
          setMostrarAnalise(false);
          const proximaQuestao = questaoAtual + 1;
          setQuestaoAtual(proximaQuestao);
          setMaiorQuestaoAcessada((maiorAtual) => Math.max(maiorAtual, proximaQuestao));
        }}
      />
    );
  }

  if (estudoFinalizado && modoEstudo) {
    const acertos = calcularAcertos();
    const percentual = TOTAL_QUESTOES ? Math.round((acertos / TOTAL_QUESTOES) * 100) : 0;
    return (
      <div className="analisePage">
        <header className="headerAnalise"><h1>RESULTADO DO ESTUDO</h1></header>
        <main className="analiseCard">
          <section className="analiseResultado">
            <div><span>Acertos</span><strong>{acertos} de {TOTAL_QUESTOES}</strong></div>
            <div><span>Aproveitamento</span><strong>{percentual}%</strong></div>
          </section>
          <section className="analiseSecao">
            <h2>Estudo concluído</h2>
            <p>Você pode voltar às questões para consultar a análise das respostas ou retornar à tela principal.</p>
          </section>
          <footer className="acoesAnalise">
            <button className="btnAnterior" type="button" onClick={() => setEstudoFinalizado(false)}>◀ Voltar às questões</button>
            <button className="btnProxima" type="button" onClick={() => navigate("/dashboard")}>Voltar à Tela Principal</button>
          </footer>
        </main>
      </div>
    );
  }

  return (
    <div className="simuladoPage">
      <header className="headerSimulado">
        <div>
          <h1>{estudoCaseStudy ? "CASE STUDY" : `MODO ${modoSelecionado.toUpperCase()}`}</h1>

          <span>
            {estudoCaseStudy
              ? `Case Study ${indiceCaseAtual} de ${casesDaSessao.length} — Questão ${indiceNoCase} de ${questao.caseStudy.quantidadeQuestoes}`
              : `Questão ${questaoAtual} de ${TOTAL_QUESTOES}`}
          </span>
        </div>

        <div className="cronometro">
          ⏱ {formatarTempo(tempoRestante)}
        </div>
      </header>

      {revisaoBloqueada && !fluxoRevisao && (
        <p className="mensagemLimiteRevisao">
          Limite de 180 questões para revisão atingido. Revise algumas questões para liberar novas marcações.
        </p>
      )}

      {avisoQuantidade && <p className="mensagemQuantidade">{avisoQuantidade}</p>}

      <div className="barra">
        <div
          className="barraInterna"
          style={{ width: `${progresso}%` }}
        />
      </div>

      <div className="conteudoSimulado">
        <div className={questao.caseStudy ? "questaoCard questaoCaseStudy" : "questaoCard"}>

          <div className="cabecalhoQuestao">
            <div className="tituloQuestao">
              <h2>
                {estudoCaseStudy ? `Questão ${indiceNoCase} de ${questao.caseStudy.quantidadeQuestoes}` : `Questão ${questaoAtual}`}
              </h2>
              {questao.caseStudy && !estudoCaseStudy && <span className="identificacaoCaseStudy">CASE STUDY</span>}
              <span className="tipoQuestao">
                {questao.quantidadeRespostas > 1 ? "MULTIPLE CHOICE" : "SINGLE CHOICE"}
              </span>
            </div>

            <button
              className={
                questaoPendente
                  ? "btnRevisao ativo"
                  : "btnRevisao"
              }
              onClick={marcarRevisao}
              disabled={questaoPendente || revisaoBloqueada}
            >
              ⭐ Marcar para Revisão
            </button>
          </div>

          <ConteudoProtegido>
            {questao.caseStudy && (
              <section className="contextoCaseStudy">
                <h2>CASE STUDY</h2>
                <p>{questao.caseStudy.contexto}</p>
              </section>
            )}

            <div className="conteudoQuestao">
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
            </div>
          </ConteudoProtegido>

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
              onClick={() => navigate(origem)}
            >
                {origem === "/banco-questoes" ? "Voltar ao Banco de Questões" : "Voltar à Tela Principal"}
            </button>

            <button
              className="btnQuestoesRevisadas"
              onClick={() => navigate("/favoritas")}
              disabled={revisao.pendentes.length === 0}
            >
              Questões Revisadas
            </button>

            {(modoEstudo || fluxoRevisao) && (
              <button
                className="btnAnalise"
                onClick={exibirAnalise}
                disabled={correcaoEmAndamento || !respostasEstaoCompletas(respostas[questaoAtual], questao)}
              >
                Ver Resposta e Explicação
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

            <button
              className="btnFinalizar"
              onClick={finalizar}
              disabled={correcaoEmAndamento}
            >
              {fluxoRevisao ? "Voltar à Revisão" : modoEstudo ? "Finalizar Estudo" : "Finalizar Exame"}
            </button>

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

              if (revisao.pendentes.includes(questoes[numero - 1]?.id)) {
                classe += " revisao";
              }

              return (
                <button
                  key={numero}
                  className={classe}
                  disabled={estudoCaseStudy && numero > maiorQuestaoAcessada}
                  onClick={() => {
                    setQuestaoAtual(numero);
                  }}
                >
                  {numero}
                </button>
              );
            })}
          </div>
        </aside>
      </div>


    </div>
  );
}
