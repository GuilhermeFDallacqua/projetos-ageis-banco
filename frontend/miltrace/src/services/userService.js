import { request } from "./api";

// CRUD de usuários (tabela "users") + login.
// O payload usa camelCase: name, email, password, confirmPassword,
// position, telephoneNumber, CPF, dateBirth.
export const userService = {
  async create(userData) {
    return request("/createUser", {
      method: "POST",
      body: userData,
    });
  },

  async login(email, password) {
    return request("/login", {
      method: "POST",
      body: { email, password },
    });
  },

  async getAll() {
    const { data } = await request("/getUsers");

    return data;
  },

  async getById(id) {
    const { data } = await request(`/getUser/${id}`);

    return data;
  },

  async update(id, userData) {
    const { data } = await request(`/updateUser/${id}`, {
      method: "PUT",
      body: userData,
    });

    return data;
  },

  async remove(id) {
    const { data } = await request(`/deleteUser/${id}`, {
      method: "DELETE",
    });

    return data;
  },
};
