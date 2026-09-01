export const CHAVE_SESSOES = "pavelPmpSessoes";

export const DOMINIOS_ECO = [
  { chave: "People", nome: "Pessoas" },
  { chave: "Process", nome: "Processos" },
  { chave: "Business Environment", nome: "Ambiente de Negócios" },
];

export function carregarSessoes() {
  try {
    const valor = JSON.parse(localStorage.getItem(CHAVE_SESSOES) || "[]");
    return Array.isArray(valor) ? valor.filter((item) => item && item.id) : [];
  } catch {
    return [];
  }
}

export function salvarSessao(sessao) {
  const sessoes = carregarSessoes();
  localStorage.setItem(CHAVE_SESSOES, JSON.stringify([...sessoes, sessao]));
}

export function calcularResumo(sessoes = carregarSessoes()) {
  const questoes = sessoes.reduce((total, item) => total + (Number(item.respondidas ?? item.questoes) || 0), 0);
  const acertos = sessoes.reduce((total, item) => total + (Number(item.acertos) || 0), 0);
  const tempoSegundos = sessoes.reduce((total, item) => total + (Number(item.tempoSegundos) || 0), 0);
  const dominios = Object.fromEntries(DOMINIOS_ECO.map(({ chave }) => {
    const totais = sessoes.reduce((acc, item) => {
      const dominio = item.porDominio?.[chave];
      acc.questoes += Number(dominio?.questoes) || 0;
      acc.acertos += Number(dominio?.acertos) || 0;
      return acc;
    }, { questoes: 0, acertos: 0 });
    return [chave, { ...totais, percentual: totais.questoes ? Math.round((totais.acertos / totais.questoes) * 100) : null }];
  }));

  return {
    sessoes: sessoes.length,
    questoes,
    acertos,
    erros: Math.max(0, questoes - acertos),
    percentual: questoes ? Math.round((acertos / questoes) * 100) : null,
    tempoSegundos,
    dominios,
    ultimaSessao: sessoes.at(-1) || null,
  };
}

export function formatarDuracao(segundos) {
  if (!segundos) return "--";
  const horas = Math.floor(segundos / 3600);
  const minutos = Math.floor((segundos % 3600) / 60);
  return horas ? `${horas}h ${String(minutos).padStart(2, "0")}min` : `${minutos} min`;
}

export function dominioPrioritario(resumo) {
  return DOMINIOS_ECO
    .map((dominio) => ({ ...dominio, ...resumo.dominios[dominio.chave] }))
    .filter((dominio) => dominio.percentual !== null)
    .sort((a, b) => a.percentual - b.percentual)[0] || null;
}
