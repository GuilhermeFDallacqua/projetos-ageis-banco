import Fastify from "fastify";
import dotenv from "dotenv";
import { userRoutes, trialRoutes } from "./routes/routes.js";

dotenv.config();

const app = Fastify();
const PORT = process.env.PORT;

app.register(userRoutes, trialRoutes);

const start = async() => {
    try {
        await app.listen({ port: PORT, host: '0.0.0.0' });
        console.log(`Servidor iniciado na porta ${PORT}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
}

start();