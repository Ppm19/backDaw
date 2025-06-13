const express = require('express');
const router = express.Router();
const Usuario = require('../model/Usuario');
const bcrypt = require('bcryptjs');

router.post('/', async (req, res) => {
    try {
        const nuevoUsuario = new Usuario(req.body);
        await nuevoUsuario.save();
        res.status(201).json({ message: "Usuario creado exitosamente", usuario: nuevoUsuario });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Error al crear el usuario: Ya existe un usuario con ese email o teléfono.", error: error.keyValue });
        }
        res.status(400).json({ message: "Error al crear el usuario", error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los usuarios", error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el usuario", error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado para actualizar" });
        }

        Object.keys(req.body).forEach(key => {
            usuario[key] = req.body[key];
        });

        const usuarioActualizado = await usuario.save();

        res.status(200).json({ message: "Usuario actualizado exitosamente", usuario: usuarioActualizado });
    } catch (error) {
        if (error.code === 11000) {
             return res.status(400).json({ message: "Error al actualizar el usuario: Ya existe un usuario con ese email o teléfono.", error: error.keyValue });
        }
        res.status(400).json({ message: "Error al actualizar el usuario", error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);

        if (!usuarioEliminado) {
            return res.status(404).json({ message: "Usuario no encontrado para eliminar" });
        }
        res.status(200).json({ message: "Usuario eliminado con exito" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el usuario", error: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email y contraseña son requeridos." });
    }

    try {
        const usuario = await Usuario.findOne({ email: email.toLowerCase() });

        if (!usuario) {
            return res.status(401).json({ message: "Credenciales inválidas." });
        }
        
        const esMatch = await bcrypt.compare(password, usuario.password);
        if (!esMatch) {
            return res.status(401).json({ message: "Credenciales inválidas." });
        }

        const usuarioParaDevolver = usuario.toObject();
        delete usuarioParaDevolver.password;

        res.status(200).json({
            message: "Login exitoso",
            usuario: usuarioParaDevolver
        });

    } catch (error) {
        console.error("Error en el login:", error);
        res.status(500).json({ message: "Error interno del servidor durante el login." });
    }
});

module.exports = router;