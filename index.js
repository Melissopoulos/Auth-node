const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

//IMPORT ROUTES
const authRouter = require('./routes/auth');

dotenv.config();


//CONNECT TO DB
mongoose.connect(process.env.DB_CONNECT,
{ 
 useNewUrlParser: true,
 useUnifiedTopology: true 
},
()=>console.log('Connected to DB'));

//MIDDLEWARE
app.use(express.json());

//ROUTES MIDDLEWARE
app.use('/api/user',authRouter);




app.listen(3000, ()=>console.log(' Server Up and running'));