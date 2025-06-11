const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productoSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del producto es obligatorio.'],
        trim: true
    },
    marca: {
        type: String,
        required: [true, 'La marca del producto es obligatoria.'],
        trim: true
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción del producto es obligatoria.'],
        trim: true
    },
    especificaciones: [{
        type: String,
        trim: true
    }],
    precio: {
        type: Number,
        required: [true, 'El precio del producto es obligatorio.'],
        min: [0.01, 'El precio debe ser un valor positivo.']
    },
    stock: {
        type: Number,
        required: [true, 'El stock del producto es obligatorio.'],
        min: [0, 'El stock no puede ser negativo.'],
        default: 0,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} no es un valor entero para el stock.'
        }
    },
    imagenes: [{
        type: String,
        trim: true
    }],
    categoria: {
        type: String,
        required: [true, 'La categoría del producto es obligatoria.'],
        trim: true,
        enum: {
            values: ['movil', 'cargador', 'auriculares', 'bateriaPortatil'],
            message: '{VALUE} no es una categoría válida.'
        }
    },
    estadoProducto: {
        type: String,
        required: [true, 'El estado del producto es obligatorio.'],
        trim: true,
        enum: {
            values: [
                'Nuevo',
                'Seminuevo - Como nuevo',
                'Usado - Con detalles'
            ],
            message: '{VALUE} no es un estado válido para el producto.'
        }
    }
}, {
    timestamps: true
});

const Producto = mongoose.model('Producto', productoSchema);

module.exports = Producto;
