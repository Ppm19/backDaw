if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;

if (!uri) {
    console.error("Error: La variable de entorno MONGODB_URI no está definida.");
    process.exit(1);
}

const connectDB = async () => {
    try {
        await mongoose.connect(uri);
        console.log('¡Conectado exitosamente a MongoDB!');
    } catch (error) {
        console.error('No se pudo conectar a MongoDB', error);
        process.exit(1);
    }
};

module.exports = connectDB;