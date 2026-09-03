import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/images/logo.png";
import { supabase } from "../lib/supabase";
import "../styles/Login.css";

function obterResultado(data) {
  return Array.isArray(data) ? data[0] : data;
}

export default function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function negarAcesso(rota) {
    localStorage.removeItem("usuario");

    try {
      await supabase.auth.signOut();
    } finally {
      navigate(rota);
    }
  }

  async function entrar() {
    try {
      const { data: autenticacao, error: erroAutenticacao } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: senha,
        });

      if (erroAutenticacao || !autenticacao.user) {
        await negarAcesso("/acesso-nao-autorizado");
        return;
      }

      const { error: erroAtivacao } = await supabase.rpc("ativar_licenca", {
        p_auth_user_id: autenticacao.user.id,
      });

      if (erroAtivacao) {
        await negarAcesso("/acesso-nao-autorizado");
        return;
      }

      const { data, error: erroValidacao } = await supabase.rpc("validar_licenca");
      const licenca = obterResultado(data);

      if (erroValidacao || !licenca) {
        await negarAcesso("/acesso-nao-autorizado");
        return;
      }

      if (licenca.status === "ativa" && typeof licenca.nome === "string" && licenca.nome.trim()) {
        localStorage.setItem("usuario", licenca.nome.trim());
        navigate("/dashboard");
        return;
      }

      if (licenca.status === "expirada") {
        await negarAcesso("/acesso-expirado");
        return;
      }

      await negarAcesso("/acesso-nao-autorizado");
    } catch {
      await negarAcesso("/acesso-nao-autorizado");
    }
  }


  return (

    <div className="loginPage">

      <div className="loginCard">


        <img
          src={logo}
          alt="Pavel"
          className="loginLogo"
        />


        <h1>
          Pavel PMP Simulator®
        </h1>


        <p className="loginSubtitulo">
          Plataforma Inteligente para Certificação PMP®
        </p>

        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />


        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) =>
            setSenha(e.target.value)
          }
        />


        <button
          className="btnEntrar"
          onClick={entrar}
        >
          Entrar
        </button>


        <p className="rodape">
          © 2026 Pavel Consultoria
        </p>


      </div>

    </div>

  );
}
