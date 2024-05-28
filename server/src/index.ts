import express from 'express';
import cors from 'cors';
import connectToDatabase from './db';
import boardRoutes from './routes/board';
import { customMiddleware } from './middleware/customMiddleware';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(cors());

app.use(express.json());


app.use(customMiddleware);

app.use('/board', boardRoutes);


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connectToDatabase();
});
