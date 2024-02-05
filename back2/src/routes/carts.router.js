const express = require('express');
const router = express.Router();
const CartManager = require('../dao/CartManager.js'); // Asegúrate de tener el archivo CartManager.js con la lógica de gestión de carritos
const { cartModel } = require('../dao/models/cart.model'); // Asegúrate de tener el modelo de carritos creado


router.get('/', async (req, res) => {
    try {
        const carts = await cartModel.find({});
        res.json(carts);
    } catch (error) {
        console.error('Error al obtener carritos:', error);
        res.status(500).json({ error: 'Error al obtener carritos' });
    }
});


router.get('/:cartId', async (req, res) => {
    const { cartId } = req.params;
    try {
        const cart = await cartModel.findById(cartId);
        if (cart) {
            res.json(cart);
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener carrito por ID:', error);
        res.status(500).json({ error: 'Error al obtener carrito por ID' });
    }
});


router.post('/', async (req, res) => {
    try {
        const newCart = await cartModel.create(req.body);
        res.status(201).json(newCart);
    } catch (error) {
        console.error('Error al crear un nuevo carrito:', error);
        res.status(500).json({ error: 'Error al crear un nuevo carrito' });
    }
});


router.post('/:cartId/products/:productId', async (req, res) => {
    const { cartId, productId } = req.params;
    const { quantity } = req.body;

    try {
        const cart = await cartModel.findById(cartId);

        if (cart) {
            cart.products.push({ productId, quantity });
            await cart.save();
            res.json(cart);
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    } catch (error) {
        console.error('Error al agregar un producto al carrito:', error);
        res.status(500).json({ error: 'Error al agregar un producto al carrito' });
    }
});


router.put('/:cartId/products/:productId', async (req, res) => {
    const { cartId, productId } = req.params;
    const { quantity } = req.body;

    try {
        const cart = await cartModel.findById(cartId);

        if (cart) {
            const productIndex = cart.products.findIndex((product) => product.productId == productId);

            if (productIndex !== -1) {
                cart.products[productIndex].quantity = quantity;
                await cart.save();
                res.json(cart);
            } else {
                res.status(404).json({ error: 'Producto no encontrado en el carrito' });
            }
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar la cantidad de un producto en el carrito:', error);
        res.status(500).json({ error: 'Error al actualizar la cantidad de un producto en el carrito' });
    }
});


router.delete('/:cartId/products/:productId', async (req, res) => {
    const { cartId, productId } = req.params;

    try {
        const cart = await cartModel.findById(cartId);

        if (cart) {
            cart.products = cart.products.filter((product) => product.productId != productId);
            await cart.save();
            res.json(cart);
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar un producto del carrito:', error);
        res.status(500).json({ error: 'Error al eliminar un producto del carrito' });
    }
});

router.delete('/:cartId', async (req, res) => {
    const { cartId } = req.params;

    try {
        const result = await CartManager.deleteCart(cartId);

        res.json(result);
    } catch (error) {
        console.error('Error al eliminar el carrito:', error);
        res.status(500).json({ error: 'Error al eliminar el carrito' });
    }
});



module.exports = router;


