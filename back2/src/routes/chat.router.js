const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const messageManagerDB = require('../dao/messageManagerDb.js');
const messageManager = new messageManagerDB();

const UPLOADS_DIR = path.join(__dirname, '..', 'public', 'uploads');
const upload = multer({ dest: UPLOADS_DIR });


router.get('/view', async (req, res) => {
    try {
        const messages = await messageManager.loadChats();
        res.render('chat', { messages });
    } catch (error) {
        console.error('Error al obtener mensajes desde la base de datos:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Ruta api
router.get('/', async (req, res) => {
    try {
        const messages = await messageManager.loadChats();
        res.json(messages);
    } catch (error) {
        console.error('Error al obtener mensajes desde la base de datos:', error);
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const messageId = req.params.pid;
        const message = await messageManager.getChatById(messageId);

        if (!message) {
            return res.status(404).send('Mensaje no encontrado');
        }

        res.json(message);
    } catch (error) {
        console.error('Error al obtener mensaje por ID desde la base de datos:', error);
        res.status(500).send('Error interno del servidor');
    }
});

router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { mail, message} = req.body;

        if (!mail || !message) {
            return res.status(400).send('Faltan campos requeridos');
        }

        const newMessage = {
            mail,
            message
        };

        await messageManager.saveChat(newMessage);
        res.send('Mensaje agregado');
    } catch (error) {
        console.error('Error al agregar mensaje a la base de datos:', error);
        res.status(500).send('Error interno del servidor');
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const messageId = req.params.pid;
        const { mail, message } = req.body;

        if (!mail || !message) {
            return res.status(400).send('Faltan campos requeridos');
        }

        const updatedFields = {
            mail,
            message
        };

        await messageManager.updateChat(messageId, updatedFields);
        res.send('Mensaje actualizado');
    } catch (error) {
        console.error('Error al actualizar mensaje en la base de datos:', error);
        res.status(500).send('Error interno del servidor');
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const messageId = req.params.pid;
        await messageManager.deleteChat(messageId);
        res.send('Mensaje eliminado');
    } catch (error) {
        console.error('Error al eliminar mensaje de la base de datos:', error);
        res.status(500).send('Error interno del servidor');
    }
});

module.exports = router;
