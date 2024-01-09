const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ProductManager = require('../ProductManager.js');

const UPLOADS_DIR = path.join(__dirname, '..', 'public', 'uploads');
const productManager = new ProductManager('../products.json');

const upload = multer({ dest: UPLOADS_DIR });

router.get('/', (req, res) => {
    const products = productManager.getProducts();
    res.json(products);
});

router.post('/', upload.single('image'), (req, res) => {
    const { title, description, price, code, stock, status, category } = req.body;
    const image = req.file;

    if (!title || !description || !price || !code || !stock || !status || !category || !image) {
        return res.status(400).send('Faltan campos requeridos');
    }

    const newProduct = {
        id: productManager.getProducts().length + 1,
        title,
        description,
        price,
        code,
        stock,
        status,
        category,
        image: `/uploads/${image.filename}`
    };

    productManager.addProduct(newProduct);
    res.send('Producto agregado');
});

router.put('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const { title, description, price, code, stock, status, category } = req.body;

    if (!title || !description || !price || !code || !stock || !status || !category) {
        return res.status(400).send('Faltan campos requeridos');
    }

    const updatedFields = {
        title,
        description,
        price,
        code,
        stock,
        status,
        category
    };

    const result = productManager.updateProduct(productId, updatedFields);

    res.send(result);
});


router.delete('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);

    const result = productManager.deleteProduct(productId);

    if (result === 'No se encontró el producto') {
        return res.status(404).send('Producto no encontrado');
    }

    res.send('Producto eliminado');
});


module.exports = router;


