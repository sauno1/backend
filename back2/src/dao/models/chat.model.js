const mongoose = require('mongoose')

const messagesCollection = 'messages'

const messagesSchema = new mongoose.Schema({
    mail: {
        type: String,
        required: true,
        unique: true, 
    },
    message: String,
    isActive: { type: Boolean, default: true }
})

const messageModel = mongoose.model(messagesCollection, messagesSchema)

module.exports = {messageModel}