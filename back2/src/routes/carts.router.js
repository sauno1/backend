const express = require('express');
const router = express.Router();
const fs = require('fs');

const PRODUCTS_FILE = 'products.json'; 


const readProductsData = () => {
    try {
        const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};


router.post('/', (req, res) => {
    const cartId = Date.now(); 
    const newCart = {
        id: cartId,
        products: []
    };

    const carts = readProductsData(); 
    carts.push(newCart);

    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(carts, null, 2), 'utf8'); 

    res.send(`Carrito creado con ID: ${cartId}`);
});


router.get('/:cid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const carts = readProductsData(); 
    const cart = carts.find(cart => cart.id === cartId);

    if (cart) {
        res.json(cart.products);
    } else {
        res.status(404).send('Carrito no encontrado');
    }
});

router.post('/:cid/product/:pid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const quantity = parseInt(req.body.quantity || 1);

    const carts = readProductsData();
    const cart = carts.find(cart => cart.id === cartId);

    if (cart) {
        const existingProductIndex = cart.products.findIndex(product => product.id === productId);

        if (existingProductIndex !== -1) {
           
            cart.products[existingProductIndex].quantity += quantity;
        } else {
           
            const productToAdd = {
                id: productId,
                quantity: quantity
            };
            cart.products.push(productToAdd);
        }

        fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(carts, null, 2), 'utf8');

        res.send('Producto agregado al carrito');
    } else {
        res.status(404).send('Carrito no encontrado');
    }
});



module.exports = router;


