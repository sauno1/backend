const { Server: ServerIO } = require('socket.io')
const express = require('express');
const ProductManager = require('./ProductManager.js');
const app = express();
const productManager = new ProductManager(); 
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const handlebars = require('express-handlebars')

const fs = require('fs');


app.use(express.static(__dirname+'/public'))
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname+'/views')
app.set('view engine', 'handlebars')

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use('/api/carts', cartsRouter);
app.use('/api/products', productsRouter);


productManager.loadProductsFromFile('products.json'); 


app.get('/', (req, res) => {
   res.render('index', { products: productManager.getProducts() });
});

app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { products: productManager.getProducts() });
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


const httpServer = app.listen(8080, () => {
    console.log('Escuchando en el puerto 8080');
});

const socketServer = new ServerIO(httpServer)
app.set('socketServer', socketServer);

socketServer.on('connection', socket =>{
    console.log('cliente conectado');

    socket.on('addProduct', formData => {
        const product = processDataFromForm(formData);
        productManager.addProduct(product);
        socketServer.emit('productsUpdated', productManager.getProducts());
    });

    socket.on('deleteProduct', productId => {
        productManager.deleteProduct(productId);
        socketServer.emit('productsUpdated', productManager.getProducts());
    });


    // Agregar más eventos aquí si es necesario

    // Resto de tu código
});
function processDataFromForm(formData) {
 
    return {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        code: formData.code,
        stock: formData.stock,
        status: formData.status,
        category: formData.category,
        
       
    };
}
