// Dados de exemplo no mesmo formato da tabela "trials" do Supabase.
// Substituir por trialService.getAll() / trialService.getById(id) ao conectar.
export const mockTriagens = [
  {
    id: "DOA-0042",
    full_name: "Ana Oliveira",
    cpf: "12345678901",
    sus_number: "898001234567890",
    birth_date: "1994-03-12",
    telephone_number: "11987654321",
    zone: "URBANA",
    address: "Rua das Flores, 120 - Centro",
    has_blood_transfusion: false,
    transfusion_date: null,
    has_tattoo: true,
    tattoo_date: "2021-06-01",
    smoker: false,
    alcohol_consumer: false,
    uses_medication: null,
    has_yellow_fever_vaccine: true,
    has_dtpa_vaccine: true,
    status: "Concluída",
    created_at: "2025-09-22T14:30:00",
  },
  {
    id: "DOA-0108",
    full_name: "Juliana Souza",
    cpf: "98765432100",
    sus_number: "898009876543210",
    birth_date: "1990-11-02",
    telephone_number: "11912345678",
    zone: "RURAL",
    address: "Estrada Velha, km 4",
    has_blood_transfusion: false,
    transfusion_date: null,
    has_tattoo: false,
    tattoo_date: null,
    smoker: false,
    alcohol_consumer: false,
    uses_medication: "Sulfato ferroso",
    has_yellow_fever_vaccine: true,
    has_dtpa_vaccine: false,
    status: "Em andamento",
    created_at: "2025-09-22T11:15:00",
  },
  {
    id: "DOA-0097",
    full_name: "Mariana Costa",
    cpf: "45678912300",
    sus_number: "898004567891230",
    birth_date: "1998-07-25",
    telephone_number: "11998877665",
    zone: "URBANA",
    address: "Av. Brasil, 845 - Jardim América",
    has_blood_transfusion: false,
    transfusion_date: null,
    has_tattoo: false,
    tattoo_date: null,
    smoker: false,
    alcohol_consumer: false,
    uses_medication: null,
    has_yellow_fever_vaccine: true,
    has_dtpa_vaccine: true,
    status: "Concluída",
    created_at: "2025-09-21T16:45:00",
  },
  {
    id: "DOA-0085",
    full_name: "Carolina Lima",
    cpf: "32165498700",
    sus_number: "898003216549870",
    birth_date: "1992-01-30",
    telephone_number: "11955554444",
    zone: "URBANA",
    address: "Rua São João, 33 - Vila Nova",
    has_blood_transfusion: true,
    transfusion_date: "2020-02-01",
    has_tattoo: false,
    tattoo_date: null,
    smoker: false,
    alcohol_consumer: false,
    uses_medication: null,
    has_yellow_fever_vaccine: false,
    has_dtpa_vaccine: true,
    status: "Concluída",
    created_at: "2025-09-21T09:20:00",
  },
];

export function formatCPF(cpf) {
  if (!cpf) return "—";

  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

export function formatPhone(phone) {
  if (!phone) return "—";

  return phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
}

export function formatDate(value) {
  if (!value) return "—";

  return value.slice(0, 10).split("-").reverse().join("/");
}

export function formatTime(value) {
  if (!value) return "—";

  return value.slice(11, 16);
}
