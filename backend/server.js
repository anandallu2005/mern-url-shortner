import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import urlRoutes from './routes/url.js';
dotenv.config();
const app=express();
app.use(express.json())
app.use(cors({
    origin:process.env.FRONTEND_URL,
    methods:["GET","POST"],
}))

app.use("/",urlRoutes)
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("conected to mongo db");
    app.listen(process.env.PORT,()=>{
        console.log(`server running on port`)
    });
})
.catch((err)=>{
    console.log("error connecting to mongo db",err)
});

