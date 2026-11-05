import { userService } from "../services/userService.js";
import { trialService } from "../services/trialService.js";

export async function userRoutes(fastify, options) {
    fastify.post('/createUser', async (req, res) => {
        const { name, password, confirmPassword, email, position, telephoneNumber, CPF, dateBirth, typeUser } = req.body;

        try {
            if (password !== confirmPassword) {
                return res.status(400).send({ error: 'As senhas não coincidem.' });
            }
            const user = await userService.createUser(name, password, email, position, telephoneNumber, CPF, dateBirth, typeUser);
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

    fastify.get('/getUsers', async (req, res) => {
        try {
            const users = await userService.getAllUsers();
            return res.status(200).send({ data: users });
        } catch (err) {
            return res.status(400).send({ error: err.message });
        }
    });

    fastify.get('/getUser/:id', async (req, res) => {
        try {
            const user = await userService.getUserById(req.params.id);
            return res.status(200).send({ data: user });
        } catch (err) {
            return res.status(404).send({ error: err.message });
        }
    });

    fastify.put('/updateUser/:id', async (req, res) => {
        try {
            const updatedUser = await userService.updateUser(req.params.id, req.body);
            return res.status(200).send({
                message: 'Usuário atualizado.',
                data: updatedUser
            });
        } catch (err) {
            return res.status(400).send({ error: err.message });
        }
    });

    fastify.delete('/deleteUser/:id', async (req, res) => {
        try {
            const deletedUser = await userService.deleteUser(req.params.id);
            return res.status(200).send({
                message: 'Usuário removido.',
                data: deletedUser
            });
        } catch (err) {
            return res.status(400).send({ error: err.message });
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

    fastify.get('/getTrials', async (req, res) => {
        try {
            const trials = await trialService.getAllTrials();
            return res.status(200).send({ data: trials });
        } catch (err) {
            return res.status(400).send({ error: err.message });
        }
    });

    fastify.get('/getTrial/:id', async (req, res) => {
        try {
            const trial = await trialService.getTrialById(req.params.id);
            return res.status(200).send({ data: trial });
        } catch (err) {
            return res.status(404).send({ error: err.message });
        }
    });

    fastify.put('/updateTrial/:id', async (req, res) => {
        try {
            const updatedTrial = await trialService.updateTrial(req.params.id, req.body);
            return res.status(200).send({
                message: 'Triagem atualizada.',
                data: updatedTrial
            });
        } catch (err) {
            return res.status(400).send({ error: err.message });
        }
    });

    fastify.put('/evaluateTrial/:id', async (req, res) => {
        try {
            const { status } = req.body;

            if (!['pendente', 'aprovada', 'recusada'].includes(status)) {
                return res.status(400).send({ error: 'Status inválido.' });
            }

            if (status === 'recusada' && !req.body.rejectionReason) {
                return res.status(400).send({ error: 'Informe o motivo da recusa.' });
            }

            const evaluatedTrial = await trialService.evaluateTrial(req.params.id, req.body);
            return res.status(200).send({
                message: 'Triagem avaliada.',
                data: evaluatedTrial
            });
        } catch (err) {
            return res.status(400).send({ error: err.message });
        }
    });

    fastify.delete('/deleteTrial/:id', async (req, res) => {
        try {
            const deletedTrial = await trialService.deleteTrial(req.params.id);
            return res.status(200).send({
                message: 'Triagem removida.',
                data: deletedTrial
            });
        } catch (err) {
            return res.status(400).send({ error: err.message });
        }
    });
}
