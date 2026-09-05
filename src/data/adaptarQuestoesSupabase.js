function numeroValido(valor) {
  const numero = Number(valor);
  return Number.isFinite(numero) ? numero : null;
}

export function adaptarQuestoesSupabase(linhas = []) {
  const quantidadeRealPorCase = new Map();

  for (const linha of linhas) {
    if (!linha?.case_id) continue;

    quantidadeRealPorCase.set(
      linha.case_id,
      (quantidadeRealPorCase.get(linha.case_id) || 0) + 1
    );
  }

  return linhas.map((linha) => {
    const quantidadeRespostas = numeroValido(linha.quantidade_respostas);

    if (!Number.isInteger(quantidadeRespostas) || quantidadeRespostas < 1) {
      throw new Error(
        `A questão ${linha.id_questao ?? "sem ID"} possui quantidade de respostas inválida.`
      );
    }

    const alternativas = [
      { texto: linha.alternativa_a, letraOriginal: "A" },
      { texto: linha.alternativa_b, letraOriginal: "B" },
      { texto: linha.alternativa_c, letraOriginal: "C" },
      { texto: linha.alternativa_d, letraOriginal: "D" }
    ];

    for (let indice = alternativas.length - 1; indice > 0; indice -= 1) {
      const indiceAleatorio = Math.floor(Math.random() * (indice + 1));
      [alternativas[indice], alternativas[indiceAleatorio]] = [
        alternativas[indiceAleatorio],
        alternativas[indice]
      ];
    }

    const quantidadeInformada = numeroValido(linha.quantidade_questoes);
    const quantidadeReal = linha.case_id
      ? quantidadeRealPorCase.get(linha.case_id) || 0
      : null;

    const quantidadeQuestoes = linha.case_id
      ? (
          Number.isInteger(quantidadeInformada) &&
          quantidadeInformada > 0 &&
          quantidadeInformada === quantidadeReal
            ? quantidadeInformada
            : quantidadeReal
        )
      : null;

    return {
      id: linha.id_questao,
      enunciado: linha.enunciado,
      alternativas: alternativas.map(({ texto }) => texto),
      letrasOriginais: alternativas.map(({ letraOriginal }) => letraOriginal),
      quantidadeRespostas,
      tipoResposta: linha.tipo_resposta,
      instrucao: linha.instrucao,
      dominio: linha.dominio_eco,
      dificuldade: linha.dificuldade,
      areaConhecimento: linha.area_conhecimento,
      grupoProcesso: linha.grupo_processo,
      tema: linha.tema,
      abordagem: linha.abordagem,
      palavrasChave: linha.palavra_chave,
      tempoQuestao: linha.tempo_questao,
      caseStudy: linha.case_id
        ? {
            id: linha.case_id,
            contexto: linha.contexto,
            quantidadeQuestoes,
            ordemNoCase: numeroValido(linha.ordem_no_case)
          }
        : null
    };
  });
}
