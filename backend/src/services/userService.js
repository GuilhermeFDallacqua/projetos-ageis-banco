import { supabase } from "../config/supabase.js";

export const userService = {
    async createUser(name, password, email, position, telephoneNumber, CPF, dateBirth) {
        const { data: authData, error: authError } = await supabase.auth.signUp({
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
                        date_birth: dateBirth
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

        const { data, error } = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password: password
        });

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }
}