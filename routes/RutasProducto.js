const express = require('express');
const router = express.Router();
const Producto = require('../model/Producto'); // Ajusta la ruta si tu modelo está en otra carpeta

router.post('/', async (req, res) => {
    try {
        const nuevoProducto = new Producto(req.body);
        await nuevoProducto.save();
        res.status(201).json({ message: "Producto creado exitosamente", producto: nuevoProducto });
    } catch (error) {
        // Manejo de errores de validación de Mongoose u otros
        if (error.name === 'ValidationError') {
            let errors = {};
            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });
            return res.status(400).json({ message: "Error de validación al crear el producto", errors });
        }
        res.status(400).json({ message: "Error al crear el producto", error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const productos = await Producto.find();
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los productos", error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.status(200).json(producto);
    } catch (error) {
        // Si el ID no tiene un formato ObjectId válido, Mongoose puede lanzar un CastError
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "ID de producto no válido", error: error.message });
        }
        res.status(500).json({ message: "Error al obtener el producto", error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const productoActualizado = await Producto.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true 
        });
        if (!productoActualizado) {
            return res.status(404).json({ message: "Producto no encontrado para actualizar" });
        }
        res.status(200).json({ message: "Producto actualizado exitosamente", producto: productoActualizado });
    } catch (error) {
        if (error.name === 'ValidationError') {
            let errors = {};
            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });
            return res.status(400).json({ message: "Error de validación al actualizar el producto", errors });
        }
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "ID de producto no válido", error: error.message });
        }
        res.status(400).json({ message: "Error al actualizar el producto", error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const productoEliminado = await Producto.findByIdAndDelete(req.params.id);
        if (!productoEliminado) {
            return res.status(404).json({ message: "Producto no encontrado para eliminar" });
        }
        res.status(200).json({ message: "Producto eliminado exitosamente", producto: productoEliminado });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "ID de producto no válido", error: error.message });
        }
        res.status(500).json({ message: "Error al eliminar el producto", error: error.message });
    }
});

module.exports = router;
