const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio.'],
        trim: true
    },
    primerApellido: {
        type: String,
        required: [true, 'El primer apellido es obligatorio.'],
        trim: true
    },
    segundoApellido: {
        type: String,
        trim: true
    },
    telefono: {
        type: String,
        required: [true, 'El teléfono es obligatorio.'],
        trim: true,
        unique: true ,
        match: [/^\d{9,15}$/, 'Por favor, introduce un número de teléfono válido.']
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio.'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, 'Por favor, introduce un email válido.']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria.'],
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres.']
    },
    tipo: {
        type: String,
        required: true,
        enum: ['usuario', 'admin'],
        default: 'usuario'
    },
    direcciones: [{
        type: String,
        trim: true
    }],
    listaDeseos: [{
        type: Schema.Types.ObjectId,
        ref: 'Producto'
    }],
}, {
    timestamps: true
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;
