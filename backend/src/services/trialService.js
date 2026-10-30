import { supabase } from "../config/supabase.js";

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

  const row = {
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
  };

  return Object.fromEntries(
    Object.entries(row).filter(([, value]) => value !== undefined)
  );
}

export const trialService = {
  async createTrial(trialData) {
    const { data, error } = await supabase
      .from("trials")
      .insert([toTrialRow(trialData)])
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return data[0];
  },

  async getAllTrials() {
    const { data, error } = await supabase
      .from("trials")
      .select("*")
      .order("created_at", { ascending: false });

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
    const { data, error } = await supabase
      .from("trials")
      .update(toTrialRow(trialData))
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
