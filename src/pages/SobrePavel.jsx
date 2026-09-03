import PavelLayout from "../components/PavelLayout";
import karolinaPavel from "../assets/images/karolina_pavel.png";
import "./SobrePavel.css";

export default function SobrePavel() {
  return (
    <PavelLayout titulo="Sobre a Pavel" subtitulo="Consultoria, Engenharia, Planejamento e Gestão de Projetos">
      <section className="sobrePavelCard">
        <div className="sobrePavelApresentacao">
          <div className="sobrePavelImagem"><img src={karolinaPavel} alt="Karolina Poznyakov, Pavel Consultoria" /></div>
          <div className="sobrePavelTitle">
            <h2>Pavel Poznyakov Consultoria e Projetos de Engenharia Ltda. – ME</h2>
            <p className="sobrePavelDesde">Desde 2005, atuando em Engenharia, Planejamento e Gestão de Projetos.</p>
            <p>A Pavel Consultoria oferece treinamentos práticos para profissionais que buscam aplicar planejamento e controle de projetos no dia a dia.</p>
          </div>
        </div>

        <div className="sobrePavelDestaques">
          <section className="sobrePavelSection">
            <h3>Sobre a empresa</h3>
            <p>A Pavel Consultoria é especializada em treinamentos de planejamento e controle de projetos, com aplicação prática em MS Project e Oracle Primavera P6.</p>
          </section>
          <section className="sobrePavelSection">
            <h3>Experiência profissional</h3>
            <div className="sobrePavelProfissional"><strong>Karolina Poznyakov</strong><span>MSc • PMP retired • IPMA-D</span></div>
            <p>Profissional com experiência em planejamento, controle e gestão de projetos, atuando também como instrutora e consultora.</p>
          </section>
        </div>

        <section className="sobrePavelServicos">
          <h3>Serviços</h3>
          <div className="sobrePavelGrid">
            <article><h4>Consultoria e Treinamentos</h4><p>Planejamento e controle de projetos.</p></article>
            <article><h4>MS Project</h4><p>Treinamentos do básico ao avançado.</p></article>
            <article><h4>Oracle Primavera P6</h4><p>Treinamentos com aplicação profissional.</p></article>
          </div>
        </section>

        <section className="sobrePavelDados">
          <h3>Dados da empresa</h3>
          <div className="sobrePavelDadosGrid">
            <div><span>CNPJ</span><strong>07.721.501/0001-06</strong></div>
            <div><span>Fundação</span><strong>21 de novembro de 2005</strong></div>
            <div><span>Localização</span><strong>Rio de Janeiro – RJ</strong></div>
            <div><span>Atividade</span><strong>Serviços de engenharia</strong></div>
          </div>
          <p className="sobrePavelContato">WhatsApp: <strong>(21) 99571-6270</strong></p>
        </section>
      </section>
      <footer className="sobrePavelFooter">Pavel Consultoria • Engenharia • Planejamento • Gestão de Projetos</footer>
    </PavelLayout>
  );
}
