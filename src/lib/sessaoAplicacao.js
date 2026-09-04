import { supabase } from "./supabase";

export const CHAVE_SESSAO_APLICACAO = "pavel_session_id";

export function obterSessaoAplicacao() {
  return localStorage.getItem(CHAVE_SESSAO_APLICACAO);
}

export function salvarSessaoAplicacao(sessionId) {
  localStorage.setItem(CHAVE_SESSAO_APLICACAO, sessionId);
}

export function limparSessaoAplicacao() {
  localStorage.removeItem(CHAVE_SESSAO_APLICACAO);
}

export function iniciarSessaoAplicacao() {
  return supabase.rpc("iniciar_sessao_aplicacao");
}

export function validarSessaoAplicacao(sessionId) {
  return supabase.rpc("validar_sessao_aplicacao", {
    p_session_id: sessionId,
  });
}

export function encerrarSessaoAplicacao(sessionId) {
  return supabase.rpc("encerrar_sessao_aplicacao", {
    p_session_id: sessionId,
  });
}
