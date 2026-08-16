import "./SobrePavel.css";

export default function SobrePavel() {
  return (
    <main className="sobrePavelPage">
      <div className="sobrePavelHeader">
        <h1>Sobre a Pavel</h1>
        <p>Consultoria, Engenharia, Planejamento e Gestão de Projetos</p>
      </div>

      <section className="sobrePavelCard">

        <div className="sobrePavelTitle">
          <h2>
            Pavel Poznyakov Consultoria e Projetos de Engenharia Ltda. – ME
          </h2>

          <p>
            Desde 2005, atuando em Engenharia, Planejamento e Gestão de Projetos.
          </p>
        </div>

        <div className="sobrePavelLine"></div>

        <section className="sobrePavelSection">
          <h3>Sobre a empresa</h3>

          <p>
            A <strong>Pavel Consultoria</strong>, liderada por{" "}
            <strong>Karolina Poznyakov (MSc, PMP retired, IPMA-D)</strong>,
            é uma empresa do Rio de Janeiro especializada em treinamentos
            de planejamento e controle de projetos, com foco em{" "}
            <strong>MS Project</strong> e{" "}
            <strong>Oracle Primavera P6</strong>.
          </p>

          <p>
            A empresa oferece treinamentos práticos voltados à aplicação
            profissional de ferramentas de planejamento, estruturação de
            cronogramas, análise de caminho crítico, nivelamento de recursos
            e elaboração de relatórios gerenciais.
          </p>
        </section>

        <div className="sobrePavelGrid">

          <article>
            <h3>Consultoria e Treinamentos</h3>
            <p>
              Cursos especializados em planejamento e controle de projetos,
              com aplicação prática em cronogramas profissionais.
            </p>
          </article>

          <article>
            <h3>MS Project</h3>
            <p>
              Treinamento do básico ao avançado, com foco na aplicação
              prática em cronogramas de projetos.
            </p>
          </article>

          <article>
            <h3>Oracle Primavera P6</h3>
            <p>
              Treinamento focado na utilização profissional do Primavera P6
              para planejamento e controle de projetos.
            </p>
          </article>

          <article>
            <h3>Formato</h3>
            <p>
              Turmas online e ao vivo, com grupos reduzidos de 1 a 6
              participantes, permitindo acompanhamento próximo e
              atendimento personalizado.
            </p>
          </article>

        </div>

        <section className="sobrePavelSection">
          <h3>Experiência profissional</h3>

          <div className="sobrePavelProfissional">
            <strong>Karolina Poznyakov</strong>
            <span>MSc • PMP retired • IPMA-D</span>
          </div>

          <p>
            Profissional com experiência em planejamento, controle e gestão
            de projetos, atuando também como instrutora e consultora.
          </p>
        </section>

        <section className="sobrePavelDados">
          <h3>Dados da empresa</h3>

          <div className="sobrePavelDadosGrid">

            <div>
              <span>CNPJ</span>
              <strong>07.721.501/0001-06</strong>
            </div>

            <div>
              <span>Fundação</span>
              <strong>21 de novembro de 2005</strong>
            </div>

            <div>
              <span>Localização</span>
              <strong>Rio de Janeiro – RJ</strong>
            </div>

            <div>
              <span>Atividade</span>
              <strong>Serviços de engenharia</strong>
            </div>

          </div>
        </section>

        <section className="sobrePavelContato">
          <h3>Contato</h3>
          <p>
            WhatsApp: <strong>(21) 99571-6270</strong>
          </p>
        </section>

      </section>

      <footer className="sobrePavelFooter">
        Pavel Consultoria • Engenharia • Planejamento • Gestão de Projetos
      </footer>
    </main>
  );
}