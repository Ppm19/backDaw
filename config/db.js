// Carga las variables de entorno desde .env SOLO si no estamos en producción
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;

const connectDB = async () => {
    // Primero, nos aseguramos de que la variable URI exista.
    if (!uri) {
        // Lanzamos un error claro si no está.
        throw new Error("La variable de entorno MONGODB_URI no está definida o no es accesible.");
    }

    try {
        // Intentamos conectar a la base de datos.
        await mongoose.connect(uri);
        console.log('¡Conectado exitosamente a MongoDB!');
    } catch (error) {
        // Si mongoose.connect falla, registramos el error y lo relanzamos.
        console.error('No se pudo conectar a MongoDB. Error original:', error.message);
        throw new Error('Fallo en la conexión a la base de datos.');
    }
};

module.exports = connectDB;