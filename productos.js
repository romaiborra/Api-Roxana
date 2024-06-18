const express = require('express');
const router = express.Router();
const Producto = require('../db/models/Producto'); // Correcta ruta al archivo Producto.js
const { Op } = require('sequelize');

// Crear un nuevo producto
router.post('/productos', async (req, res) => {
    try {
        const producto = await Producto.create(req.body);
        res.status(201).json(producto);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Obtener todos los productos
router.get('/productos', async (req, res) => {
    try {
        const productos = await Producto.findAll();
        res.status(200).json(productos);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Obtener un producto por su id
router.get('/productos/:id', async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.params.id);
        if (producto) {
            res.status(200).json(producto);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Actualizar un producto por su id
router.put('/productos/:id', async (req, res) => {
    try {
        const [updated] = await Producto.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedProducto = await Producto.findByPk(req.params.id);
            res.status(200).json(updatedProducto);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Eliminar un producto por su id
router.delete('/productos/:id', async (req, res) => {
    try {
        const deleted = await Producto.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//Endpoints adicionales
// Obtener una lista de productos ordenada
router.get('/productos/ordenados', async (req, res) => {
    const { criterio } = req.query;
    try {
        const productos = await Producto.findAll({
            order: [[criterio, 'ASC']]
        });
        res.status(200).json(productos);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Obtener una lista de productos filtrada
router.get('/productos/filtrados', async (req, res) => {
    const { precio, categoria } = req.query;
    try {
        const whereClause = {};
        if (precio) whereClause.precio = { [Op.gt]: precio };
        if (categoria) whereClause.categoria = categoria;
        
        const productos = await Producto.findAll({ where: whereClause });
        res.status(200).json(productos);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
