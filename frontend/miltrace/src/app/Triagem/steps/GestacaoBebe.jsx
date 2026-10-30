import {
  StepCard,
  Question,
  YesNo,
  OptionGroup,
  TextField,
} from "../fields";
import { TIPOS_PARTO } from "../form";
import styles from "../triagem.module.css";

export default function GestacaoBebe({ form, update, errors }) {
  return (
    <StepCard
      title="Gestação e Bebê"
      description="Informe os dados da gestação e do nascimento do bebê."
    >
      <div className={`${styles.formGrid} ${styles.formGridSection}`}>

        <TextField
          label="Data do parto"
          type="date"
          max={new Date().toISOString().slice(0, 10)}
          value={form.deliveryDate}
          onChange={(value) => update("deliveryDate", value)}
          error={errors.deliveryDate}
        />

        <TextField
          label="Idade gestacional (semanas)"
          type="number"
          value={form.gestationalWeeks}
          onChange={(value) => update("gestationalWeeks", value)}
          min={20}
          max={45}
          placeholder="Ex.: 39"
          error={errors.gestationalWeeks}
        />

      </div>

      <Question
        number="1."
        text="Qual foi o tipo de parto?"
      >
        <OptionGroup
          options={TIPOS_PARTO}
          value={form.deliveryType}
          onChange={(value) => update("deliveryType", value)}
        />
      </Question>

      <Question
        number="2."
        text="Realizou acompanhamento pré-natal?"
      >
        <YesNo
          value={form.hadPrenatal}
          onChange={(value) => update("hadPrenatal", value)}
        />
      </Question>
    </StepCard>
  );
}
