const mongoose = require('mongoose')

const productsCollection = 'products'

const productsSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: String,
    code: String,
    stock: String,
    status: String,
    category: String,
    isActive: { type: Boolean, default: true }
})

const productModel = mongoose.model(productsCollection, productsSchema)

module.exports = {productModel}