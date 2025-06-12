const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Carga las variables de entorno si no estamos en producción
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// Configuración del SDK de Cloudinary con las variables de entorno
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuración del almacenamiento de Multer para Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'proyectoDaw/productos', // Carpeta en Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'], // Formatos permitidos
        // Opcional: una función para generar un public_id único
        public_id: (req, file) => {
            const fileName = file.originalname.split('.').slice(0, -1).join('.');
            return `${fileName}-${Date.now()}`;
        },
    },
});

// Creación del middleware de Multer configurado para usar el almacenamiento de Cloudinary
const uploader = multer({ storage: storage });

module.exports = uploader; 