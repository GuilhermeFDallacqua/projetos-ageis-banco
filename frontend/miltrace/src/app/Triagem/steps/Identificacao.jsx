import { StepCard, TextField, Select } from "../fields";
import { ZONAS } from "../form";
import styles from "../triagem.module.css";

export default function Identificacao({ form, update }) {
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
          value={form.fullName}
          onChange={(value) => update("fullName", value)}
          placeholder="Digite o nome da doadora"
        />

        <TextField
          label="CPF"
          required
          value={form.CPF}
          onChange={(value) => update("CPF", value)}
          placeholder="000.000.000-00"
        />

        <TextField
          label="Cartão SUS"
          value={form.susNumber}
          onChange={(value) => update("susNumber", value)}
          placeholder="000 0000 0000 0000"
        />

        <TextField
          label="Data de nascimento"
          type="date"
          value={form.birthDate}
          onChange={(value) => update("birthDate", value)}
        />

        <TextField
          label="Telefone"
          type="tel"
          value={form.telephoneNumber}
          onChange={(value) => update("telephoneNumber", value)}
          placeholder="(00) 00000-0000"
        />

        <div className={styles.field}>
          <label>Zona</label>

          <Select
            value={form.zone}
            onChange={(value) => update("zone", value)}
            placeholder="Selecione"
            options={ZONAS}
          />
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
