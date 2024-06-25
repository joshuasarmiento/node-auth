import express, {Express, Request, Response } from 'express';
import cors from 'cors';
import { PORT } from "./secrets";
import rootRouter from './routes';
import { PrismaClient } from '@prisma/client';
import { errorMiddleware } from './middlewares/error';

const app = express();
app.use(cors({
    origin: 'http://localhost:5173', // replace with your frontend URL
    credentials: true,
}));

app.use(express.json());

app.use('/api', rootRouter)

app.get('/', (req: Request, res: Response) => {
    res.send('Server is up and running!');
});

export const prisma = new PrismaClient({
    log: ['query']
})

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log("Listening on port " + PORT);
});

