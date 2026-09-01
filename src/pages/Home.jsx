import PavelLayout from "../components/PavelLayout";
import { calcularResumo, carregarSessoes, dominioPrioritario, DOMINIOS_ECO, formatarDuracao } from "../data/progresso";

const Dominios = ({ resumo }) => <div className="domainList">{DOMINIOS_ECO.map(({ chave, nome }) => { const valor = resumo.dominios[chave].percentual; return <div className="domainRow" key={chave}><span>{nome}</span><div className="track"><div className="fill" style={{ width: `${valor || 0}%` }} /></div><strong>{valor === null ? "--" : `${valor}%`}</strong></div>; })}</div>;

export default function Home() {
  const usuario = localStorage.getItem("usuario") || "Usuário", resumo = calcularResumo(carregarSessoes()), foco = dominioPrioritario(resumo), ultima = resumo.ultimaSessao;
  return <PavelLayout titulo="Visão geral" subtitulo="Seu progresso na preparação para a certificação PMP®.">
    <section className="welcome"><h2>Olá, <strong>{usuario}</strong>.</h2><p className="muted">Você está aqui. Este é seu desempenho. E é nisso que deveria estudar agora.</p></section>
    <section className="metricGrid"><article className="metricCard"><span>Questões respondidas</span><strong>{resumo.questoes}</strong></article><article className="metricCard"><span>Taxa de acerto</span><strong>{resumo.percentual === null ? "--" : `${resumo.percentual}%`}</strong></article><article className="metricCard"><span>Simulados / estudos</span><strong>{resumo.sessoes}</strong></article><article className="metricCard"><span>Tempo de estudo</span><strong>{formatarDuracao(resumo.tempoSegundos)}</strong></article></section>
    <section className="dashboardGrid"><article className="surface"><h2>Desempenho por Domínio ECO</h2><Dominios resumo={resumo} /></article><article className="surface"><h2>Último simulado / estudo</h2>{ultima ? <div className="detailList"><div><span>Data</span><strong>{new Date(ultima.data).toLocaleDateString("pt-BR")}</strong></div><div><span>Modo</span><strong>{ultima.modo}</strong></div><div><span>Questões</span><strong>{ultima.questoes}</strong></div><div><span>Resultado</span><strong className="green">{ultima.percentual}%</strong></div></div> : <p className="muted">Nenhuma sessão concluída ainda.</p>}</article></section>
    <article className="surface focusCard"><h2>Foco recomendado para você</h2>{foco ? <p>Seu menor desempenho atual está em <strong className="green">{foco.nome}</strong>, com {foco.percentual}% de acerto. Priorize questões desse domínio na próxima sessão.</p> : <p>Conclua seu primeiro simulado ou estudo para receber uma recomendação baseada no seu desempenho real.</p>}</article>
  </PavelLayout>;
}
