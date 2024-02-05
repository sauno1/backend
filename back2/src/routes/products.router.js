const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const ProductManagerDB = require('../dao/productManagerDB.js');

const productManagerDB = new ProductManagerDB();

const UPLOADS_DIR = path.join(__dirname, '..', 'public', 'uploads');
const upload = multer({ dest: UPLOADS_DIR });

router.get('/', async (req, res) => {
    try {
        const products = await productManagerDB.loadProducts();
        res.json(products);
    } catch (error) {
        console.error('Error al obtener productos desde la base de datos:', error);
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await productManagerDB.getProductById(productId);

        if (!product) {
            return res.status(404).send('Producto no encontrado');
        }

        res.json(product);
    } catch (error) {
        console.error('Error al obtener producto por ID desde la base de datos:', error);
        res.status(500).send('Error interno del servidor');
    }
});

router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { title, description, price, code, stock, status, category } = req.body;
        const image = req.file;

        if (!title || !description || !price || !code || !stock || !status || !category) {
            return res.status(400).send('Faltan campos requeridos');
        }

        const newProduct = {
            title,
            description,
            price,
            code,
            stock,
            status,
            category
            //image: `/uploads/${image.filename}`
        };

        await productManagerDB.saveProduct(newProduct);
        res.send('Producto agregado');
    } catch (error) {
        console.error('Error al agregar producto a la base de datos:', error);
        res.status(500).send('Error interno del servidor');
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
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

        await productManagerDB.updateProduct(productId, updatedFields);
        res.send('Producto actualizado');
    } catch (error) {
        console.error('Error al actualizar producto en la base de datos:', error);
        res.status(500).send('Error interno del servidor');
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        await productManagerDB.deleteProduct(productId);
        res.send('Producto desactivado');
    } catch (error) {
        console.error('Error al desactivar producto de la base de datos:', error);
        res.status(500).send('Error interno del servidor');
    }
});
module.exports = router;



