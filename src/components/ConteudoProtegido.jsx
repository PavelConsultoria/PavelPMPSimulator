import "./ConteudoProtegido.css";

const impedirEvento = (evento) => evento.preventDefault();

function impedirAtalho(evento) {
  if (!(evento.ctrlKey || evento.metaKey)) return;

  if (["a", "c", "x"].includes(evento.key.toLowerCase())) {
    evento.preventDefault();
  }
}

function prepararInteracao(evento) {
  if (!evento.target.closest("button, summary, input, select, textarea, a")) {
    evento.currentTarget.focus({ preventScroll: true });
  }
}

export default function ConteudoProtegido({ children, className = "" }) {
  const usuario = localStorage.getItem("usuario")?.trim();
  const marca = `Pavel PMP Simulator • Uso individual${usuario ? ` • ${usuario}` : ""}`;

  return (
    <div
      className={`conteudoProtegido ${className}`.trim()}
      data-watermark={marca}
      onCopy={impedirEvento}
      onCut={impedirEvento}
      onDragStart={impedirEvento}
      onContextMenu={impedirEvento}
      onKeyDown={impedirAtalho}
      onPointerDown={prepararInteracao}
      tabIndex={0}
    >
      {children}
    </div>
  );
}
