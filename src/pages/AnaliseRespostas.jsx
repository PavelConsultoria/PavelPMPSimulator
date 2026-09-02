import "./AnaliseRespostas.css";

const disponivel = (valor) => valor !== undefined && valor !== null && String(valor).trim() !== "";

export default function AnaliseRespostas({ questao, respostaAluno, numero, total, onVoltar, onProxima }) {
  const letrasAluno = (respostaAluno || []).map((indice) => String.fromCharCode(65 + indice));
  const letrasCorretas = questao.corretas.map((indice) => String.fromCharCode(65 + indice));
  const acertou = letrasAluno.length === letrasCorretas.length && letrasAluno.every((letra) => letrasCorretas.includes(letra));
  const classificacoes = [["Área de Conhecimento", questao.areaConhecimento], ["Domínio ECO", questao.dominio], ["Grau de Dificuldade", questao.dificuldade], ["Abordagem", questao.abordagem]].filter(([, valor]) => disponivel(valor));

  return <div className="analisePage">
    <header className="headerAnalise"><div><h1>ANÁLISE DAS RESPOSTAS</h1><span>Questão {numero} de {total}</span></div></header>
    <main className="analiseCard">
      <section className="analiseResultado">
        <div><span>Sua resposta</span><strong>{letrasAluno.join(" e ")}</strong></div>
        <div><span>Resposta correta</span><strong>{letrasCorretas.join(" e ")}</strong></div>
        <p className={acertou ? "statusResposta correta" : "statusResposta incorreta"}>{acertou ? "CORRETA" : "INCORRETA"}</p>
      </section>
      <section className="analiseSecao"><h2>Justificativa das respostas</h2><div className="justificativas">
        {questao.alternativas.map((alternativa, indice) => {
          const justificativa = questao.justificativas?.[indice];
          if (!disponivel(justificativa)) return null;
          const correta = questao.corretas.includes(indice);
          return <article className="justificativa" key={indice}><h3 className={correta ? "correta" : "incorreta"}>{String.fromCharCode(65 + indice)} — {correta ? "CORRETA" : "INCORRETA"}</h3><p>{justificativa}</p></article>;
        })}
      </div></section>
      {disponivel(questao.explicacao) && <section className="analiseSecao destaqueAnalise"><h2>Explicação</h2><p>{questao.explicacao}</p></section>}
      {disponivel(questao.comoPMIPensa) && <section className="analiseSecao destaqueAnalise"><h2>Como pensa o PMI</h2><p>{questao.comoPMIPensa}</p></section>}
      {disponivel(questao.pegadinha) && <section className="analiseSecao destaqueAnalise pegadinhaAnalise"><h2>Pegadinha</h2><p>{questao.pegadinha}</p></section>}
      {classificacoes.length > 0 && <section className="analiseSecao"><h2>Classificação da questão</h2><div className="classificacaoGrid">{classificacoes.map(([rotulo, valor]) => <div key={rotulo}><span>{rotulo}</span><strong>{valor}</strong></div>)}</div></section>}
      <footer className="acoesAnalise"><button className="btnAnterior" type="button" onClick={onVoltar}>◀ Voltar para a questão</button>{numero < total && <button className="btnProxima" type="button" onClick={onProxima}>Próxima questão ▶</button>}</footer>
    </main>
  </div>;
}
