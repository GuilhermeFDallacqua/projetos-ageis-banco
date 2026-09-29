
"use client";

import { useState } from "react";
import {
  Home,
  Users,
  ClipboardList,
  LogOut,
  CircleHelp,
  Check,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

import styles from "./triagem.module.css";

export default function TriagemPage() {
  const [transfusao, setTransfusao] = useState("nao");
  const [tatuagem, setTatuagem] = useState("sim");
  const [fumante, setFumante] = useState("nao");
  const [alcool, setAlcool] = useState("nao");
  const [medicamento, setMedicamento] = useState("sim");

  const [mesTatuagem, setMesTatuagem] = useState("");
  const [anoTatuagem, setAnoTatuagem] = useState("");
  const [nomeMedicamento, setNomeMedicamento] =
    useState("Dipirona 500mg");

  return (
    <div className={styles.container}>
      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>✚</div>

          <span>
            Milk<span>Trace</span>
          </span>
        </div>

        <nav className={styles.navigation}>
          <button className={styles.navItem}>
            <Home size={15} />
            <span>Início</span>
          </button>

          <button className={styles.navItem}>
            <Users size={15} />
            <span>Doadoras</span>
          </button>

          <button
            className={`${styles.navItem} ${styles.active}`}
          >
            <ClipboardList size={15} />
            <span>Triagem</span>
          </button>
        </nav>

        <button className={styles.logout}>
          <LogOut size={15} />
          <span>Sair</span>
        </button>
      </aside>

      {/* =====================================================
          CONTEÚDO PRINCIPAL
      ===================================================== */}

      <main className={styles.main}>
        {/* ===================================================
            CABEÇALHO
        =================================================== */}

        <header className={styles.header}>
          <div>
            <h1>Nova Triagem</h1>

            <span className={styles.doadora}>
              Doadora #D-00124
            </span>
          </div>

          <button className={styles.helpButton}>
            <CircleHelp size={13} />

            <span>
              Caso tenha dúvidas, consulte o Manual de Triagem.
            </span>
          </button>
        </header>

        {/* ===================================================
            ETAPAS
        =================================================== */}

        <div className={styles.steps}>
          {/* ETAPA 1 */}

          <div className={styles.step}>
            <div
              className={`${styles.stepCircle} ${styles.completed}`}
            >
              <Check size={13} />
            </div>

            <span>1. Identificação</span>
          </div>

          <div className={styles.stepLine}></div>

          {/* ETAPA 2 */}

          <div className={styles.step}>
            <div
              className={`${styles.stepCircle} ${styles.current}`}
            >
              2
            </div>

            <span>2. Saúde e hábitos</span>
          </div>

          <div className={styles.stepLine}></div>

          {/* ETAPA 3 */}

          <div className={styles.step}>
            <div className={styles.stepCircle}>
              3
            </div>

            <span>3. Gestação e bebê</span>
          </div>

          <div className={styles.stepLine}></div>

          {/* ETAPA 4 */}

          <div className={styles.step}>
            <div className={styles.stepCircle}>
              4
            </div>

            <span>4. Coleta e armaz.</span>
          </div>

          <div className={styles.stepLine}></div>

          {/* ETAPA 5 */}

          <div className={styles.step}>
            <div className={styles.stepCircle}>
              5
            </div>

            <span>5. Sorologia</span>
          </div>

          <div className={styles.stepLine}></div>

          {/* ETAPA 6 */}

          <div className={styles.step}>
            <div className={styles.stepCircle}>
              6
            </div>

            <span>6. Revisão</span>
          </div>
        </div>

        {/* ===================================================
            CARD PRINCIPAL
        =================================================== */}

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Saúde e Hábitos</h2>

            <p>
              Responda com atenção a cada uma das perguntas abaixo
              para prosseguir com a triagem.
            </p>
          </div>

          <div className={styles.divider}></div>

          {/* =================================================
              PERGUNTA 1
          ================================================= */}

          <Question
            number="1."
            text="Realizou transfusão de sangue recentemente?"
          >
            <div className={styles.options}>
              <RadioButton
                label="Não"
                selected={transfusao === "nao"}
                onClick={() => setTransfusao("nao")}
              />

              <RadioButton
                label="Sim"
                selected={transfusao === "sim"}
                onClick={() => setTransfusao("sim")}
              />
            </div>
          </Question>

          {/* =================================================
              PERGUNTA 2
          ================================================= */}

          <Question
            number="2."
            text="Possui tatuagem?"
          >
            <div className={styles.questionWithExtra}>
              {/* BOTÕES */}

              <div className={styles.options}>
                <RadioButton
                  label="Não"
                  selected={tatuagem === "nao"}
                  onClick={() => setTatuagem("nao")}
                />

                <RadioButton
                  label="Sim"
                  selected={tatuagem === "sim"}
                  onClick={() => setTatuagem("sim")}
                />
              </div>

              {/* CAMPO EXTRA */}

              {tatuagem === "sim" && (
                <div className={styles.extraBox}>
                  <label>
                    Quando realizou a tatuagem?
                  </label>

                  <div className={styles.selectRow}>
                    <div className={styles.selectWrapper}>
                      <select
                        value={mesTatuagem}
                        onChange={(e) =>
                          setMesTatuagem(e.target.value)
                        }
                      >
                        <option value="">Mês</option>
                        <option value="01">Janeiro</option>
                        <option value="02">Fevereiro</option>
                        <option value="03">Março</option>
                        <option value="04">Abril</option>
                        <option value="05">Maio</option>
                        <option value="06">Junho</option>
                        <option value="07">Julho</option>
                        <option value="08">Agosto</option>
                        <option value="09">Setembro</option>
                        <option value="10">Outubro</option>
                        <option value="11">Novembro</option>
                        <option value="12">Dezembro</option>
                      </select>

                      <ChevronDown size={14} />
                    </div>

                    <div className={styles.selectWrapper}>
                      <select
                        value={anoTatuagem}
                        onChange={(e) =>
                          setAnoTatuagem(e.target.value)
                        }
                      >
                        <option value="">Ano</option>
                        <option value="2026">2026</option>
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                        <option value="2021">2021</option>
                        <option value="2020">2020</option>
                        <option value="2019">2019</option>
                      </select>

                      <ChevronDown size={14} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Question>

          {/* =================================================
              PERGUNTA 3
          ================================================= */}

          <Question
            number="3."
            text="Fuma atualmente?"
          >
            <div className={styles.options}>
              <RadioButton
                label="Não"
                selected={fumante === "nao"}
                onClick={() => setFumante("nao")}
              />

              <RadioButton
                label="Sim"
                selected={fumante === "sim"}
                onClick={() => setFumante("sim")}
              />
            </div>
          </Question>

          {/* =================================================
              PERGUNTA 4
          ================================================= */}

          <Question
            number="4."
            text="Consome bebida alcoólica?"
          >
            <div className={styles.options}>
              <RadioButton
                label="Não"
                selected={alcool === "nao"}
                onClick={() => setAlcool("nao")}
              />

              <RadioButton
                label="Sim"
                selected={alcool === "sim"}
                onClick={() => setAlcool("sim")}
              />
            </div>
          </Question>

          {/* =================================================
              PERGUNTA 5
          ================================================= */}

          <Question
            number="5."
            text="Utiliza algum medicamento?"
          >
            <div className={styles.questionWithExtra}>
              {/* BOTÕES */}

              <div className={styles.options}>
                <RadioButton
                  label="Não"
                  selected={medicamento === "nao"}
                  onClick={() => setMedicamento("nao")}
                />

                <RadioButton
                  label="Sim"
                  selected={medicamento === "sim"}
                  onClick={() => setMedicamento("sim")}
                />
              </div>

              {/* CAMPO EXTRA */}

              {medicamento === "sim" && (
                <div className={styles.extraBox}>
                  <label>
                    Qual medicamento?
                  </label>

                  <input
                    type="text"
                    value={nomeMedicamento}
                    onChange={(e) =>
                      setNomeMedicamento(e.target.value)
                    }
                    placeholder="Digite o medicamento"
                  />
                </div>
              )}
            </div>
          </Question>
        </section>

        {/* ===================================================
            RODAPÉ
        =================================================== */}

        <div className={styles.footer}>
          <span className={styles.requiredText}>
            Todos os campos são obrigatórios.
          </span>

          <div className={styles.footerButtons}>
            <button className={styles.backButton}>
              Voltar
            </button>

            <button className={styles.nextButton}>
              Próxima etapa
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}


/* =========================================================
   COMPONENTE DE PERGUNTA
========================================================= */

function Question({ number, text, children }) {
  return (
    <div className={styles.question}>
      <h3>
        <span>{number}</span> {text}
      </h3>

      {children}
    </div>
  );
}



function RadioButton({
  label,
  selected,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${styles.radioButton} ${
        selected ? styles.radioSelected : ""
      }`}
    >
      <span className={styles.radioCircle}>
        {selected && <span />}
      </span>

      {label}
    </button>
  );
}
