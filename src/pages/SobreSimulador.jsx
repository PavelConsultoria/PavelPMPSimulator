import PavelLayout from "../components/PavelLayout";
import "./SobreSimulador.css";

const conteudoPlataforma = [
  "600 questões no banco atual",
  "500 questões regulares",
  "100 questões contextualizadas em 20 Case Studies",
  "5 questões vinculadas a cada Case Study",
  "Questões Single Response e Multiple Response",
  "Modos Estudo, Exame e Revisão",
  "Filtros por Domínio ECO, dificuldade, abordagem, tipo de resposta e área de conhecimento",
];

const referencias = ["PMP® 2026", "ECO vigente", "PMBOK® Guide – 8ª edição"];

export default function SobreSimulador() {
  return (
    <PavelLayout
      titulo="Sobre o Pavel PMP Simulator"
      subtitulo="Conheça a estrutura e as referências da plataforma."
    >
      <section className="sobreSimuladorCard">
        <p className="sobreSimuladorIntroducao">
          Plataforma de preparação para o exame PMP®, desenvolvida pela Pavel Consultoria,
          com foco em prática, diagnóstico e evolução do aluno.
        </p>

        <div className="sobreSimuladorGrid">
          <section className="sobreSimuladorSecao">
            <h2>Conteúdo da plataforma</h2>
            <ul>
              {conteudoPlataforma.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>

          <section className="sobreSimuladorSecao">
            <h2>Referências</h2>
            <ul>
              {referencias.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>
        </div>

        <p className="sobreSimuladorObservacao">
          As faixas de desempenho utilizadas pelo Pavel PMP Simulator são referências
          pedagógicas internas e não representam percentual oficial de aprovação definido pelo PMI.
        </p>
      </section>
    </PavelLayout>
  );
}
