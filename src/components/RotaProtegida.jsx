import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import {
  limparSessaoAplicacao,
  obterSessaoAplicacao,
  validarSessaoAplicacao,
} from "../lib/sessaoAplicacao";

function obterResultado(data) {
  return Array.isArray(data) ? data[0] : data;
}

export default function RotaProtegida({ children }) {
  const [verificacao, setVerificacao] = useState({
    concluida: false,
    destino: null,
  });

  useEffect(() => {
    let ativo = true;
    let verificacaoEmAndamento = false;
    let logoutEmAndamento = false;

    async function encerrarSessaoLocal() {
      if (logoutEmAndamento) return;
      logoutEmAndamento = true;

      limparSessaoAplicacao();
      localStorage.removeItem("usuario");

      try {
        await supabase.auth.signOut({ scope: "local" });
      } finally {
        if (ativo) {
          setVerificacao({ concluida: true, destino: "/login" });
        }
      }
    }

    async function verificarAcesso() {
      if (verificacaoEmAndamento || logoutEmAndamento) return;
      verificacaoEmAndamento = true;

      try {
        const { data: sessao, error: erroSessao } =
          await supabase.auth.getSession();

        if (erroSessao) return;

        if (!sessao.session?.user) {
          await encerrarSessaoLocal();
          return;
        }

        const { data, error: erroLicenca } =
          await supabase.rpc("validar_licenca");
        const licenca = obterResultado(data);

        if (erroLicenca || !licenca) return;

        if (licenca.status === "ativa") {
          const sessionId = obterSessaoAplicacao();

          if (!sessionId) {
            await encerrarSessaoLocal();
            return;
          }

          const { data: sessaoValida, error: erroSessaoAplicacao } =
            await validarSessaoAplicacao(sessionId);

          if (erroSessaoAplicacao) return;

          if (sessaoValida === false) {
            await encerrarSessaoLocal();
            return;
          }

          if (sessaoValida !== true) return;

          if (ativo) setVerificacao({ concluida: true, destino: null });
          return;
        }

        const destino =
          licenca.status === "expirada"
            ? "/acesso-expirado"
            : "/acesso-nao-autorizado";

        if (ativo) setVerificacao({ concluida: true, destino });
      } catch {
        // Falhas temporárias não invalidam uma sessão já autorizada.
      } finally {
        verificacaoEmAndamento = false;
      }
    }

    verificarAcesso();

    const intervalo = window.setInterval(verificarAcesso, 30_000);

    function verificarAoFocar() {
      verificarAcesso();
    }

    function verificarAoVoltar() {
      if (document.visibilityState === "visible") verificarAcesso();
    }

    window.addEventListener("focus", verificarAoFocar);
    document.addEventListener("visibilitychange", verificarAoVoltar);

    return () => {
      ativo = false;
      window.clearInterval(intervalo);
      window.removeEventListener("focus", verificarAoFocar);
      document.removeEventListener("visibilitychange", verificarAoVoltar);
    };
  }, []);

  if (!verificacao.concluida) return null;
  if (verificacao.destino) return <Navigate to={verificacao.destino} replace />;

  return children;
}
