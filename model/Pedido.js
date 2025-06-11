const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articuloSchema = new Schema({
    productoId: {
        type: Schema.Types.ObjectId,
        ref: 'Producto',
        required: [true, 'El ID del producto es obligatorio.']
    },
    nombreProducto: {
        type: String,
        required: [true, 'El nombre del producto es obligatorio.']
    },
    cantidad: {
        type: Number,
        required: [true, 'La cantidad es obligatoria.'],
        min: [1, 'La cantidad mínima debe ser 1.']
    },
    precioAlComprar: {
        type: Number,
        required: [true, 'El precio al momento de la compra es obligatorio.']
    },
    imagenPrincipal: {
        type: String,
        trim: true
    }
}, { _id: false });

const pedidoSchema = new Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        default: null
    },
    nombreCompletoComprador: {
        type: String,
        required: [true, 'El nombre completo del comprador es obligatorio.'],
        trim: true
    },
    emailComprador: {
        type: String,
        required: [true, 'El email del comprador es obligatorio.'],
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Por favor, introduce un email válido para el comprador.']
    },
    telefonoComprador: {
        type: String,
        required: [true, 'El teléfono del comprador es obligatorio.'],
        trim: true
    },
    direccionEnvio: {
        type: String,
        required: [true, 'La dirección de envío es obligatoria.'],
        trim: true
    },
    articulos: [articuloSchema],
    totalPedido: {
        type: Number,
        required: [true, 'El total del pedido es obligatorio.'],
        min: [0, 'El total del pedido no puede ser negativo.']
    },
    estadoPedido: {
        type: String,
        required: true,
        enum: {
            values: ['Pendiente', 'Aceptado', 'Entregado'],
            message: '{VALUE} no es un estado válido para el pedido.'
        },
        default: 'Pendiente'
    },
    fechaEntrega: {
        type: Date
    }
}, {
    timestamps: true
});

const Pedido = mongoose.model('Pedido', pedidoSchema);

module.exports = Pedido;
