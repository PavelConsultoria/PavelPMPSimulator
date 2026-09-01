import PavelLayout from "../components/PavelLayout";
import { calcularResumo, carregarSessoes, DOMINIOS_ECO, formatarDuracao } from "../data/progresso";

export default function Estatisticas() {
  const sessoes = carregarSessoes(), resumo = calcularResumo(sessoes);
  return <PavelLayout titulo="Estatísticas" subtitulo="Evolução acumulada da sua preparação.">
    <section className="metricGrid"><article className="metricCard"><span>Questões respondidas</span><strong>{resumo.questoes}</strong></article><article className="metricCard"><span>Taxa média de acerto</span><strong>{resumo.percentual === null ? "--" : `${resumo.percentual}%`}</strong></article><article className="metricCard"><span>Sessões realizadas</span><strong>{resumo.sessoes}</strong></article><article className="metricCard"><span>Tempo total de estudo</span><strong>{formatarDuracao(resumo.tempoSegundos)}</strong></article></section>
    {sessoes.length ? <section className="dashboardGrid"><article className="surface"><span className="filterStub">Filtros por período · em breve</span><h2>Evolução da taxa de acerto</h2><div className="chart">{sessoes.map((item, i) => <div className="chartBar" key={item.id} style={{ height: `${Math.max(3, item.percentual)}%` }} title={`${item.percentual}%`}><span>{i + 1}</span></div>)}</div></article><article className="surface"><h2>Evolução por domínio ECO</h2><div className="domainList">{DOMINIOS_ECO.map(({ chave, nome }) => { const v = resumo.dominios[chave].percentual; return <div className="domainRow" key={chave}><span>{nome}</span><div className="track"><div className="fill" style={{ width: `${v || 0}%` }} /></div><strong>{v === null ? "--" : `${v}%`}</strong></div>; })}</div></article></section> : <section className="surface emptyState"><div className="emptyIcon">▥</div><h2>A evolução aparecerá aqui</h2><p>Ainda não há dados acumulados. Seus gráficos serão construídos somente com resultados reais de sessões concluídas.</p></section>}
  </PavelLayout>;
}
