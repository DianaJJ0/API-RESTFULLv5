const mongoose = require('mongoose');
require('dotenv').config();

// Se define una función asíncrona para la conexión
const dbConnection = async () => {
    try {
        // Ahora conectamos usando la URI completa desde .env
        await mongoose.connect(process.env.MONGO_URI);

        console.log('Conexión exitosa a la base de datos');

    } catch (error) {
        console.error('Error de conexión a la base de datos:', error);
        throw new Error('Error al iniciar la base de datos. Ver logs.');
    }
};

// Se exporta la función
module.exports = { dbConnection };