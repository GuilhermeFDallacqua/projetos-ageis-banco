import { supabase, createAuthClient } from "../config/supabase.js";

export const userService = {
    async createUser(name, password, email, position, telephoneNumber, CPF, dateBirth, typeUser) {
        const { data: authData, error: authError } = await createAuthClient().auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    display_name: name
                }
            }
        });

        if (authError) {
            throw new Error(authError.message);
        }

        if(authData.user) {
            const { error: profileError } = await supabase
                .from("users")
                .insert([
                    {
                        id: authData.user.id,
                        name: name,
                        email: email,
                        position: position,
                        telephone_number: telephoneNumber,
                        cpf: CPF,
                        date_birth: dateBirth,
                        type_user: typeUser || "comum",
                        status: "ativo"
                    },
                ]);
            
            if (profileError) {
                throw new Error(profileError.message)
            }
        }

        return authData;
    },

    async loginUser(email, password) {
        const cleanEmail = email ? email.trim().toLowerCase() : '';

        const { data, error } = await createAuthClient().auth.signInWithPassword({
            email: cleanEmail,
            password: password
        });

        if (error) {
            throw new Error(error.message);
        }

        return data;
    },

    async getAllUsers() {
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .order("name", { ascending: true });

        if (error) {
            throw new Error(error.message);
        }

        return data;
    },

    async getUserById(id) {
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", id)
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    },

    async updateUser(id, userData) {
        const { name, email, position, telephoneNumber, CPF, dateBirth, typeUser, status } = userData;

        // Só envia os campos informados (update parcial)
        const row = Object.fromEntries(
            Object.entries({
                name: name,
                email: email,
                position: position,
                telephone_number: telephoneNumber,
                cpf: CPF,
                date_birth: dateBirth,
                type_user: typeUser,
                status: status
            }).filter(([, value]) => value !== undefined)
        );

        const { data, error } = await supabase
            .from("users")
            .update(row)
            .eq("id", id)
            .select();

        if (error) {
            throw new Error(error.message);
        }

        return data[0];
    },

    // Remove apenas o perfil da tabela "users".
    // Excluir o usuário do Auth exige a service role key (supabase.auth.admin.deleteUser).
    async deleteUser(id) {
        const { error } = await supabase
            .from("users")
            .delete()
            .eq("id", id);

        if (error) {
            throw new Error(error.message);
        }

        return { id };
    }
}