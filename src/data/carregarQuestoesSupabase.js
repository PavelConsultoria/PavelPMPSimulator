import { supabase } from "../lib/supabase";
import { obterSessaoAplicacao } from "../lib/sessaoAplicacao";
import { adaptarQuestoesSupabase } from "./adaptarQuestoesSupabase";

export async function iniciarTentativaSupabase({
  modo,
  quantidade,
  filtros,
  caseStudy = false,
  idsTreinamento = null,
}) {
  const sessionId = obterSessaoAplicacao();

  if (!sessionId) {
    throw new Error("Sessão da aplicação não encontrada.");
  }

  const { data: selecao, error: erroSelecao } = await supabase.rpc(
    "iniciar_tentativa_segura",
    {
      p_session_id: sessionId,
      p_modo: modo,
      p_quantidade: quantidade,
      p_dominio: filtros.dominio,
      p_dificuldade: filtros.dificuldade,
      p_tipo_resposta: filtros.tipoResposta,
      p_abordagem: filtros.abordagem,
      p_area_conhecimento: filtros.areaConhecimento,
      p_case_study: caseStudy,
      p_ids_treinamento: idsTreinamento
        ? [...idsTreinamento]
        : null,
    }
  );

  if (erroSelecao) throw erroSelecao;

  const itens = Array.isArray(selecao) ? selecao : [];

  if (!itens.length) {
    return {
      tentativaId: null,
      questoes: [],
    };
  }

  const ordenados = [...itens].sort(
    (a, b) => a.ordem_selecao - b.ordem_selecao
  );

  const tentativaId = ordenados[0]?.tentativa_id;
  const ids = ordenados.map((item) => item.id_questao);

  const { data: linhas, error: erroQuestoes } = await supabase.rpc(
    "obter_questoes_seguras",
    {
      p_session_id: sessionId,
      p_ids: ids,
    }
  );

  if (erroQuestoes) throw erroQuestoes;

  const recebidas = Array.isArray(linhas) ? linhas : [];
  const porId = new Map(
    recebidas.map((linha) => [linha.id_questao, linha])
  );

  const naOrdem = ids
    .map((id) => porId.get(id))
    .filter(Boolean);

  if (naOrdem.length !== ids.length) {
    throw new Error("A tentativa retornou questões incompletas.");
  }

  return {
    tentativaId,
    questoes: adaptarQuestoesSupabase(naOrdem),
  };
}
