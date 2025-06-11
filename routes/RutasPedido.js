const express = require('express');
const router = express.Router();
const Pedido = require('../model/Pedido');
const Producto = require('../model/Producto');
const Usuario = require('../model/Usuario');

router.post('/', async (req, res) => {
    const {
        usuario,
        nombreCompletoComprador,
        emailComprador,
        telefonoComprador,
        direccionEnvio,
        articulos,
        totalPedido
    } = req.body;

    if (!nombreCompletoComprador || !emailComprador || !telefonoComprador || !direccionEnvio || !articulos || articulos.length === 0 || totalPedido === undefined) {
        return res.status(400).json({ message: "Faltan campos obligatorios para crear el pedido." });
    }

    try {
        for (const item of articulos) {
            const producto = await Producto.findById(item.productoId);
            if (!producto) {
                return res.status(404).json({ message: `Producto con ID ${item.productoId} no encontrado.` });
            }
            if (producto.stock < item.cantidad) {
                return res.status(400).json({ message: `Stock insuficiente para el producto: ${producto.nombre}. Stock disponible: ${producto.stock}, Solicitado: ${item.cantidad}` });
            }
            producto.stock -= item.cantidad;
            await producto.save();
        }

        const nuevoPedido = new Pedido({
            usuario,
            nombreCompletoComprador,
            emailComprador,
            telefonoComprador,
            direccionEnvio,
            articulos,
            totalPedido,
            estadoPedido: 'Pendiente'
        });

        const pedidoGuardado = await nuevoPedido.save();
        res.status(201).json({ message: "Pedido creado exitosamente", pedido: pedidoGuardado });

    } catch (error) {
        if (error.name === 'ValidationError') {
            let errors = {};
            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });
            return res.status(400).json({ message: "Error de validación al crear el pedido", errors });
        }
        console.error("Error al crear pedido:", error);
        res.status(500).json({ message: "Error interno del servidor al crear el pedido", error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const filtro = req.query.estado ? { estadoPedido: req.query.estado } : {};
        if (req.query.usuarioId) {
            filtro.usuario = req.query.usuarioId;
        }

        const pedidos = await Pedido.find(filtro)
            .populate('usuario', 'nombre email')
            .populate('articulos.productoId', 'nombre imagenes')
            .sort({ createdAt: -1 });
        res.status(200).json(pedidos);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los pedidos", error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const pedido = await Pedido.findById(req.params.id)
            .populate('usuario', 'nombre email')
            .populate('articulos.productoId', 'nombre imagenes especificaciones');
        if (!pedido) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }
        res.status(200).json(pedido);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "ID de pedido no válido", error: error.message });
        }
        res.status(500).json({ message: "Error al obtener el pedido", error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    const { estadoPedido, fechaEntrega, usuario } = req.body;

    const actualizacionesPermitidas = {};
    if (estadoPedido) actualizacionesPermitidas.estadoPedido = estadoPedido;
    if (fechaEntrega) actualizacionesPermitidas.fechaEntrega = fechaEntrega;
    if (usuario !== undefined) actualizacionesPermitidas.usuario = usuario;

    if (Object.keys(actualizacionesPermitidas).length === 0) {
        return res.status(400).json({ message: "No se proporcionaron campos válidos para actualizar." });
    }

    try {
        const pedidoActualizado = await Pedido.findByIdAndUpdate(
            req.params.id,
            { $set: actualizacionesPermitidas },
            { new: true, runValidators: true }
        );

        if (!pedidoActualizado) {
            return res.status(404).json({ message: "Pedido no encontrado para actualizar" });
        }
        res.status(200).json({ message: "Pedido actualizado exitosamente", pedido: pedidoActualizado });
    } catch (error) {
        if (error.name === 'ValidationError') {
            let errors = {};
            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });
            return res.status(400).json({ message: "Error de validación al actualizar el pedido", errors });
        }
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "ID de pedido no válido", error: error.message });
        }
        res.status(500).json({ message: "Error al actualizar el pedido", error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const pedido = await Pedido.findById(req.params.id);
        if (!pedido) {
            return res.status(404).json({ message: "Pedido no encontrado para eliminar" });
        }

        if (pedido.estadoPedido !== 'Entregado') {
            for (const item of pedido.articulos) {
                await Producto.findByIdAndUpdate(item.productoId, { $inc: { stock: item.cantidad } });
            }
        }

        const pedidoEliminado = await Pedido.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Pedido eliminado exitosamente" });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "ID de pedido no válido", error: error.message });
        }
        console.error("Error al eliminar pedido:", error);
        res.status(500).json({ message: "Error al eliminar el pedido", error: error.message });
    }
});

module.exports = router;
