import express, {Express, Request, Response } from 'express';
import cors from 'cors';
import { PORT } from "./secrets";
import rootRouter from './routes';
import { PrismaClient } from '@prisma/client';
import { errorMiddleware } from './middlewares/error';

const checkDB = new PrismaClient();

const app = express();
app.use(cors({
    origin: 'http://localhost:5173', // replace with your frontend URL
    credentials: true,
}));

app.use(express.json());

app.use('/api', rootRouter)

app.get('/', async (req: Request, res: Response) => {
    res.send('Server is up and running!');
});

export const prisma = new PrismaClient({
    log: ['query']
})

app.use(errorMiddleware);

app.listen(PORT, async () => {
    const checkDatabase = await checkDB.user.findMany();

    if(checkDatabase != null) {
        console.log("Prisma is ready");
    }

    console.log("Listening on port " + PORT);
});

