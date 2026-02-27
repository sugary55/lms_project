import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import errorHandler from './middleware/errorMiddleware.js';
import connect_DB from './config/database.js';
import user from './routes/USER.js';
import course  from "./routes/COURSES.js" 
import helmet from "helmet";
dotenv.config();
const app = express();
const port = process.env.PORT||8000;

app.use(cors());
app.use(express.json());
app.use(helmet());

connect_DB();

app.use('/api/user',user);
app.use('/api/course',course);
app.use(errorHandler);


app.listen(port,()=>{
  console.log(`server is running port${port}`);
  console.log(`http://localhost:${port}`);
})


