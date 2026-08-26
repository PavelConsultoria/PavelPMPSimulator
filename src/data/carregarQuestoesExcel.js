import * as XLSX from "xlsx";
import arquivoBDPmpUrl from "../public/dados/BD PMP.xlsx?url";

const INDICE_POR_ALTERNATIVA = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
};

function normalizarRespostasCorretas(respostaCorreta) {
  const letras = String(respostaCorreta || "").match(/[A-D]/g) || [];

  return letras.map((letra) => INDICE_POR_ALTERNATIVA[letra]);
}

function validarQuestao(linha) {
  const camposObrigatorios = [
    "IDQuestão",
    "Enunciado",
    "AlternativaA",
    "AlternativaB",
    "AlternativaC",
    "AlternativaD",
    "RespostaCorreta",
    "TipoResposta",
  ];

  const campoAusente = camposObrigatorios.find(
    (campo) => linha[campo] === undefined || linha[campo] === null || linha[campo] === ""
  );

  if (campoAusente) {
    throw new Error(`A questão ${linha.IDQuestão || "sem ID"} não possui o campo ${campoAusente}.`);
  }

  const corretas = normalizarRespostasCorretas(linha.RespostaCorreta);
  const quantidadeEsperada = linha.TipoResposta === "Multiple Response" ? 2 : 1;

  if (corretas.length !== quantidadeEsperada) {
    throw new Error(`A questão ${linha.IDQuestão} possui respostas corretas inválidas.`);
  }
}

function extrairIdCase(enunciado) {
  return String(enunciado || "").match(/^CASE STUDY\s+(CS\d+)\s+—/i)?.[1] || null;
}

function converterQuestao(linha, casesPorId) {
  validarQuestao(linha);

  const caseId = extrairIdCase(linha.Enunciado);
  const caseStudy = caseId ? casesPorId.get(caseId) : null;

  if (caseId && !caseStudy) {
    throw new Error(`A questão ${linha.IDQuestão} referencia o Case Study ${caseId}, mas o contexto não foi encontrado.`);
  }

  const enunciado = caseStudy
    ? String(linha.Enunciado).replace(/^CASE STUDY\s+CS\d+\s+—[^\r\n]*(?:\r?\n){2}Contexto:\s*[\s\S]*?(?:\r?\n){2}(?=Situação:)/i, "")
    : linha.Enunciado;

  return {
    id: linha.IDQuestão,
    enunciado,
    alternativas: [
      linha.AlternativaA,
      linha.AlternativaB,
      linha.AlternativaC,
      linha.AlternativaD,
    ],
    corretas: normalizarRespostasCorretas(linha.RespostaCorreta),
    tipoResposta: linha.TipoResposta,
    instrucao: linha.Instrução,
    explicacao: linha.Explicação,
    justificativas: [
      linha.JustificativaA,
      linha.JustificativaB,
      linha.JustificativaC,
      linha.JustificativaD,
    ],
    dominio: linha.IDDominioECO,
    dificuldade: linha.Dificuldade,
    areaConhecimento: linha.AreadeConhecimento,
    grupoProcesso: linha["Grupo de processo"],
    tema: linha.Tema,
    abordagem: linha.Abordagem,
    fonte: linha.Fonte,
    comoPMIPensa: linha.ComoPMIPensa,
    status: linha.Status,
    pegadinha: linha.Pegadinha,
    palavrasChave: linha["Palavra chave"],
    tempoQuestao: linha["Tempo de questão"],
    caseStudy,
  };
}

function carregarCases(planilha) {
  const nomeAbaCases = planilha.SheetNames.find((nome) => nome.startsWith("Estudos de Caso"));
  const abaCases = planilha.Sheets[nomeAbaCases];

  if (!abaCases) {
    throw new Error("A aba Estudos de Caso não foi encontrada no banco de dados.");
  }

  const cases = XLSX.utils.sheet_to_json(abaCases, { defval: null });
  return new Map(cases.map((caseStudy) => [caseStudy.IDCase, {
    id: caseStudy.IDCase,
    contexto: caseStudy.Contexto,
    quantidadeQuestoes: caseStudy["Quantidade de Questões"],
  }]));
}

export async function carregarQuestoesExcel() {
  const resposta = await fetch(arquivoBDPmpUrl);

  if (!resposta.ok) {
    throw new Error("Não foi possível carregar o banco de questões.");
  }

  const arquivo = await resposta.arrayBuffer();
  const planilha = XLSX.read(arquivo, { type: "array" });
  const abaQuestoes = planilha.Sheets.Questões;

  if (!abaQuestoes) {
    throw new Error("A aba Questões não foi encontrada no banco de dados.");
  }

  const linhas = XLSX.utils.sheet_to_json(abaQuestoes, { defval: null });
  const casesPorId = carregarCases(planilha);

  return linhas.map((linha) => converterQuestao(linha, casesPorId));
}

export function agruparCaseStudies(questoes) {
  const grupos = new Map();

  questoes.forEach((questao) => {
    if (!questao.caseStudy) return;

    const grupo = grupos.get(questao.caseStudy.id) || { ...questao.caseStudy, questoes: [] };
    grupo.questoes.push(questao);
    grupos.set(questao.caseStudy.id, grupo);
  });

  grupos.forEach((grupo) => {
    if (grupo.questoes.length !== grupo.quantidadeQuestoes) {
      throw new Error(`O Case Study ${grupo.id} possui ${grupo.questoes.length} questões; eram esperadas ${grupo.quantidadeQuestoes}.`);
    }
  });

  return [...grupos.values()];
}

export const agruparEstudosDeCaso = agruparCaseStudies;

export function embaralharQuestoes(questoes) {
  const questoesEmbaralhadas = [...questoes];

  for (let indice = questoesEmbaralhadas.length - 1; indice > 0; indice -= 1) {
    const indiceAleatorio = Math.floor(Math.random() * (indice + 1));
    [questoesEmbaralhadas[indice], questoesEmbaralhadas[indiceAleatorio]] = [
      questoesEmbaralhadas[indiceAleatorio],
      questoesEmbaralhadas[indice],
    ];
  }

  return questoesEmbaralhadas;
}
