import { StepCard, TextField, Select, ErrorText } from "../fields";
import { ZONAS } from "../form";
import { maskCPF, maskPhone, maskSUS } from "@/utils/format";
import styles from "../triagem.module.css";

export default function Identificacao({ form, update, errors }) {
  return (
    <StepCard
      title="Identificação"
      description="Preencha os dados pessoais da doadora para iniciar a triagem."
    >
      <div className={styles.formGrid}>

        <TextField
          label="Nome completo"
          required
          full
          autoFocus
          value={form.fullName}
          onChange={(value) => update("fullName", value)}
          placeholder="Digite o nome da doadora"
          error={errors.fullName}
        />

        <TextField
          label="CPF"
          required
          inputMode="numeric"
          value={form.CPF}
          onChange={(value) => update("CPF", maskCPF(value))}
          placeholder="000.000.000-00"
          error={errors.CPF}
        />

        <TextField
          label="Cartão SUS"
          inputMode="numeric"
          value={form.susNumber}
          onChange={(value) => update("susNumber", maskSUS(value))}
          placeholder="000 0000 0000 0000"
          error={errors.susNumber}
        />

        <TextField
          label="Data de nascimento"
          type="date"
          max={new Date().toISOString().slice(0, 10)}
          value={form.birthDate}
          onChange={(value) => update("birthDate", value)}
          error={errors.birthDate}
        />

        <TextField
          label="Telefone"
          type="tel"
          value={form.telephoneNumber}
          onChange={(value) => update("telephoneNumber", maskPhone(value))}
          placeholder="(00) 00000-0000"
          error={errors.telephoneNumber}
        />

        <div className={styles.field}>
          <label>Zona</label>

          <Select
            value={form.zone}
            onChange={(value) => update("zone", value)}
            placeholder="Selecione"
            options={ZONAS}
          />

          <ErrorText>{errors.zone}</ErrorText>
        </div>

        <TextField
          label="Endereço"
          value={form.address}
          onChange={(value) => update("address", value)}
          placeholder="Rua, número, bairro"
        />

      </div>
    </StepCard>
  );
}
