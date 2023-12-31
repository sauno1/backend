document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    socket.on('productsUpdated', updatedProducts => {
        const productList = document.getElementById('productList');

        productList.innerHTML = '';

        updatedProducts.forEach(product => {
            const listItem = document.createElement('li');
            listItem.textContent = `${product.title} - ${product.description}`;
            productList.appendChild(listItem);
        });
    });

    const productForm = document.getElementById('productForm');

    productForm.addEventListener('submit', event => {
        event.preventDefault();

        const formData = new FormData(productForm);
        const newProductData = {
            title: formData.get('title'),
            description: formData.get('description'),
            price: formData.get('price'),
            code: formData.get('code'),
            stock: formData.get('stock'),
            status: formData.get('status'),
            category: formData.get('category')
        };

        socket.emit('addProduct', newProductData);
    });
});


