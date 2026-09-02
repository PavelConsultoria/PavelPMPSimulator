import { useNavigate } from "react-router-dom";
import PavelLayout from "../components/PavelLayout";
import { carregarSessoes } from "../data/progresso";

export default function Relatorios() {
  const navigate = useNavigate();
  const sessoes = carregarSessoes().slice().reverse();
  return <PavelLayout titulo="Relatórios" subtitulo="Histórico dos simulados e estudos concluídos.">
    {sessoes.length ? <section className="surface reportWrap"><table className="reportTable"><thead><tr><th>Data</th><th>Tipo / Modo</th><th>Questões</th><th>Acertos</th><th>Resultado</th><th>Ação</th></tr></thead><tbody>{sessoes.map((sessao) => <tr key={sessao.id}><td>{new Date(sessao.data).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}</td><td>{sessao.modo}</td><td>{sessao.questoes}</td><td>{sessao.acertos}</td><td><strong className="green">{sessao.percentual}%</strong></td><td><button type="button" className="reportAction" onClick={() => navigate(`/relatorio-exame?sessao=${encodeURIComponent(sessao.id)}`)}>Ver Relatório</button></td></tr>)}</tbody></table></section> : <section className="surface emptyState"><div className="emptyIcon">▧</div><h2>Nenhum simulado ou estudo concluído ainda.</h2><p>Quando você finalizar uma sessão, o resultado real aparecerá aqui com data, modo, quantidade de questões e aproveitamento.</p></section>}
  </PavelLayout>;
}
