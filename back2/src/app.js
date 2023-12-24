const express = require('express');
const ProductManager = require('./ProductManager.js');
const app = express();
const productManager = new ProductManager(); 
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');

app.use(express.json());
app.use('/api/carts', cartsRouter);
app.use('/api/products', productsRouter);

productManager.loadProductsFromFile('products.json'); 


app.get('/', (request, response) => {
    response.send('Bienvenidos a mi primer servidor Express');
});


app.get('/products', (req, res) => {
    const limit = 5; 

    let productsToSend = productManager.getProducts().slice(0, limit); 

    res.send(productsToSend); 
});


app.get('/products/:pid', (req, res) => {
    const productId = req.params.pid; 

    const product = productManager.getProductById(productId); 

    if (product) {
        res.send(product); 
    } else {
        res.status(404).send('Producto no encontrado'); 
    }
});


app.listen(8080, () => {
    console.log('Escuchando en el puerto 8080');
});

