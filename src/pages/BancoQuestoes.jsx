import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PavelLayout from "../components/PavelLayout";
import ConteudoProtegido from "../components/ConteudoProtegido";
import { supabase } from "../lib/supabase";
import { obterSessaoAplicacao } from "../lib/sessaoAplicacao";

const DOMINIOS_VALIDOS = ["Business Environment", "People", "Process"];
const ORDEM_DIFICULDADES = ["Fácil", "Média", "Difícil", "Muito Difícil"];

export default function BancoQuestoes() {
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");
  const [dominio, setDominio] = useState("Todos");
  const [dificuldade, setDificuldade] = useState("Todas");
  const [questoes, setQuestoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let ativo = true;

    async function carregarQuestoes() {
      try {
        const sessionId = obterSessaoAplicacao();
        if (!sessionId) throw new Error("Sessão da aplicação não encontrada.");

        const ids = Array.from({ length: 600 }, (_, indice) => indice + 1);
        const { data, error } = await supabase.rpc("obter_questoes_seguras", {
          p_session_id: sessionId,
          p_ids: ids,
        });

        if (error) throw error;

        const questoesCarregadas = (Array.isArray(data) ? data : []).map((linha) => ({
          id: linha.id_questao,
          enunciado: linha.enunciado,
          dominio: linha.dominio_eco,
          dificuldade: linha.dificuldade,
          caseStudy: linha.case_id ? { id: linha.case_id } : null,
        }));

        if (ativo) setQuestoes(questoesCarregadas);
      } catch (erroCarregamento) {
        if (ativo) setErro(erroCarregamento);
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregarQuestoes();

    return () => { ativo = false; };
  }, []);

  const dominios = useMemo(
    () => {
      const dominiosDoBanco = new Set(questoes.map((questao) => questao.dominio));
      return DOMINIOS_VALIDOS.filter((valor) => dominiosDoBanco.has(valor));
    },
    [questoes],
  );
  const dificuldades = useMemo(
    () => {
      const dificuldadesDoBanco = new Set(questoes.map((questao) => questao.dificuldade));
      return ORDEM_DIFICULDADES.filter((valor) => dificuldadesDoBanco.has(valor));
    },
    [questoes],
  );

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
    <PavelLayout titulo="Banco de Questões" subtitulo="Consulte, pesquise e responda individualmente as questões disponíveis.">
    <div
      style={{
        color: "#fff",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
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
              {dominios.map((valor) => <option key={valor}>{valor}</option>)}
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
              {dificuldades.map((valor) => <option key={valor}>{valor}</option>)}
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
              Valores disponíveis no banco publicado
            </div>

            <div style={{ textAlign: "center" }}>
              <strong style={{ color: "#bbb" }}>Dificuldade:</strong>
              <br />
              Valores disponíveis no banco publicado
            </div>
          </div>
        </div>

        {/* LISTA DE QUESTÕES */}
        <div>
          {carregando && <div style={{ padding: "40px", textAlign: "center", color: "#aaa" }}>Carregando questões...</div>}
          {erro && <div style={{ padding: "40px", textAlign: "center", color: "#f87171" }}>Não foi possível carregar o banco de questões.</div>}
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
                  {questao.caseStudy ? `CASE STUDY — Questão ${questao.id}` : `Questão ${questao.id}`}
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

              <ConteudoProtegido>
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
              </ConteudoProtegido>
              <button
                type="button"
                className="reportAction"
                style={{ marginTop: "16px" }}
                onClick={() => navigate("/simulado", { state: { modo: "Estudo", idsQuestoes: [questao.id], origem: "/banco-questoes" } })}
              >
                Responder questão
              </button>
            </div>
          ))}

          {!carregando && !erro && questoesFiltradas.length === 0 && (
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
    </PavelLayout>
  );
}
