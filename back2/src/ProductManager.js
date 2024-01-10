const fs = require('fs');

class ProductManager {
    constructor(filePath = '../products.json') {
        this.products = [];
        this.filePath = filePath;
        this.loadProductsFromFile();
    }

    loadProductsFromFile() {
        try {
            const data = fs.readFileSync(this.filePath, 'utf8');
            this.products = JSON.parse(data);
        } catch (err) {
            this.products = [];
        }
    }

    saveProductsToFile() {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(this.products, null, 2), 'utf8');
            console.log('Productos guardados correctamente en el archivo JSON.');
        } catch (err) {
            console.error('Error al guardar productos en el archivo JSON:', err);
        }
    }

    getProducts() {
        return this.products;
    }

    addProduct(product) {
        const nextId = this.products.length + 1; // Obtener el próximo ID
        const productWithId = { ...product, id: nextId }; // Agregar el ID al producto
        
        this.products.push(productWithId);
        this.saveProductsToFile();
        return 'Producto agregado';
    }
    updateProduct(id, updatedFields) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex !== -1) {
            this.products[productIndex] = { ...this.products[productIndex], ...updatedFields };
            this.saveProductsToFile();
            return 'Producto actualizado';
        }
        return 'No se encontró el producto';
    }

    deleteProduct(id) {
        this.products = this.products.filter(product => product.id != id);
        this.saveProductsToFile();
        return 'Producto eliminado';
    }

    getProductById(pid) {
        const result = this.products.find(prod => prod.id === parseInt(pid));
        if (!result) {
            return 'No existe el producto';
        }
        return result;
    }
}

module.exports = ProductManager;
