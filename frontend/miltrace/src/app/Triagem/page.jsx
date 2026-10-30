"use client";

import { Fragment, Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Check,
  ChevronRight,
} from "lucide-react";

import Sidebar from "@/components/Sidebar/sidebar";
import { Spinner, ErrorState } from "@/components/States/states";
import { useAsync } from "@/hooks/useAsync";
import { useToast } from "@/contexts/ToastContext";
import { trialService } from "@/services/trialService";
import { formatTrialCode } from "@/utils/format";
import styles from "./triagem.module.css";
import {
  initialForm,
  buildTrialPayload,
  validateStep,
  donorToForm,
  trialToForm,
} from "./form";
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
  return (
    <div className={styles.container}>

      <Sidebar />

      <main className={styles.main}>
        <Suspense>
          <TriagemLoader />
        </Suspense>
      </main>
    </div>
  );
}

// ?editar=ID  -> edita a triagem
// ?doadora=ID -> nova triagem com os dados da doadora já preenchidos
function TriagemLoader() {
  const searchParams = useSearchParams();
  const editId = searchParams.get("editar");
  const donorId = searchParams.get("doadora");
  const sourceId = editId || donorId;

  const loadSource = useCallback(
    () => (sourceId ? trialService.getById(sourceId) : Promise.resolve(null)),
    [sourceId]
  );
  const { data, loading, error, reload } = useAsync(loadSource);

  if (error) {
    return (
      <section className={styles.card}>
        <ErrorState message={error} onRetry={reload} />
      </section>
    );
  }

  if (loading) {
    return (
      <div className={styles.loadingBox}>
        <Spinner />
        Carregando triagem...
      </div>
    );
  }

  const initial = data
    ? editId
      ? trialToForm(data)
      : donorToForm(data)
    : initialForm;

  return (
    <TriagemWizard
      key={sourceId || "nova"}
      initial={initial}
      editId={editId}
      isReturningDonor={!!donorId && !!data}
    />
  );
}

function TriagemWizard({ initial, editId, isReturningDonor }) {
  const toast = useToast();

  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [direction, setDirection] = useState("forward");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(null);
  const [dirty, setDirty] = useState(false);

  const isEditing = !!editId;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const StepComponent = steps[currentStep].component;

  // Avisa antes de sair da página com dados não salvos
  useEffect(() => {
    if (!dirty || saved) return;

    const onBeforeUnload = (e) => e.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);

    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty, saved]);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setDirty(true);

    // Some com o erro do campo assim que ele é alterado
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function goToStep(index) {
    setDirection(index >= currentStep ? "forward" : "back");
    setCurrentStep(index);
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleNext() {
    const found = validateStep(currentStep, form);

    if (Object.keys(found).length) {
      setErrors(found);
      toast.error("Revise os campos destacados antes de continuar.");
      return;
    }

    goToStep(currentStep + 1);
  }

  async function handleFinish() {
    // Garante que todas as etapas estão válidas antes de salvar
    for (let step = 0; step < steps.length - 1; step++) {
      const found = validateStep(step, form);

      if (Object.keys(found).length) {
        goToStep(step);
        setErrors(found);
        toast.error("Existem campos pendentes nesta etapa.");
        return;
      }
    }

    setSaving(true);

    try {
      const payload = buildTrialPayload(form);
      const result = isEditing
        ? await trialService.update(editId, payload)
        : await trialService.create(payload);

      setSaved(result || { id: editId });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleRestart() {
    setForm(initialForm);
    setErrors({});
    setSaved(null);
    setDirty(false);
    setDirection("forward");
    setCurrentStep(0);
  }

  if (saved) {
    return (
      <section className={`${styles.card} ${styles.successCard}`}>

        <div className={styles.successIcon}>
          <Check size={34} />
        </div>

        <h2>{isEditing ? "Triagem atualizada!" : "Triagem finalizada!"}</h2>

        <p>
          A triagem
          {saved.id !== undefined && <strong> {formatTrialCode(saved.id)}</strong>} de{" "}
          <strong>{form.fullName}</strong> foi{" "}
          {isEditing ? "atualizada" : "registrada"} com sucesso.
        </p>

        <div className={styles.footerButtons}>

          {saved.id !== undefined && (
            <Link href={`/Doadoras/${saved.id}`} className={styles.backButton}>
              Ver triagem
            </Link>
          )}

          {isEditing ? (
            <Link href="/Doadoras" className={styles.nextButton}>
              Ver doadoras
              <ChevronRight size={16} />
            </Link>
          ) : (
            <button
              className={styles.nextButton}
              onClick={handleRestart}
            >
              Nova triagem
              <ChevronRight size={16} />
            </button>
          )}

        </div>

      </section>
    );
  }

  return (
    <>
      <header className={`${styles.header} ${styles.fadeUp}`}>
        <div>
          <h1>{isEditing ? "Editar Triagem" : "Nova Triagem"}</h1>

          <div className={styles.badges}>
            <span className={styles.doadora}>
              {form.fullName || "Nova doadora"}
            </span>

            {isEditing && (
              <span className={styles.badgeMuted}>
                {formatTrialCode(editId)}
              </span>
            )}

            {isReturningDonor && (
              <span className={styles.badgeSuccess}>
                Doadora já cadastrada
              </span>
            )}
          </div>
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
                aria-current={current ? "step" : undefined}
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

      <div
        key={currentStep}
        className={
          direction === "forward"
            ? styles.stepEnterForward
            : styles.stepEnterBack
        }
      >
        <StepComponent
          form={form}
          update={update}
          errors={errors}
          goToStep={goToStep}
        />
      </div>

      <div className={styles.footer}>

        <span className={styles.requiredText}>
          {isFirstStep
            ? "* Campos obrigatórios"
            : `Etapa ${currentStep + 1} de ${steps.length}`}
        </span>

        <div className={styles.footerButtons}>

          {isFirstStep ? (
            <Link
              href={isEditing ? `/Doadoras/${editId}` : "/"}
              className={styles.backButton}
            >
              Cancelar
            </Link>
          ) : (
            <button
              className={styles.backButton}
              onClick={() => goToStep(currentStep - 1)}
              disabled={saving}
            >
              Voltar
            </button>
          )}

          {isLastStep ? (
            <button
              className={styles.nextButton}
              onClick={handleFinish}
              disabled={saving}
            >
              {saving && <Spinner />}
              {saving
                ? "Salvando..."
                : isEditing
                  ? "Salvar alterações"
                  : "Finalizar triagem"}
              {!saving && <Check size={16} />}
            </button>
          ) : (
            <button
              className={styles.nextButton}
              onClick={handleNext}
            >
              Próxima etapa
              <ChevronRight size={16} />
            </button>
          )}

        </div>

      </div>
    </>
  );
}
