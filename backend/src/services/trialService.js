import { supabase } from "../config/supabase.js";

export const trialService = {
  async createTrial(trialData) {
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

    const cleanPhone = telephoneNumber ? telephoneNumber.replace(/\D/g, "") : null;

    const { data, error } = await supabase
      .from("trials")
      .insert([
        {
          full_name: fullName,
          cpf: CPF ? CPF.replace(/\D/g, "") : null,
          sus_number: susNumber,
          birth_date: birthDate,
          has_yellow_fever_vaccine: hasYellowFeverVaccine,
          has_dtpa_vaccine: hasDtpaVaccine,
          smoker: smoker,
          alcohol_consumer: alcoholConsumer,
          uses_medication: usesMedication || null,
          has_blood_transfusion: hasBloodTransfusion,
          transfusion_date: hasBloodTransfusion ? transfusionDate : null,
          has_tattoo: hasTattoo,
          tattoo_date: hasTattoo ? tattooDate : null,
          zone: zone,
          address: address,
          telephone_number: cleanPhone,
        },
      ])
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return data[0];
  },
};