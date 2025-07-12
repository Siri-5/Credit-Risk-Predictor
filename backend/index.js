// console.log("Hello from the backend!");

import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';

//filessss....
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import creditStatusRoutes from './routes/creditStatusRoutes.js'; // Import the credit status routes


//configurationnn!!!
dotenv.config();
connectDB(); //connect to the database

const app = express();



//middlewares...
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const PORT = process.env.PORT || 3000;



//Routesss
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/credit-status', creditStatusRoutes); // Add this line to include the credit status routes

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});