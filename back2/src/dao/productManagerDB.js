const { productModel } = require('./models/products.model');

class ProductManagerDB {
     async loadProducts() {
        try {
            return await productModel.find({});
        } catch (error) {
            console.error('Error al cargar productos desde la base de datos:', error);
            return [];
        }
    }

     async saveProduct(product) {
        try {
            await productModel.create(product);
            console.log('Producto guardado correctamente en la base de datos.');
        } catch (error) {
            console.error('Error al guardar producto en la base de datos:', error);
        }
    }

     async updateProduct(id, updatedFields) {
        try {
            await productModel.findByIdAndUpdate(id, { $set: updatedFields });
            console.log('Producto actualizado correctamente en la base de datos.');
        } catch (error) {
            console.error('Error al actualizar producto en la base de datos:', error);
        }
    }

    async deleteProduct(id) {
        try {
            await productModel.findByIdAndUpdate({_id:id}, { $set: { isActive: false } });
            console.log('Producto eliminado correctamente de la base de datos.');
        } catch (error) {
            console.error('Error al eliminar producto de la base de datos:', error);
        }
    }

     async getProductById(id) {
        try {
            return await productModel.findById(id);
        } catch (error) {
            console.error('Error al obtener producto por ID desde la base de datos:', error);
            return null;
        }
    }

    
}

module.exports = ProductManagerDB;
