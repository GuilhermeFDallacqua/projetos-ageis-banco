import {
  StepCard,
  Question,
  YesNo,
  OptionGroup,
} from "../fields";
import { RESULTADOS_EXAME } from "../form";

const EXAMES = [
  { field: "hivResult", label: "HIV" },
  { field: "syphilisResult", label: "Sífilis (VDRL)" },
  { field: "hepatitisBResult", label: "Hepatite B" },
  { field: "hepatitisCResult", label: "Hepatite C" },
  { field: "htlvResult", label: "HTLV" },
];

export default function Sorologia({ form, update }) {
  return (
    <StepCard
      title="Sorologia e Vacinação"
      description="Registre o resultado dos exames do pré-natal e a situação vacinal."
    >
      {EXAMES.map((exame, index) => (
        <Question
          key={exame.field}
          number={`${index + 1}.`}
          text={exame.label}
        >
          <OptionGroup
            options={RESULTADOS_EXAME}
            value={form[exame.field]}
            onChange={(value) => update(exame.field, value)}
          />
        </Question>
      ))}

      <Question
        number={`${EXAMES.length + 1}.`}
        text="Possui vacina contra febre amarela?"
      >
        <YesNo
          value={form.hasYellowFeverVaccine}
          onChange={(value) => update("hasYellowFeverVaccine", value)}
        />
      </Question>

      <Question
        number={`${EXAMES.length + 2}.`}
        text="Possui vacina dTpa?"
      >
        <YesNo
          value={form.hasDtpaVaccine}
          onChange={(value) => update("hasDtpaVaccine", value)}
        />
      </Question>
    </StepCard>
  );
}
