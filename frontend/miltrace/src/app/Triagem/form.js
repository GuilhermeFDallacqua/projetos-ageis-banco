import {
  onlyDigits,
  maskCPF,
  maskPhone,
  maskSUS,
  isValidCPF,
} from "@/utils/format";

// Estado inicial do formulário de triagem.
// As chaves seguem o payload do trialService.
export const initialForm = {
  // 1. Identificação
  fullName: "",
  CPF: "",
  susNumber: "",
  birthDate: "",
  telephoneNumber: "",
  zone: "",
  address: "",

  // 2. Saúde e hábitos
  hasBloodTransfusion: false,
  transfusionMonth: "",
  transfusionYear: "",
  hasTattoo: false,
  tattooMonth: "",
  tattooYear: "",
  smoker: false,
  alcoholConsumer: false,
  takesMedication: false,
  usesMedication: "",

  // 3. Gestação e bebê
  deliveryDate: "",
  gestationalWeeks: "",
  deliveryType: "",
  hadPrenatal: true,

  // 4. Coleta e armazenamento
  collectionPlace: "",
  hasFreezer: true,
  hasGlassJars: true,
  receivedHygieneGuidance: false,

  // 5. Sorologia e vacinação
  hivResult: "",
  syphilisResult: "",
  hepatitisBResult: "",
  hepatitisCResult: "",
  htlvResult: "",
  hasYellowFeverVaccine: false,
  hasDtpaVaccine: false,
};

export const ZONAS = [
  { value: "URBANA", label: "Urbana" },
  { value: "RURAL", label: "Rural" },
];

export const TIPOS_PARTO = [
  { value: "NORMAL", label: "Normal" },
  { value: "CESAREA", label: "Cesárea" },
];

export const LOCAIS_COLETA = [
  { value: "DOMICILIAR", label: "Domiciliar" },
  { value: "BANCO", label: "No banco de leite" },
];

export const RESULTADOS_EXAME = [
  { value: "NEGATIVO", label: "Negativo" },
  { value: "POSITIVO", label: "Positivo" },
  { value: "NAO_REALIZADO", label: "Não realizado" },
];

function toDate(month, year) {
  return month && year ? `${year}-${month}-01` : null;
}

const today = () => new Date().toISOString().slice(0, 10);

// Valida a etapa atual; retorna { campo: mensagem }
export function validateStep(step, form) {
  const errors = {};

  if (step === 0) {
    if (!form.fullName.trim()) errors.fullName = "Informe o nome da doadora.";
    if (!isValidCPF(form.CPF)) errors.CPF = "Informe um CPF válido.";
    if (form.birthDate && form.birthDate > today()) {
      errors.birthDate = "A data não pode ser futura.";
    }
    if (form.telephoneNumber && onlyDigits(form.telephoneNumber).length < 10) {
      errors.telephoneNumber = "Telefone incompleto.";
    }
    if (form.susNumber && onlyDigits(form.susNumber).length !== 15) {
      errors.susNumber = "O cartão SUS tem 15 dígitos.";
    }
  }

  if (step === 1) {
    if (form.hasBloodTransfusion && !(form.transfusionMonth && form.transfusionYear)) {
      errors.transfusion = "Informe o mês e o ano da transfusão.";
    }
    if (form.hasTattoo && !(form.tattooMonth && form.tattooYear)) {
      errors.tattoo = "Informe o mês e o ano da tatuagem.";
    }
    if (form.takesMedication && !form.usesMedication.trim()) {
      errors.usesMedication = "Informe o medicamento.";
    }
  }

  if (step === 2) {
    if (form.deliveryDate && form.deliveryDate > today()) {
      errors.deliveryDate = "A data não pode ser futura.";
    }
    if (
      form.gestationalWeeks &&
      (Number(form.gestationalWeeks) < 20 || Number(form.gestationalWeeks) > 45)
    ) {
      errors.gestationalWeeks = "Informe entre 20 e 45 semanas.";
    }
  }

  return errors;
}

// Monta o objeto esperado por trialService.create / trialService.update
export function buildTrialPayload(form) {
  return {
    fullName: form.fullName.trim(),
    CPF: onlyDigits(form.CPF),
    susNumber: onlyDigits(form.susNumber) || null,
    birthDate: form.birthDate || null,
    telephoneNumber: onlyDigits(form.telephoneNumber) || null,
    zone: form.zone || null,
    address: form.address.trim() || null,
    hasYellowFeverVaccine: form.hasYellowFeverVaccine,
    hasDtpaVaccine: form.hasDtpaVaccine,
    smoker: form.smoker,
    alcoholConsumer: form.alcoholConsumer,
    usesMedication: form.takesMedication ? form.usesMedication.trim() : null,
    hasBloodTransfusion: form.hasBloodTransfusion,
    transfusionDate: toDate(form.transfusionMonth, form.transfusionYear),
    hasTattoo: form.hasTattoo,
    tattooDate: toDate(form.tattooMonth, form.tattooYear),

    deliveryDate: form.deliveryDate || null,
    gestationalWeeks: form.gestationalWeeks ? Number(form.gestationalWeeks) : null,
    deliveryType: form.deliveryType || null,
    hadPrenatal: form.hadPrenatal,
    collectionPlace: form.collectionPlace || null,
    hasFreezer: form.hasFreezer,
    hasGlassJars: form.hasGlassJars,
    receivedHygieneGuidance: form.receivedHygieneGuidance,
    hivResult: form.hivResult || null,
    syphilisResult: form.syphilisResult || null,
    hepatitisBResult: form.hepatitisBResult || null,
    hepatitisCResult: form.hepatitisCResult || null,
    htlvResult: form.htlvResult || null,
  };
}

const dateOnly = (value) => (value ? String(value).slice(0, 10) : "");
const monthOf = (value) => (value ? String(value).slice(5, 7) : "");
const yearOf = (value) => (value ? String(value).slice(0, 4) : "");
const orDefault = (value, fallback) =>
  value === null || value === undefined ? fallback : value;

// Dados de identificação de uma triagem existente (nova triagem da mesma doadora)
export function donorToForm(row) {
  return {
    ...initialForm,
    fullName: row.full_name || "",
    CPF: maskCPF(row.cpf || ""),
    susNumber: maskSUS(row.sus_number || ""),
    birthDate: dateOnly(row.birth_date),
    telephoneNumber: maskPhone(row.telephone_number || ""),
    zone: row.zone || "",
    address: row.address || "",
  };
}

// Triagem existente completa (edição)
export function trialToForm(row) {
  return {
    ...donorToForm(row),

    hasBloodTransfusion: !!row.has_blood_transfusion,
    transfusionMonth: monthOf(row.transfusion_date),
    transfusionYear: yearOf(row.transfusion_date),
    hasTattoo: !!row.has_tattoo,
    tattooMonth: monthOf(row.tattoo_date),
    tattooYear: yearOf(row.tattoo_date),
    smoker: !!row.smoker,
    alcoholConsumer: !!row.alcohol_consumer,
    takesMedication: !!row.uses_medication,
    usesMedication: row.uses_medication || "",

    deliveryDate: dateOnly(row.delivery_date),
    gestationalWeeks: row.gestational_weeks ? String(row.gestational_weeks) : "",
    deliveryType: row.delivery_type || "",
    hadPrenatal: orDefault(row.had_prenatal, true),
    collectionPlace: row.collection_place || "",
    hasFreezer: orDefault(row.has_freezer, true),
    hasGlassJars: orDefault(row.has_glass_jars, true),
    receivedHygieneGuidance: orDefault(row.received_hygiene_guidance, false),
    hivResult: row.hiv_result || "",
    syphilisResult: row.syphilis_result || "",
    hepatitisBResult: row.hepatitis_b_result || "",
    hepatitisCResult: row.hepatitis_c_result || "",
    htlvResult: row.htlv_result || "",
    hasYellowFeverVaccine: !!row.has_yellow_fever_vaccine,
    hasDtpaVaccine: !!row.has_dtpa_vaccine,
  };
}
