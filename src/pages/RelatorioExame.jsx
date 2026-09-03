import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { carregarSessoes, DOMINIOS_ECO, formatarDuracao } from "../data/progresso";
import { carregarQuestoesExcel } from "../data/carregarQuestoesExcel";
import "./AnaliseRespostas.css";

const letras = (indices = []) => indices.map((indice) => String.fromCharCode(65 + indice)).join(" e ") || "Não respondida";
export default function RelatorioExame() {
  const navigate = useNavigate();
  const location = useLocation();
  const resultado = location.state?.resultado;
  const idSessao = new URLSearchParams(location.search).get("sessao");
  const sessao = idSessao ? carregarSessoes().find((item) => String(item.id) === idSessao) : null;
  const [questoesPorId, setQuestoesPorId] = useState(new Map());
  useEffect(() => {
    if (!sessao?.detalhes?.length) return;
    let ativo = true;
    carregarQuestoesExcel().then((questoes) => {
      if (ativo) setQuestoesPorId(new Map(questoes.map((questao) => [questao.id, questao])));
    }).catch(() => {});
    return () => { ativo = false; };
  }, [idSessao, sessao?.detalhes?.length]);
  if (!resultado && !sessao) return <Navigate to="/dashboard" replace />;
  const percentual = sessao?.percentual ?? resultado.percentual;
  const porDominio = sessao?.porDominio ?? resultado.porDominio;

  return <div className="analisePage reportPrintPage"><header className="headerAnalise"><h1>RELATÓRIO DA SESSÃO</h1></header><main className="analiseCard">
    <section className="analiseResultado reportSummary"><div><span>Resultado geral</span><strong>{percentual}%</strong></div>{sessao && <><div><span>Modo</span><strong>{sessao.modo}</strong></div><div><span>Data</span><strong>{new Date(sessao.data).toLocaleString("pt-BR")}</strong></div><div><span>Questões / respondidas</span><strong>{sessao.questoes} / {sessao.respondidas ?? sessao.questoes}</strong></div><div><span>Acertos</span><strong>{sessao.acertos}</strong></div><div><span>Duração</span><strong>{formatarDuracao(sessao.tempoSegundos)}</strong></div></>}</section>
    <section className="analiseSecao reportDomains"><h2>Desempenho por domínio ECO</h2><div className="classificacaoGrid">{DOMINIOS_ECO.map(({ chave, nome }) => { const valor = porDominio?.[chave]; const exibido = typeof valor === "object" ? (valor.questoes ? Math.round((valor.acertos / valor.questoes) * 100) : "--") : valor; return <div key={chave}><span>{nome}</span><strong>{exibido === "--" || exibido === undefined ? "--" : `${exibido}%`}</strong></div>; })}</div></section>
    {sessao?.detalhes?.length ? <section className="analiseSecao reportDetails"><h2>Respostas registradas</h2><table className="reportTable"><thead><tr><th>Questão</th><th>Domínio ECO</th><th>Resposta</th><th>Resposta correta</th><th>Resultado</th></tr></thead><tbody>{sessao.detalhes.map((item, indice) => { const questao = questoesPorId.get(item.id); return <tr key={`${item.id}-${indice}`}><td data-label="Questão">{item.id}</td><td data-label="Domínio ECO">{questao?.dominio || "--"}</td><td data-label="Sua resposta">{letras(item.resposta)}</td><td data-label="Resposta correta">{questao ? letras(questao.corretas) : "--"}</td><td data-label="Resultado" className={item.acertou ? "reportCorrect" : "reportIncorrect"}>{item.acertou ? "Correta" : "Incorreta"}</td></tr>; })}</tbody></table></section> : sessao && <p className="muted legacyReportNote">Esta sessão antiga não possui respostas por questão armazenadas. Somente os dados reais disponíveis são exibidos.</p>}
    <footer className="acoesAnalise reportActions"><button className="btnAnterior" type="button" onClick={() => navigate("/relatorios")}>Voltar aos Relatórios</button><button className="btnProxima" type="button" onClick={() => window.print()}>Imprimir</button></footer>
  </main></div>;
}
