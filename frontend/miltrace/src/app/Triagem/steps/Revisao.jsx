import { StepCard, MESES } from "../fields";
import {
  ZONAS,
  TIPOS_PARTO,
  LOCAIS_COLETA,
  RESULTADOS_EXAME,
} from "../form";
import styles from "../triagem.module.css";

const simNao = (value) => (value ? "Sim" : "Não");

const labelDe = (lista, value) =>
  lista.find((item) => item.value === value)?.label || "—";

const mesAno = (month, year) =>
  month && year ? `${labelDe(MESES, month)}/${year}` : "—";

const dataBR = (value) =>
  value ? value.split("-").reverse().join("/") : "—";

export default function Revisao({ form, goToStep }) {
  const sections = [
    {
      step: 0,
      title: "Identificação",
      items: [
        ["Nome completo", form.fullName || "—"],
        ["CPF", form.CPF || "—"],
        ["Cartão SUS", form.susNumber || "—"],
        ["Data de nascimento", dataBR(form.birthDate)],
        ["Telefone", form.telephoneNumber || "—"],
        ["Zona", labelDe(ZONAS, form.zone)],
        ["Endereço", form.address || "—"],
      ],
    },
    {
      step: 1,
      title: "Saúde e hábitos",
      items: [
        [
          "Transfusão de sangue",
          form.hasBloodTransfusion
            ? `Sim (${mesAno(form.transfusionMonth, form.transfusionYear)})`
            : "Não",
        ],
        [
          "Tatuagem",
          form.hasTattoo
            ? `Sim (${mesAno(form.tattooMonth, form.tattooYear)})`
            : "Não",
        ],
        ["Fumante", simNao(form.smoker)],
        ["Bebida alcoólica", simNao(form.alcoholConsumer)],
        [
          "Medicamento",
          form.takesMedication ? form.usesMedication || "Sim" : "Não",
        ],
      ],
    },
    {
      step: 2,
      title: "Gestação e bebê",
      items: [
        ["Data do parto", dataBR(form.deliveryDate)],
        [
          "Idade gestacional",
          form.gestationalWeeks ? `${form.gestationalWeeks} semanas` : "—",
        ],
        [
          "Tipo de parto",
          labelDe(TIPOS_PARTO, form.deliveryType),
        ],
        ["Pré-natal", simNao(form.hadPrenatal)],
      ],
    },
    {
      step: 3,
      title: "Coleta e armazenamento",
      items: [
        [
          "Local da coleta",
          labelDe(LOCAIS_COLETA, form.collectionPlace),
        ],
        ["Freezer", simNao(form.hasFreezer)],
        ["Frascos de vidro", simNao(form.hasGlassJars)],
        ["Orientação de higiene", simNao(form.receivedHygieneGuidance)],
      ],
    },
    {
      step: 4,
      title: "Sorologia e vacinação",
      items: [
        ["HIV", labelDe(RESULTADOS_EXAME, form.hivResult)],
        ["Sífilis (VDRL)", labelDe(RESULTADOS_EXAME, form.syphilisResult)],
        ["Hepatite B", labelDe(RESULTADOS_EXAME, form.hepatitisBResult)],
        ["Hepatite C", labelDe(RESULTADOS_EXAME, form.hepatitisCResult)],
        ["HTLV", labelDe(RESULTADOS_EXAME, form.htlvResult)],
        ["Febre amarela", simNao(form.hasYellowFeverVaccine)],
        ["dTpa", simNao(form.hasDtpaVaccine)],
      ],
    },
  ];

  return (
    <StepCard
      title="Revisão"
      description="Confira as informações antes de finalizar a triagem."
    >
      {sections.map((section) => (
        <div key={section.title} className={styles.reviewSection}>

          <div className={styles.reviewHeader}>
            <h3>{section.title}</h3>

            <button
              type="button"
              className={styles.editButton}
              onClick={() => goToStep(section.step)}
            >
              Editar
            </button>
          </div>

          <dl className={styles.reviewGrid}>
            {section.items.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>

        </div>
      ))}
    </StepCard>
  );
}
