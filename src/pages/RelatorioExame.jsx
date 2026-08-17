import { Navigate, useLocation, useNavigate } from "react-router-dom";
import "./AnaliseRespostas.css";
const dominios = ["People", "Process", "Business Environment"];
export default function RelatorioExame() {
  const navigate = useNavigate(); const { resultado } = useLocation().state || {};
  if (!resultado) return <Navigate to="/dashboard" replace />;
  const aprovado = resultado.percentual >= 60;
  return <div className="analisePage"><header className="headerAnalise"><h1>RELATÓRIO DO EXAME</h1></header><main className="analiseCard"><section className="analiseResultado"><div><span>Resultado geral</span><strong>{resultado.percentual}%</strong></div><p className={aprovado ? "statusResposta correta" : "statusResposta incorreta"}>{aprovado ? "PASSED" : "NOT PASSED"}</p></section><section className="analiseSecao"><h2>Desempenho por domínio ECO</h2><div className="classificacaoGrid">{dominios.map((dominio) => <div key={dominio}><span>{dominio}</span><strong>{resultado.porDominio[dominio]}%</strong></div>)}</div></section><footer className="acoesAnalise"><button className="btnProxima" type="button" onClick={() => navigate("/dashboard")}>Voltar à Tela Principal</button></footer></main></div>;
}
