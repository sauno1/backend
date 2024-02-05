const { messageModel } = require('./models/chat.model');

class messageManagerDB {
     async loadChats() {
        try {
            return await messageModel.find({}).lean();
        } catch (error) {
            console.error('Error al cargar productos desde la base de datos:', error);
            return [];
        }
    }

     async saveChat(message) {
        try {
            await messageModel.create(message);
            console.log('Producto guardado correctamente en la base de datos.');
        } catch (error) {
            console.error('Error al guardar producto en la base de datos:', error);
        }
    }

     async updateChat(id, updatedFields) {
        try {
            await messageModel.findByIdAndUpdate(id, { $set: updatedFields });
            console.log('Producto actualizado correctamente en la base de datos.');
        } catch (error) {
            console.error('Error al actualizar producto en la base de datos:', error);
        }
    }

    async deleteChat(id) {
        try {
            await messageModel.findByIdAndUpdate({_id:id}, { $set: { isActive: false } });
            console.log('Producto eliminado correctamente de la base de datos.');
        } catch (error) {
            console.error('Error al eliminar producto de la base de datos:', error);
        }
    }

     async getChatById(id) {
        try {
            return await messageModel.findById(id);
        } catch (error) {
            console.error('Error al obtener producto por ID desde la base de datos:', error);
            return null;
        }
    }

 
}

module.exports = messageManagerDB;
