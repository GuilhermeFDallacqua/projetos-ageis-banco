import {
  StepCard,
  Question,
  YesNo,
  MonthYearSelect,
} from "../fields";
import styles from "../triagem.module.css";

export default function SaudeHabitos({ form, update }) {
  return (
    <StepCard
      title="Saúde e Hábitos"
      description="Responda com atenção a cada uma das perguntas abaixo para prosseguir com a triagem."
    >
      <Question
        number="1."
        text="Realizou transfusão de sangue recentemente?"
      >
        <div className={styles.questionWithExtra}>

          <YesNo
            value={form.hasBloodTransfusion}
            onChange={(value) => update("hasBloodTransfusion", value)}
          />

          {form.hasBloodTransfusion && (
            <MonthYearSelect
              label="Quando realizou a transfusão?"
              month={form.transfusionMonth}
              year={form.transfusionYear}
              onMonthChange={(value) => update("transfusionMonth", value)}
              onYearChange={(value) => update("transfusionYear", value)}
            />
          )}

        </div>
      </Question>

      <Question
        number="2."
        text="Possui tatuagem?"
      >
        <div className={styles.questionWithExtra}>

          <YesNo
            value={form.hasTattoo}
            onChange={(value) => update("hasTattoo", value)}
          />

          {form.hasTattoo && (
            <MonthYearSelect
              label="Quando realizou a tatuagem?"
              month={form.tattooMonth}
              year={form.tattooYear}
              onMonthChange={(value) => update("tattooMonth", value)}
              onYearChange={(value) => update("tattooYear", value)}
            />
          )}

        </div>
      </Question>

      <Question
        number="3."
        text="Fuma atualmente?"
      >
        <YesNo
          value={form.smoker}
          onChange={(value) => update("smoker", value)}
        />
      </Question>

      <Question
        number="4."
        text="Consome bebida alcoólica?"
      >
        <YesNo
          value={form.alcoholConsumer}
          onChange={(value) => update("alcoholConsumer", value)}
        />
      </Question>

      <Question
        number="5."
        text="Utiliza algum medicamento?"
      >
        <div className={styles.questionWithExtra}>

          <YesNo
            value={form.takesMedication}
            onChange={(value) => update("takesMedication", value)}
          />

          {form.takesMedication && (
            <div className={styles.extraBox}>

              <label>
                Qual medicamento?
              </label>

              <input
                type="text"
                value={form.usesMedication}
                onChange={(e) =>
                  update("usesMedication", e.target.value)
                }
                placeholder="Digite o medicamento"
              />

            </div>
          )}

        </div>
      </Question>
    </StepCard>
  );
}
