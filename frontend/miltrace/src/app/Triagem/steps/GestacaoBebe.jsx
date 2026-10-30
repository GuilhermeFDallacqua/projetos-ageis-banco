import {
  StepCard,
  Question,
  YesNo,
  OptionGroup,
  TextField,
} from "../fields";
import { TIPOS_PARTO } from "../form";
import styles from "../triagem.module.css";

export default function GestacaoBebe({ form, update }) {
  return (
    <StepCard
      title="Gestação e Bebê"
      description="Informe os dados da gestação e do nascimento do bebê."
    >
      <div className={`${styles.formGrid} ${styles.formGridSection}`}>

        <TextField
          label="Data do parto"
          type="date"
          value={form.deliveryDate}
          onChange={(value) => update("deliveryDate", value)}
        />

        <TextField
          label="Idade gestacional (semanas)"
          type="number"
          value={form.gestationalWeeks}
          onChange={(value) => update("gestationalWeeks", value)}
          placeholder="Ex.: 39"
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
