import "./AcessoBloqueado.css";

export default function AcessoBloqueado({ mensagem }) {
  return (
    <main className="acessoBloqueadoPage">
      <section className="acessoBloqueadoCard" aria-labelledby="acesso-bloqueado-titulo">
        <h2 className="acessoBloqueadoInstitucional">Pavel Consultoria</h2>

        <h1 id="acesso-bloqueado-titulo">Acesso bloqueado</h1>

        <p className="acessoBloqueadoMensagem" role="alert">
          {mensagem}
        </p>

        <p className="acessoBloqueadoRodape">© 2026 Pavel Consultoria</p>
      </section>
    </main>
  );
}
