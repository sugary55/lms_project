import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connect_DB from './config/database.js';
import user from './routes/USER.js';
import course  from "./routes/COURSES.js" 

dotenv.config();
const app = express();
const port = process.env.PORT||8000;

app.use(cors());
app.use(express.json());

connect_DB();

app.use('/api/user',user);
app.use('/api/course',course);
app.get('/api/test',(req,res)=>{
  res.json({message:"hello from backend"});
})

app.listen(port,()=>{
  console.log(`server is running port${port}`);
  console.log(`http://localhost:${port}`);
})