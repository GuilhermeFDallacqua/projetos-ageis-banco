// Estado inicial do formulário de triagem.
// As chaves das etapas 1, 2 e 5 (vacinas) seguem o payload do trialService.
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

  // 3. Gestação e bebê (ainda sem coluna na tabela "trials")
  deliveryDate: "",
  gestationalWeeks: "",
  deliveryType: "",
  hadPrenatal: true,

  // 4. Coleta e armazenamento (ainda sem coluna na tabela "trials")
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

// Monta o objeto esperado por trialService.create / trialService.update
export function buildTrialPayload(form) {
  return {
    fullName: form.fullName,
    CPF: form.CPF,
    susNumber: form.susNumber,
    birthDate: form.birthDate || null,
    telephoneNumber: form.telephoneNumber,
    zone: form.zone,
    address: form.address,
    hasYellowFeverVaccine: form.hasYellowFeverVaccine,
    hasDtpaVaccine: form.hasDtpaVaccine,
    smoker: form.smoker,
    alcoholConsumer: form.alcoholConsumer,
    usesMedication: form.takesMedication ? form.usesMedication : null,
    hasBloodTransfusion: form.hasBloodTransfusion,
    transfusionDate: toDate(form.transfusionMonth, form.transfusionYear),
    hasTattoo: form.hasTattoo,
    tattooDate: toDate(form.tattooMonth, form.tattooYear),
  };
}
