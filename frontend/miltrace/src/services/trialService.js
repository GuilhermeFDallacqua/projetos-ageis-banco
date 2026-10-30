import { request } from "./api";

// CRUD de triagens (tabela "trials").
// O payload usa camelCase: fullName, CPF, susNumber, birthDate,
// telephoneNumber, zone, address, hasYellowFeverVaccine, hasDtpaVaccine,
// smoker, alcoholConsumer, usesMedication, hasBloodTransfusion,
// transfusionDate, hasTattoo, tattooDate.
export const trialService = {
  async create(trialData) {
    const { data } = await request("/createTrial", {
      method: "POST",
      body: trialData,
    });

    return data;
  },

  async getAll() {
    const { data } = await request("/getTrials");

    return data;
  },

  async getById(id) {
    const { data } = await request(`/getTrial/${id}`);

    return data;
  },

  async update(id, trialData) {
    const { data } = await request(`/updateTrial/${id}`, {
      method: "PUT",
      body: trialData,
    });

    return data;
  },

  async remove(id) {
    const { data } = await request(`/deleteTrial/${id}`, {
      method: "DELETE",
    });

    return data;
  },
};
