import { userService } from "../services/userService.js";
import { trialService } from "../services/trialService.js";

export async function userRoutes(fastify, options) {
    fastify.post('/createUser', async (req, res) => {
        const { name, password, confirmPassword, email, position, telephoneNumber, CPF, dateBirth } = req.body;

        try {
            //Verifica se ambas as senhas estão identicas
            if (password !== confirmPassword) {
                return res.status(400).send({ error: 'As senhas não coincidem.' });
            }
            const user = await userService.createUser(name, password, email, position, telephoneNumber, CPF, dateBirth);
            return res.status(201).send(user);
        } catch (err) {
            return res.status(400).send({ error: err.message });
        }
    });

    fastify.post('/login', async (req, res) => {
        const { email, password } = req.body;

        try {
            if (!email || !password) {
                return res.status(400).send({ error: 'Email e senha são obrigatórios.'});
            }

            const authData = await userService.loginUser(email, password);
        
            return res.status(200).send({
                message: 'Login realizado com sucesso!',
                user: authData.user,
                token: authData.session.access_token,
                refreshToken: authData.session.refresh_token
            });
        } catch (err) {
            return res.status(401).send({ error: err.message });
        }
    });
};

export async function trialRoutes(fastify, options) {
    fastify.post('/createTrial', async (req, res) => {
        try{
            const trialData = req.body;

            const createdTrial = await trialService.createTrial(trialData);

            return res.status(201).send({
                message: 'Triagem cadastrada.',
                data: createdTrial
            });
        } catch (err) {
            return res.status(400).send({ error: err.message });
        }
    });
}