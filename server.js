const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const rutasUsuario = require('./routes/RutasUsuario');
const rutasProducto = require('./routes/RutasProducto');
const rutasPedido = require('./routes/RutasPedido');

const app = express();
const port = process.env.PORT || 3000;

// --- CONFIGURACIÓN DE CORS MEJORADA ---
// Lista de dominios que tienen permiso para hacer peticiones a tu API
const allowedOrigins = [
    'http://localhost:4200',      // Tu frontend en desarrollo
    // IMPORTANTE: Cuando despliegues tu frontend, añade su URL aquí.
    // Por ejemplo: 'https://tu-frontend.vercel.app' 
];

const corsOptions = {
    origin: (origin, callback) => {
        // Si el origen de la petición está en nuestra lista de permitidos, o si
        // la petición no tiene origen (como las de Postman o apps móviles), la permitimos.
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            // Si el origen no está permitido, rechazamos la petición.
            callback(new Error('No permitido por la política de CORS'));
        }
    }
};

// Usa las nuevas opciones de CORS
app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('¡Bienvenido a la API de proyectoDaw');
});

app.use('/api/usuarios', rutasUsuario);
app.use('/api/productos', rutasProducto);
app.use('/api/pedidos', rutasPedido);

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

module.exports = app; // Es buena práctica exportar 'app' para Vercel