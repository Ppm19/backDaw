const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const rutasUsuario = require('./routes/RutasUsuario');
const rutasProducto = require('./routes/RutasProducto');
const rutasPedido = require('./routes/RutasPedido');
const rutasUpload = require('./routes/RutasUpload');

const app = express();
const port = process.env.PORT || 3000;

const allowedOrigins = [
    'http://localhost:4200',
];

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por la política de CORS'));
        }
    }
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('¡Bienvenido a la API de proyectoDaw');
});

app.use('/api/usuarios', rutasUsuario);
app.use('/api/productos', rutasProducto);
app.use('/api/pedidos', rutasPedido);
app.use('/api/upload', rutasUpload);

async function startServer() {
    try {
        await connectDB(); 
        app.listen(port, () => {
            console.log(`Servidor escuchando en http://localhost:${port}`);
        });
    } catch (error) {
        console.error("Error al iniciar el servidor:", error);
    }
}

startServer();

module.exports = app;