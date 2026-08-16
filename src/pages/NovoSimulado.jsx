import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./NovoSimulado.css";
import logo from "../assets/images/logo.png";

export default function NovoSimulado() {
  const navigate = useNavigate();

  const [quantidade, setQuantidade] = useState(180);
  const [dominio, setDominio] = useState("Todos");
  const [dificuldade, setDificuldade] = useState("Todas");
  const [modo, setModo] = useState("Exame");
  const [tipoResposta, setTipoResposta] = useState("Todos os tipos");
  const [abordagem, setAbordagem] = useState("Todas");
  const [areaConhecimento, setAreaConhecimento] = useState("Todas");
  const [modoTreinamento, setModoTreinamento] = useState("Todas as questões");
  const nomeUsuario = localStorage.getItem("usuario") || "Usuário";
  const inicialUsuario = nomeUsuario.trim().charAt(0).toUpperCase() || "U";

  function iniciarSimulado() {
    console.log({
      quantidade,
      dominio,
      dificuldade,
      modo,
      tipoResposta,
      abordagem,
      areaConhecimento,
      modoTreinamento,
    });

    navigate("/simulado");
  }

  return (
    <div className="novoSimuladoPage">
      <aside className="novoSimuladoSidebar">
        <div className="sidebarLogo">
          <img src={logo} alt="Pavel PMP Simulator" />
        </div>

        <nav className="sidebarNav">
          <button className="navItem active" type="button">
            <span className="navIcon">🎯</span>
            <span>Novo Simulado</span>
          </button>

          <button className="navItem" type="button" onClick={() => navigate("/simulados")}>
            <span className="navIcon">📊</span>
            <span>Simulados Realizados</span>
          </button>

          <button className="navItem" type="button" onClick={() => navigate("/desempenho")}>
            <span className="navIcon">📈</span>
            <span>Desempenho</span>
          </button>

          <button className="navItem" type="button" onClick={() => navigate("/favoritas")}>
            <span className="navIcon">⭐</span>
            <span>Favoritas</span>
          </button>

          <button className="navItem" type="button" onClick={() => navigate("/historico")}>
            <span className="navIcon">↩</span>
            <span>Histórico</span>
          </button>

          <div className="sidebarDivider" />

          <button className="navItem" type="button" onClick={() => navigate("/ajuda")}>
            <span className="navIcon">❓</span>
            <span>Ajuda</span>
          </button>

        </nav>

        <div className="sidebarPromo">
          <div className="promoIcon">♜</div>
          <strong>500 QUESTÕES</strong>
          <span>Autorais e sem repetição</span>
          <span>Alinhadas ao PMP 2026</span>
          <div className="promoStars">★ ★ ★ ★ ★</div>
        </div>
      </aside>

      <main className="novoSimuladoMain">
        <header className="novoSimuladoTopbar">
          <div className="novoSimuladoTitle">
            <h1>Novo Simulado</h1>
            <p>Configure o seu exame PMP® exatamente como desejar.</p>
          </div>

          <div className="novoSimuladoUser">
            <div>
              <strong>Olá, {nomeUsuario}!</strong>
              <span>Preparado para o sucesso?</span>
            </div>
            <div className="userAvatar">{inicialUsuario}</div>
          </div>
        </header>

        <section className="novoSimuladoCard">
          <div className="secaoCabecalho">
            <h2>Configuração do Simulado</h2>
            <p>Defina os critérios para o seu próximo exame.</p>
          </div>

          <div className="linha" />

          <div className="formulario">
            <div className="campo">
              <label htmlFor="quantidade">
                <span className="campoIcon">☷</span>
                Quantidade de Questões
              </label>

              <select
                id="quantidade"
                value={quantidade}
                onChange={(e) => setQuantidade(Number(e.target.value))}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={180}>180</option>
              </select>

              <small>
                Defina quantas questões deseja
                <br />
                no seu simulado.
              </small>
            </div>

            <div className="campo">
              <label htmlFor="dominio">
                <span className="campoIcon">▱</span>
                Domínio ECO
              </label>

              <select
                id="dominio"
                value={dominio}
                onChange={(e) => setDominio(e.target.value)}
              >
                <option>Todos</option>
                <option>People</option>
                <option>Process</option>
                <option>Business Environment</option>
              </select>

              <small className="dominioDistribuicao">
                <span>
                  People <strong>(33%)</strong>
                </span>
                <span>
                  Process <strong>(41%)</strong>
                </span>
                <span>
                  Business Environment <strong>(26%)</strong>
                </span>
              </small>
            </div>

            <div className="campo">
              <label htmlFor="dificuldade">
                <span className="campoIcon">▥</span>
                Dificuldade
              </label>

              <select
                id="dificuldade"
                value={dificuldade}
                onChange={(e) => setDificuldade(e.target.value)}
              >
                <option>Todas</option>
                <option>Fácil</option>
                <option>Moderada</option>
                <option>Difícil</option>
                <option>Muito Difícil</option>
              </select>

              <small>
                Fácil, Moderada, Difícil,
                <br />
                Muito Difícil.
              </small>
            </div>

            <div className="campo">
              <label htmlFor="modo">
                <span className="campoIcon">⌑</span>
                Modo
              </label>

              <select
                id="modo"
                value={modo}
                onChange={(e) => setModo(e.target.value)}
              >
                <option>Exame</option>
                <option>Estudo</option>
              </select>

              <small>
                Simulado com tempo e condições
                <br />
                semelhantes à prova.
              </small>
            </div>

            <div className="campo">
              <label htmlFor="tipoResposta">
                <span className="campoIcon">▣</span>
                Tipo de Resposta
              </label>

              <select
                id="tipoResposta"
                value={tipoResposta}
                onChange={(e) => setTipoResposta(e.target.value)}
              >
                <option>Todos os tipos</option>
                <option>Resposta única</option>
                <option>Multiple-response</option>
              </select>

              <small>
                Resposta única ou
                <br />
                múltipla (duas respostas).
              </small>
            </div>

            <div className="campo">
              <label htmlFor="abordagem">
                <span className="campoIcon">↝</span>
                Abordagem
              </label>

              <select
                id="abordagem"
                value={abordagem}
                onChange={(e) => setAbordagem(e.target.value)}
              >
                <option>Todas</option>
                <option>Preditiva</option>
                <option>Adaptativa</option>
                <option>Híbrida</option>
              </select>

              <small>
                Preditiva, Adaptativa
                <br />
                e Híbrida.
              </small>
            </div>

            <div className="campo">
              <label htmlFor="areaConhecimento">
                <span className="campoIcon">▢</span>
                Área de Conhecimento
              </label>

              <select
                id="areaConhecimento"
                value={areaConhecimento}
                onChange={(e) => setAreaConhecimento(e.target.value)}
              >
                <option>Todas</option>
                <option>Integração</option>
                <option>Escopo</option>
                <option>Cronograma</option>
                <option>Custos</option>
                <option>Qualidade</option>
                <option>Recursos</option>
                <option>Comunicações</option>
                <option>Riscos</option>
                <option>Aquisições</option>
                <option>Stakeholders</option>
              </select>

              <small>Selecione uma área de conhecimento.</small>
            </div>

            <div className="campo">
              <label htmlFor="modoTreinamento">
                <span className="campoIcon">♙</span>
                Modo de Treinamento
              </label>

              <select
                id="modoTreinamento"
                value={modoTreinamento}
                onChange={(e) => setModoTreinamento(e.target.value)}
              >
                <option>Todas as questões</option>
                <option>Apenas Erro</option>
                <option>Favoritas</option>
                <option>Revisão</option>
              </select>

              <small>
                Todas, Apenas Erro, Favoritas
                <br />
                ou Revisão.
              </small>
            </div>
          </div>

          <section className="resumo">
            <div className="resumoTitulo">
              <h2>Resumo do Simulado</h2>
              <p>Confira as configurações selecionadas antes de começar.</p>
            </div>

            <div className="cardsResumo">
              {[
                ["☷", "Questões", quantidade],
                ["▱", "Domínio ECO", dominio],
                ["▥", "Dificuldade", dificuldade],
                ["▣", "Tipo de Resposta", tipoResposta],
                ["↝", "Abordagem", abordagem],
                ["▢", "Área de Conhecimento", areaConhecimento],
                ["♙", "Modo", modo],
                ["♙", "Modo de Treinamento", modoTreinamento],
              ].map(([icon, label, value]) => (
                <div className="itemResumo" key={label}>
                  <span className="resumoIcon">{icon}</span>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </section>

          <div className="botoes">
            <button
              type="button"
              className="btnPrimario"
              onClick={iniciarSimulado}
            >
              🚀 &nbsp;Iniciar Simulado
            </button>

            <button
              type="button"
              className="btnSecundario"
              onClick={() => navigate("/")}
            >
              ↩ &nbsp;Voltar
            </button>
          </div>
        </section>

        <footer className="novoSimuladoFooter">
          <span>
            ⚒ &nbsp;Baseado no ECO PMP® 2026 e no PMBOK® Guide – 8ª Edição
          </span>
          <span>♧ &nbsp;500 questões autorais e sem repetição</span>
          <span>◈ &nbsp;Atualizações constantes conforme ECO 2026</span>
        </footer>
      </main>
    </div>
  );
}