"use client";

import { Fragment, useState } from "react";
import {
  Check,
  ChevronRight,
} from "lucide-react";

import Sidebar from "@/components/Sidebar/sidebar";
import styles from "./triagem.module.css";
import { initialForm, buildTrialPayload } from "./form";
import Identificacao from "./steps/Identificacao";
import SaudeHabitos from "./steps/SaudeHabitos";
import GestacaoBebe from "./steps/GestacaoBebe";
import Coleta from "./steps/Coleta";
import Sorologia from "./steps/Sorologia";
import Revisao from "./steps/Revisao";

const steps = [
  { label: "Identificação", component: Identificacao },
  { label: "Saúde e hábitos", component: SaudeHabitos },
  { label: "Gestação e bebê", component: GestacaoBebe },
  { label: "Coleta e armaz.", component: Coleta },
  { label: "Sorologia", component: Sorologia },
  { label: "Revisão", component: Revisao },
];

export default function TriagemPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState(initialForm);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  // Nome e CPF são obrigatórios para sair da identificação
  const canAdvance =
    currentStep !== 0 || (form.fullName.trim() && form.CPF.trim());

  const StepComponent = steps[currentStep].component;

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function goToStep(index) {
    setCurrentStep(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleFinish() {
    const payload = buildTrialPayload(form);

    // Conectar aqui: await trialService.create(payload)
    // (import { trialService } from "@/services/trialService")
    return payload;
  }

  return (
    <div className={styles.container}>

      <Sidebar />

      <main className={styles.main}>

        <header className={styles.header}>
          <div>
            <h1>Nova Triagem</h1>

            <span className={styles.doadora}>
              {form.fullName || "Nova doadora"}
            </span>
          </div>
        </header>

        <div className={styles.steps}>

          {steps.map((step, index) => {
            const completed = index < currentStep;
            const current = index === currentStep;

            return (
              <Fragment key={step.label}>

                {index > 0 && (
                  <div
                    className={`${styles.stepLine} ${
                      index <= currentStep ? styles.stepLineDone : ""
                    }`}
                  ></div>
                )}

                <button
                  type="button"
                  className={styles.step}
                  disabled={!completed}
                  onClick={() => goToStep(index)}
                >
                  <div
                    className={`${styles.stepCircle} ${
                      completed ? styles.completed : ""
                    } ${current ? styles.current : ""}`}
                  >
                    {completed ? <Check size={15} /> : index + 1}
                  </div>

                  <span>{index + 1}. {step.label}</span>
                </button>

              </Fragment>
            );
          })}

        </div>

        <StepComponent
          form={form}
          update={update}
          goToStep={goToStep}
        />

        <div className={styles.footer}>

          <span className={styles.requiredText}>
            {isFirstStep && "* Campos obrigatórios"}
          </span>

          <div className={styles.footerButtons}>

            {!isFirstStep && (
              <button
                className={styles.backButton}
                onClick={() => goToStep(currentStep - 1)}
              >
                Voltar
              </button>
            )}

            {isLastStep ? (
              <button
                className={styles.nextButton}
                onClick={handleFinish}
              >
                Finalizar triagem
                <Check size={16} />
              </button>
            ) : (
              <button
                className={styles.nextButton}
                disabled={!canAdvance}
                onClick={() => goToStep(currentStep + 1)}
              >
                Próxima etapa
                <ChevronRight size={16} />
              </button>
            )}

          </div>

        </div>

      </main>
    </div>
  );
}
