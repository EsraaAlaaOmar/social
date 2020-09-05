const express = require('express');
const connectDB = require('./config/db');
const path = require('path')


const app = express();


connectDB();
//init mildware 
app.use(express.json({ extended: false }))

//define Routs
app.use('/api/users', require('./routers/api/user'));
app.use('/api/auth', require('./routers/api/auth'));
app.use('/api/profile', require('./routers/api/profile'));
app.use('/api/posts', require('./routers/api/posts'));
 //serve static assests in production 
 if(process.env.NODE_ENV === 'production'){

    //set static folder
    app.use(express.static('client/build'))
 }
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`esraa + ${{ PORT }}`));
