const { cartModel } = require('./models/cart.model'); // Asegúrate de tener el modelo de carritos creado

class CartManager {
    async createCart(userId) {
        try {
            const newCart = await cartModel.create({ userId });
            return newCart;
        } catch (error) {
            console.error('Error al crear un nuevo carrito:', error);
            throw error;
        }
    }

    async getCartById(cartId) {
        try {
            const cart = await cartModel.findById(cartId);
            return cart;
        } catch (error) {
            console.error('Error al obtener carrito por ID:', error);
            throw error;
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const cart = await cartModel.findById(cartId);

            if (cart) {
                cart.products.push({ productId, quantity });
                await cart.save();
                return cart;
            } else {
                throw new Error('Carrito no encontrado');
            }
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            throw error;
        }
    }

    async updateProductQuantity(cartId, productId, newQuantity) {
        try {
            const cart = await cartModel.findById(cartId);

            if (cart) {
                const productIndex = cart.products.findIndex((product) => product.productId == productId);

                if (productIndex !== -1) {
                    cart.products[productIndex].quantity = newQuantity;
                    await cart.save();
                    return cart;
                } else {
                    throw new Error('Producto no encontrado en el carrito');
                }
            } else {
                throw new Error('Carrito no encontrado');
            }
        } catch (error) {
            console.error('Error al actualizar la cantidad de un producto en el carrito:', error);
            throw error;
        }
    }

    async removeProductFromCart(cartId, productId) {
        try {
            const cart = await cartModel.findById(cartId);

            if (cart) {
                cart.products = cart.products.filter((product) => product.productId != productId);
                await cart.save();
                return cart;
            } else {
                throw new Error('Carrito no encontrado');
            }
        } catch (error) {
            console.error('Error al eliminar un producto del carrito:', error);
            throw error;
        }
    }

    async getAllCarts() {
        try {
            const carts = await cartModel.find({});
            return carts;
        } catch (error) {
            console.error('Error al obtener todos los carritos:', error);
            throw error;
        }
    }

    async deleteCart(cartId) {
        try {
            const result = await cartModel.findByIdAndDelete(cartId);

            if (result) {
                return { success: true, message: 'Carrito eliminado correctamente' };
            } else {
                throw new Error('Carrito no encontrado');
            }
        } catch (error) {
            console.error('Error al eliminar el carrito:', error);
            throw error;
        }
    }

}

module.exports = new CartManager;
