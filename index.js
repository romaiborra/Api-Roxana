const express = require('express');
const sequelize = require('./src/config/database'); // Correcta ruta al archivo database.js
const Producto = require('./src/db/models/Producto'); // Correcta ruta al archivo Producto.js
const cors = require('cors');
const morgan = require('morgan');
const productosRouter = require('./src/routes/productos'); // Correcta ruta al archivo productos.js

require('dotenv').config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Rutas
app.use('/api', productosRouter);

// Sincronización de la base de datos
sequelize.sync()
    .then(() => {
        console.log('Base de datos sincronizada');
        app.listen(process.env.PORT, () => {
            console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
        });
    })
    .catch(err => {
        console.error('Error al sincronizar la base de datos:', err);
    });
