const express = require('express');
const router = express.Router();
const fs = require('fs');
const multer = require('multer');
const path = require('path');

const PRODUCTS_FILE = path.join(__dirname, 'products.json'); 
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads'); 

const upload = multer({ dest: UPLOADS_DIR }); 


const readProductsData = () => {
    try {
        const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};


const saveProductsData = (data) => {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(data, null, 2), 'utf8');
};


router.get('/', (req, res) => {
    const products = readProductsData();
    res.json(products);
});


router.get('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const products = readProductsData();
    const product = products.find(product => product.id === productId);

    if (product) {
        res.json(product);
    } else {
        res.status(404).send('Producto no encontrado');
    }
});


router.post('/', upload.single('image'), (req, res) => {
    const { title, description, price, code, stock, status, category } = req.body;
    const image = req.file;

    if (!title || !description || !price || !code || !stock || !status || !category || !image) {
        return res.status(400).send('Faltan campos requeridos');
    }

    const imagePath = image.path; 
    const newImageName = `${Date.now()}_${image.originalname}`; 


    const absoluteImagePath = path.join(UPLOADS_DIR, newImageName);


    fs.renameSync(imagePath, absoluteImagePath);

    const newProduct = {
        id: readProductsData().length + 1, 
        title,
        description,
        price,
        code,
        stock,
        status,
        category,
        image: `/uploads/${newImageName}` 
    };

    const products = readProductsData();
    products.push(newProduct);

    saveProductsData(products);
    res.send('Producto agregado');
});


router.put('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const { title, description, price, code, stock, status, category } = req.body;

    if (!title || !description || !price || !code || !stock || !status || !category) {
        return res.status(400).send('Faltan campos requeridos');
    }

    const products = readProductsData();
    const productIndex = products.findIndex(product => product.id === productId);

    if (productIndex === -1) {
        return res.status(404).send('Producto no encontrado');
    }

    products[productIndex] = {
        ...products[productIndex],
        title,
        description,
        price,
        code,
        stock,
        status,
        category
        
    };

    saveProductsData(products);
    res.send('Producto actualizado');
});


router.delete('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);

    const products = readProductsData();
    const updatedProducts = products.filter(product => product.id !== productId);

    if (products.length === updatedProducts.length) {
        return res.status(404).send('Producto no encontrado');
    }

    saveProductsData(updatedProducts);
    res.send('Producto eliminado');
});

module.exports = router;

