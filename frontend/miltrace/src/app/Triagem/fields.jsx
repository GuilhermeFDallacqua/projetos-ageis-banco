import { ChevronDown } from "lucide-react";

import styles from "./triagem.module.css";

export const MESES = [
  { value: "01", label: "Janeiro" },
  { value: "02", label: "Fevereiro" },
  { value: "03", label: "Março" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Maio" },
  { value: "06", label: "Junho" },
  { value: "07", label: "Julho" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Setembro" },
  { value: "10", label: "Outubro" },
  { value: "11", label: "Novembro" },
  { value: "12", label: "Dezembro" },
];

const ANO_ATUAL = new Date().getFullYear();
export const ANOS = Array.from({ length: 30 }, (_, i) => String(ANO_ATUAL - i));

export function StepCard({ title, description, children }) {
  return (
    <section className={styles.card}>

      <div className={styles.cardHeader}>
        <h2>{title}</h2>

        <p>{description}</p>
      </div>

      <div className={styles.divider}></div>

      {children}

    </section>
  );
}

export function Question({ number, text, children }) {
  return (
    <div className={styles.question}>
      <h3>
        <span>{number}</span> {text}
      </h3>

      {children}
    </div>
  );
}

export function RadioButton({
  label,
  selected,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${styles.radioButton} ${
        selected ? styles.radioSelected : ""
      }`}
    >
      <span className={styles.radioCircle}>
        {selected && <span />}
      </span>

      {label}
    </button>
  );
}

// Grupo de opções. "options" é uma lista de { value, label }.
export function OptionGroup({ options, value, onChange }) {
  return (
    <div className={styles.options}>
      {options.map((option) => (
        <RadioButton
          key={String(option.value)}
          label={option.label}
          selected={value === option.value}
          onClick={() => onChange(option.value)}
        />
      ))}
    </div>
  );
}

// Pergunta de Sim/Não com valor booleano
export function YesNo({ value, onChange }) {
  return (
    <OptionGroup
      options={[
        { value: false, label: "Não" },
        { value: true, label: "Sim" },
      ]}
      value={value}
      onChange={onChange}
    />
  );
}

export function ErrorText({ children }) {
  if (!children) return null;

  return <span className={styles.errorText}>{children}</span>;
}

export function TextField({
  label,
  required,
  type = "text",
  value,
  onChange,
  placeholder,
  full,
  error,
  ...inputProps
}) {
  return (
    <div
      className={`${styles.field} ${full ? styles.fieldFull : ""} ${
        error ? styles.fieldInvalid : ""
      }`}
    >
      <label>
        {label}
        {required && <span className={styles.required}> *</span>}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={!!error}
        {...inputProps}
      />

      <ErrorText>{error}</ErrorText>
    </div>
  );
}

export function Select({ value, onChange, placeholder, options }) {
  return (
    <div className={styles.selectWrapper}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <ChevronDown size={14} />
    </div>
  );
}

export function MonthYearSelect({
  label,
  month,
  year,
  onMonthChange,
  onYearChange,
  error,
}) {
  return (
    <div className={`${styles.extraBox} ${error ? styles.fieldInvalid : ""}`}>

      <label>{label}</label>

      <div className={styles.selectRow}>

        <Select
          value={month}
          onChange={onMonthChange}
          placeholder="Mês"
          options={MESES}
        />

        <Select
          value={year}
          onChange={onYearChange}
          placeholder="Ano"
          options={ANOS.map((ano) => ({ value: ano, label: ano }))}
        />

      </div>

      <ErrorText>{error}</ErrorText>
    </div>
  );
}
