import { supabase } from "../config/supabase.js";

// Campos das etapas 3 a 5 (camelCase -> coluna).
// Dependem da migration database/migrations/001_triagem_campos_extras.sql
const EXTRA_FIELDS = {
  deliveryDate: "delivery_date",
  gestationalWeeks: "gestational_weeks",
  deliveryType: "delivery_type",
  hadPrenatal: "had_prenatal",
  collectionPlace: "collection_place",
  hasFreezer: "has_freezer",
  hasGlassJars: "has_glass_jars",
  receivedHygieneGuidance: "received_hygiene_guidance",
  hivResult: "hiv_result",
  syphilisResult: "syphilis_result",
  hepatitisBResult: "hepatitis_b_result",
  hepatitisCResult: "hepatitis_c_result",
  htlvResult: "htlv_result",
};

const withoutUndefined = (row) =>
  Object.fromEntries(Object.entries(row).filter(([, value]) => value !== undefined));

// Converte o payload do front (camelCase) para as colunas da tabela "trials".
// Só inclui as chaves enviadas, para que o update seja parcial.
function toTrialRow(trialData) {
  const {
    fullName,
    CPF,
    susNumber,
    birthDate,
    hasYellowFeverVaccine,
    hasDtpaVaccine,
    smoker,
    alcoholConsumer,
    usesMedication,
    hasBloodTransfusion,
    transfusionDate,
    hasTattoo,
    tattooDate,
    zone,
    address,
    telephoneNumber,
  } = trialData;

  return withoutUndefined({
    full_name: fullName,
    cpf: CPF !== undefined ? (CPF ? CPF.replace(/\D/g, "") : null) : undefined,
    sus_number: susNumber,
    birth_date: birthDate,
    has_yellow_fever_vaccine: hasYellowFeverVaccine,
    has_dtpa_vaccine: hasDtpaVaccine,
    smoker: smoker,
    alcohol_consumer: alcoholConsumer,
    uses_medication: usesMedication !== undefined ? usesMedication || null : undefined,
    has_blood_transfusion: hasBloodTransfusion,
    transfusion_date:
      hasBloodTransfusion !== undefined ? (hasBloodTransfusion ? transfusionDate : null) : undefined,
    has_tattoo: hasTattoo,
    tattoo_date: hasTattoo !== undefined ? (hasTattoo ? tattooDate : null) : undefined,
    zone: zone,
    address: address,
    telephone_number:
      telephoneNumber !== undefined
        ? (telephoneNumber ? telephoneNumber.replace(/\D/g, "") : null)
        : undefined,
  });
}

function toExtraRow(trialData) {
  return withoutUndefined(
    Object.fromEntries(
      Object.entries(EXTRA_FIELDS).map(([key, column]) => [
        column,
        trialData[key] === "" ? null : trialData[key],
      ])
    )
  );
}

// Erro do PostgREST quando a coluna ainda não existe (migration não aplicada)
const isMissingColumn = (error) =>
  error?.code === "PGRST204" || /column/i.test(error?.message || "");

// Salva com os campos extras; se as colunas ainda não existirem, salva sem eles
async function saveWithFallback(query, trialData) {
  const base = toTrialRow(trialData);
  const extras = toExtraRow(trialData);

  let { data, error } = await query({ ...base, ...extras });

  if (error && Object.keys(extras).length && isMissingColumn(error)) {
    ({ data, error } = await query(base));
  }

  if (error) {
    throw new Error(error.message);
  }

  return data[0];
}

export const trialService = {
  async createTrial(trialData) {
    // Toda triagem nova começa aguardando avaliação
    return saveWithFallback(
      (row) => supabase.from("trials").insert([{ ...row, status: "pendente" }]).select(),
      trialData
    );
  },

  async getAllTrials() {
    const { data, error } = await supabase
      .from("trials")
      .select("*");

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async getTrialById(id) {
    const { data, error } = await supabase
      .from("trials")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async updateTrial(id, trialData) {
    return saveWithFallback(
      (row) => supabase.from("trials").update(row).eq("id", id).select(),
      trialData
    );
  },

  // Aprova ou recusa a triagem (status: "aprovada" | "recusada" | "pendente")
  async evaluateTrial(id, { status, rejectionReason, evaluatedBy }) {
    const pending = status === "pendente";

    const { data, error } = await supabase
      .from("trials")
      .update({
        status: status,
        rejection_reason: status === "recusada" ? rejectionReason : null,
        evaluated_by: pending ? null : evaluatedBy || null,
        evaluated_at: pending ? null : new Date().toISOString(),
      })
      .eq("id", id)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return data[0];
  },

  async deleteTrial(id) {
    const { error } = await supabase
      .from("trials")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    return { id };
  },
};
