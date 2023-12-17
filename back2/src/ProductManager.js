const fs = require('fs');

class ProductManager {
	constructor(){
		this.products = [];
		this.filePath = 'products.json';
		this.loadProductsFromFile();
	}
	loadProductsFromFile(){
		try{
			const data = fs.readFileSync(this.filePath, 'utf8');
			this.products = JSON.parse(data);
		} catch (err) {
			this.products = [];
		}
	}
	saveProductsToFile() {
		fs.writeFileSync(this.filePath, JSON.stringify(this.products, null, 2), 'utf8');
	}
	getProducts(){
		return this.products
	}
	addProduct(product){
		if( !product.title ||
			!product.description ||
			!product.price ||
			!product.thumbnail ||
			!product.code ||
			!product.stock){
				return 'Faltan llenar campos de productos'
			}
			const result = this.products.find( prod => prod.code == product.code)
			if (result) {
				return 'Existe el producto con ese código'

			}
			if (this.products.length == 0){
				product.id = 1
			 this.products.push( product )
			}else{
			
				product.id = this.products.length + 1
				this.products.push(product)
			}
			this.saveProductsToFile();
			return 'Producto agregado'
			
	}
	updateProduct(id, UpdatedFields){
		const productIndex = this.products.findIndex(product =>product.id===id);
		if(productIndex === -1) {
			return 'No se encontró el producto';
		}
		this.products[productIndex] = {...this.products[productIndex], ...UpdatedFields};
		this.saveProductsToFile();
		return 'Producto actualizado';
	}
	deleteProduct(id){
		this.products = this.products.filter(product => product.id !== id);
		this.saveProductsToFile();
		return 'Producto eliminado';
	}
	getProductById(pid){
		const result = this.products.find(prod =>prod.id === parseInt(pid))
		if (!result) {
			return 'No existe el producto'
		}
		return result
	}

}

const products = new ProductManager()
console.log(products.addProduct({title:'producto uno' , description:'Este es un producto prueba', price:200, thumbnail:'Sin imagen', code:'abc123', stock:25}))
console.log(products.addProduct({title:'producto dos' , description:'Este es un producto prueba', price:200, thumbnail:'Sin imagen', code:'abc124', stock:25}))
console.log(products.getProducts())
console.log(products.getProductById(3))

module.exports = ProductManager;