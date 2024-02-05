const mongoose = require('mongoose');

const cartsCollection = 'carts';

const cartSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
            quantity: { type: String, default: 1 }
        }
    ],
    isActive: { type: Boolean, default: true }
});

const cartModel = mongoose.model(cartsCollection, cartSchema);

module.exports = { cartModel };
