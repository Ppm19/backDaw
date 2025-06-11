const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const rutasUsuario = require('./routes/RutasUsuario');
const rutasProducto = require('./routes/RutasProducto');
const rutasPedido = require('./routes/RutasPedido');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
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