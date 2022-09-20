
const express = require('express');
const { dbConnection } = require('./database/config');
require('dotenv').config();
const cors = require('cors');



//crear servidor de express

const app = express();

//Database
dbConnection()

//CORS
app.use(cors());

//Directorio Public
app.use( express.static('public') );

//Lectura del body
app.use( express.json() );

//Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

//TODO: CRUD: Eventos


//Escuchando peticiones


app.listen( process.env.PORT , ()=>{
    console.log(`Servidor corriedo en puerto: ${ process.env.PORT }`)
} );