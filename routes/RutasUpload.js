const express = require('express');
const router = express.Router();
const uploader = require('../config/cloudinary');

/**
 * @route POST /api/upload/producto
 * @desc Sube una imagen de producto a Cloudinary
 * @access Public (o protegido si se añade autenticación)
 */
router.post('/producto', uploader.single('imagen'), (req, res) => {
    // 'imagen' es el nombre del campo en el formulario multipart/form-data

    if (!req.file) {
        return res.status(400).json({ 
            success: false, 
            message: 'Error: No se ha subido ningún archivo.' 
        });
    }

    try {
        // Multer, gracias a multer-storage-cloudinary, ya ha subido el archivo.
        // La información, incluida la URL, está en req.file.
        res.status(201).json({
            success: true,
            message: 'Imagen subida exitosamente',
            imageUrl: req.file.path // 'path' contiene la URL segura de la imagen en Cloudinary
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error en el servidor al subir la imagen.',
            error: error.message
        });
    }
});

module.exports = router; 