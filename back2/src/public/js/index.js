const socket = io(); // Crear conexión al servidor

const productForm = document.getElementById('productForm');
const productList = document.getElementById('productList');

// Enviar los datos del formulario al servidor cuando se envía
productForm.addEventListener('submit', event => {
    event.preventDefault();
    
    const formData = new FormData(productForm);
    const productData = {};
    
    formData.forEach((value, key) => {
        productData[key] = value;
    });
    
    socket.emit('addProduct', productData);
    productForm.reset();
});

// Recibir actualizaciones de productos desde el servidor y actualizar la lista
socket.on('productsUpdated', products => {
    productList.innerHTML = '';
    products.forEach(product => {
        const li = document.createElement('li');
        li.textContent = `${product.title} - ${product.description}`;
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.classList.add('deleteProduct');
        deleteButton.dataset.id = product.id;
        
        li.appendChild(deleteButton);
        productList.appendChild(li);
    });
});

// Manejar la solicitud de eliminar producto
document.addEventListener('click', event => {
    if (event.target.classList.contains('deleteProduct')) {
        const productId = event.target.dataset.id;
        socket.emit('deleteProduct', productId);
    }
});




