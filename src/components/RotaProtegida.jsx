import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

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

    async function verificarAcesso() {
      try {
        const { data: sessao, error: erroSessao } =
          await supabase.auth.getSession();

        if (erroSessao) {
          if (ativo) {
            setVerificacao({
              concluida: true,
              destino: "/acesso-nao-autorizado",
            });
          }
          return;
        }

        if (!sessao.session?.user) {
          if (ativo) setVerificacao({ concluida: true, destino: "/login" });
          return;
        }

        const { data, error: erroLicenca } =
          await supabase.rpc("validar_licenca");
        const licenca = obterResultado(data);

        if (erroLicenca || !licenca) {
          if (ativo) {
            setVerificacao({
              concluida: true,
              destino: "/acesso-nao-autorizado",
            });
          }
          return;
        }

        if (licenca.status === "ativa") {
          if (ativo) setVerificacao({ concluida: true, destino: null });
          return;
        }

        const destino =
          licenca.status === "expirada"
            ? "/acesso-expirado"
            : "/acesso-nao-autorizado";

        if (ativo) setVerificacao({ concluida: true, destino });
      } catch {
        if (ativo) {
          setVerificacao({
            concluida: true,
            destino: "/acesso-nao-autorizado",
          });
        }
      }
    }

    verificarAcesso();

    return () => {
      ativo = false;
    };
  }, []);

  if (!verificacao.concluida) return null;
  if (verificacao.destino) return <Navigate to={verificacao.destino} replace />;

  return children;
}
