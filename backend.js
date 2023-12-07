class ProductManager {
	constructor(){
		this.products = []
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
			return 'Producto agregado'
			

			
	}
	getProductById(pid){
		const result = this.products.find(prod =>prod.id === pid)
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