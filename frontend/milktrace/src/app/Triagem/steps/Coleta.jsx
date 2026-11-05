import {
  StepCard,
  Question,
  YesNo,
  OptionGroup,
} from "../fields";
import { LOCAIS_COLETA } from "../form";

export default function Coleta({ form, update }) {
  return (
    <StepCard
      title="Coleta e Armazenamento"
      description="Verifique as condições de coleta e armazenamento do leite."
    >
      <Question
        number="1."
        text="Onde será realizada a coleta?"
      >
        <OptionGroup
          options={LOCAIS_COLETA}
          value={form.collectionPlace}
          onChange={(value) => update("collectionPlace", value)}
        />
      </Question>

      <Question
        number="2."
        text="Possui freezer ou congelador para armazenar o leite?"
      >
        <YesNo
          value={form.hasFreezer}
          onChange={(value) => update("hasFreezer", value)}
        />
      </Question>

      <Question
        number="3."
        text="Possui frascos de vidro com tampa plástica?"
      >
        <YesNo
          value={form.hasGlassJars}
          onChange={(value) => update("hasGlassJars", value)}
        />
      </Question>

      <Question
        number="4."
        text="Recebeu orientação sobre higiene na coleta?"
      >
        <YesNo
          value={form.receivedHygieneGuidance}
          onChange={(value) => update("receivedHygieneGuidance", value)}
        />
      </Question>
    </StepCard>
  );
}
