import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BancoQuestoes() {
  const navigate = useNavigate();

  const [busca, setBusca] = useState("");
  const [dominio, setDominio] = useState("Todos");
  const [dificuldade, setDificuldade] = useState("Todas");

  const questoes = [
    {
      id: 1,
      dominio: "Processo",
      dificuldade: "Média",
      enunciado:
        "Um gerente de projeto está liderando um projeto preditivo. Durante a execução, um dos principais interessados solicita uma mudança importante que impactará significativamente o escopo, o custo e o cronograma. O que o gerente de projeto deve fazer PRIMEIRO?",
    },
    {
      id: 2,
      dominio: "Pessoas",
      dificuldade: "Fácil",
      enunciado:
        "Um membro da equipe apresenta uma dificuldade que pode afetar o andamento do projeto. Qual deve ser a primeira ação do gerente de projeto?",
    },
    {
      id: 3,
      dominio: "Negócio",
      dificuldade: "Difícil",
      enunciado:
        "Durante a execução do projeto, uma mudança no ambiente organizacional pode afetar os benefícios esperados. O que o gerente de projeto deve fazer?",
    },
  ];

  const questoesFiltradas = questoes.filter((questao) => {
    const correspondeBusca =
      questao.enunciado.toLowerCase().includes(busca.toLowerCase());

    const correspondeDominio =
      dominio === "Todos" || questao.dominio === dominio;

    const correspondeDificuldade =
      dificuldade === "Todas" || questao.dificuldade === dificuldade;

    return (
      correspondeBusca &&
      correspondeDominio &&
      correspondeDificuldade
    );
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        padding: "30px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* CABEÇALHO */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
            borderBottom: "1px solid #333",
            paddingBottom: "20px",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                color: "#22c55e",
                fontSize: "32px",
              }}
            >
              📚 Banco de Questões
            </h1>

            <p
              style={{
                marginTop: "8px",
                color: "#aaa",
              }}
            >
              Consulte e pesquise as questões disponíveis no simulador.
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            style={{
              padding: "12px 22px",
              borderRadius: "8px",
              border: "1px solid #444",
              background: "#202938",
              color: "#fff",
              cursor: "pointer",
              fontSize: "15px",
            }}
          >
            Voltar
          </button>
        </div>

        {/* RESUMO */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "15px",
            marginBottom: "25px",
          }}
        >
          <div
            style={{
              background: "#202938",
              borderRadius: "10px",
              padding: "20px",
              textAlign: "center",
              border: "1px solid #344154",
            }}
          >
            <div style={{ color: "#aaa" }}>Questões disponíveis</div>

            <strong
              style={{
                display: "block",
                color: "#22c55e",
                fontSize: "30px",
                marginTop: "8px",
              }}
            >
              {questoes.length}
            </strong>
          </div>

          <div
            style={{
              background: "#202938",
              borderRadius: "10px",
              padding: "20px",
              textAlign: "center",
              border: "1px solid #344154",
            }}
          >
            <div style={{ color: "#aaa" }}>Exibidas</div>

            <strong
              style={{
                display: "block",
                color: "#22c55e",
                fontSize: "30px",
                marginTop: "8px",
              }}
            >
              {questoesFiltradas.length}
            </strong>
          </div>

          <div
            style={{
              background: "#202938",
              borderRadius: "10px",
              padding: "20px",
              textAlign: "center",
              border: "1px solid #344154",
            }}
          >
            <div style={{ color: "#aaa" }}>PMBOK</div>

            <strong
              style={{
                display: "block",
                color: "#22c55e",
                fontSize: "22px",
                marginTop: "12px",
              }}
            >
              8ª Edição
            </strong>
          </div>
        </div>

        {/* FILTROS */}
        <div
          style={{
            background: "#171717",
            borderRadius: "12px",
            padding: "22px",
            marginBottom: "25px",
            border: "1px solid #333",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              color: "#22c55e",
              fontSize: "20px",
            }}
          >
            Pesquisar questões
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr",
              gap: "15px",
            }}
          >
            <input
              type="text"
              placeholder="Digite uma palavra ou trecho da questão..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              style={{
                padding: "14px",
                borderRadius: "8px",
                border: "1px solid #39465a",
                background: "#202938",
                color: "#fff",
                fontSize: "15px",
              }}
            />

            <select
              value={dominio}
              onChange={(e) => setDominio(e.target.value)}
              style={{
                padding: "14px",
                borderRadius: "8px",
                border: "1px solid #39465a",
                background: "#202938",
                color: "#fff",
                fontSize: "15px",
              }}
            >
              <option>Todos</option>
              <option>Pessoas</option>
              <option>Processo</option>
              <option>Negócio</option>
            </select>

            <select
              value={dificuldade}
              onChange={(e) => setDificuldade(e.target.value)}
              style={{
                padding: "14px",
                borderRadius: "8px",
                border: "1px solid #39465a",
                background: "#202938",
                color: "#fff",
                fontSize: "15px",
              }}
            >
              <option>Todas</option>
              <option>Fácil</option>
              <option>Média</option>
              <option>Difícil</option>
            </select>
          </div>

          {/* LEGENDA */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr",
              gap: "15px",
              marginTop: "10px",
              padding: "0",
              color: "#999",
              fontSize: "13px",
              lineHeight: "1.5",
            }}
          >
            <div></div>

            <div style={{ textAlign: "center" }}>
              <strong style={{ color: "#bbb" }}>Área:</strong>
              <br />
              Pessoas, Processo ou Negócio
            </div>

            <div style={{ textAlign: "center" }}>
              <strong style={{ color: "#bbb" }}>Dificuldade:</strong>
              <br />
              Fácil, Média ou Difícil
            </div>
          </div>
        </div>

        {/* LISTA DE QUESTÕES */}
        <div>
          {questoesFiltradas.map((questao) => (
            <div
              key={questao.id}
              style={{
                background: "#202938",
                border: "1px solid #344154",
                borderRadius: "12px",
                padding: "22px",
                marginBottom: "15px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                <strong
                  style={{
                    color: "#22c55e",
                    fontSize: "20px",
                  }}
                >
                  Questão {questao.id}
                </strong>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                  }}
                >
                  <span
                    style={{
                      background: "#172033",
                      padding: "6px 12px",
                      borderRadius: "20px",
                      color: "#aaa",
                      fontSize: "13px",
                    }}
                  >
                    {questao.dominio}
                  </span>

                  <span
                    style={{
                      background: "#172033",
                      padding: "6px 12px",
                      borderRadius: "20px",
                      color: "#aaa",
                      fontSize: "13px",
                    }}
                  >
                    {questao.dificuldade}
                  </span>
                </div>
              </div>

              <p
                style={{
                  color: "#eee",
                  lineHeight: "1.6",
                  margin: 0,
                  fontSize: "16px",
                }}
              >
                {questao.enunciado}
              </p>
            </div>
          ))}

          {questoesFiltradas.length === 0 && (
            <div
              style={{
                background: "#171717",
                borderRadius: "12px",
                padding: "40px",
                textAlign: "center",
                color: "#aaa",
              }}
            >
              Nenhuma questão encontrada.
            </div>
          )}
        </div>

        {/* RODAPÉ */}
        <div
          style={{
            textAlign: "center",
            color: "#777",
            marginTop: "35px",
            paddingTop: "20px",
            borderTop: "1px solid #222",
          }}
        >
          Simulador® Pavel PMP — Banco de Questões
        </div>
      </div>
    </div>
  );
}