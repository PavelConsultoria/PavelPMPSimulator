import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/images/logo.png";
import "../styles/Login.css";

export default function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function entrar() {

    const nomeUsuario = email
  ? email
      .split("@")[0]
      .replace(".", " ")
      .split(" ")
      .map(
        palavra =>
          palavra.charAt(0).toUpperCase() +
          palavra.slice(1)
      )
      .join(" ")
  : "Usuário";

    localStorage.setItem(
      "usuario",
      nomeUsuario
    );

    navigate("/dashboard");
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