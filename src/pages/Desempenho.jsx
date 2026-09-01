import PavelLayout from "../components/PavelLayout";
import { calcularResumo, carregarSessoes, dominioPrioritario, DOMINIOS_ECO } from "../data/progresso";

const classificar = (v) => v === null ? "Sem dados" : v >= 80 ? "Excelente" : v >= 70 ? "Bom" : v >= 60 ? "Em desenvolvimento" : "Precisa de atenção";
export default function Desempenho() {
  const resumo = calcularResumo(carregarSessoes()), foco = dominioPrioritario(resumo);
  return <PavelLayout titulo="Desempenho" subtitulo="Diagnóstico atual com base nas sessões que você concluiu.">
    <section className="metricGrid"><article className="metricCard"><span>Taxa geral de acerto</span><strong>{resumo.percentual === null ? "--" : `${resumo.percentual}%`}</strong></article><article className="metricCard"><span>Questões respondidas</span><strong>{resumo.questoes}</strong></article><article className="metricCard"><span>Acertos</span><strong>{resumo.acertos}</strong></article><article className="metricCard"><span>Erros</span><strong>{resumo.erros}</strong></article></section>
    {resumo.questoes ? <section className="dashboardGrid"><article className="surface"><h2>Desempenho por Domínio ECO</h2><div className="domainList">{DOMINIOS_ECO.map(({ chave, nome }) => { const v = resumo.dominios[chave].percentual; return <div className="domainRow" key={chave}><span>{nome}</span><div className="track"><div className="fill" style={{ width: `${v || 0}%` }} /></div><strong>{v === null ? "--" : `${v}%`}</strong></div>; })}</div></article><article className="surface"><h2>Diagnóstico</h2><div className="detailList"><div><span>Classificação geral</span><strong className="classification">{classificar(resumo.percentual)}</strong></div><div><span>Domínio para atenção</span><strong className="green">{foco?.nome || "--"}</strong></div><div><span>Desempenho no domínio</span><strong>{foco ? `${foco.percentual}%` : "--"}</strong></div></div></article></section> : <section className="surface emptyState"><div className="emptyIcon">↗</div><h2>Seu diagnóstico começará após a primeira sessão</h2><p>Conclua um simulado ou estudo para visualizar acertos, erros, classificação e desempenho por domínio ECO.</p></section>}
  </PavelLayout>;
}
