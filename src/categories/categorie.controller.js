import Categorie from './categorie.model.js';
import Publication from '../publications/publication.model.js';
import { request, response } from 'express';
import { crearCategoriaSiNoExiste, existeCategoriaById, noCategoriaGeneral, soloAdmin, statusCategoria } from '../helpers/db-validator-categories.js';

export const saveCategorie = async (req, res) => {
    try {
        
        const data = req.body || {};

        await soloAdmin(req);

        const categorie = await Categorie.create({
            name: data.name,
            description: data.description
        });

        res.status(200).json({
            success: true,
            msg: 'Categoría guardada exitosamente',
            categorie
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Error al guardar la categoría',
            error: error.message
        });
    }
}

export const getCategories = async (req = request, res = response) => {
    try {
        
        const { limite = 10, desde = 0 } = req.query || {};
        const query = { estado: true };

        const [ total, categories ] = await Promise.all([
            Categorie.countDocuments(query),
            Categorie.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
        ])

        res.status(200).json({
            success: true,
            total,
            msg: "Categorias obtenidas exitosamente!!",
            categories
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Error al obtener las categorías',
            error: error.message
        });
    }
}

export const getCategorieById = async (req, res) => {
    try {
        
        const { id } = req.params || {};
        await existeCategoriaById(id);

        const categorie = await Categorie.findById(id);
        await statusCategoria(categorie);

        res.status(200).json({
            success: true,
            msg: "Categoria obtenida exitosamente!!",
            categorie
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Error al obtener la categoría',
            error: error.message
        });
    }
}

export const updateCategorie = async (req, res = response) => {
    try {
        
        const { id } = req.params || {};
        const { _id, ...data } = req.body || {};
        
        await existeCategoriaById(id);
        
        const categorie = await Categorie.findById(id);
        await statusCategoria(categorie);
        await soloAdmin(req);
        
        const categorieGeneral = await Categorie.findOne({ name: "general" });
        await noCategoriaGeneral(categorieGeneral, id);

        const updateCategorie = await Categorie.findByIdAndUpdate(id, data, { new: true });
        
        if (categorie.name !== updateCategorie.name) {
            await Publication.updateMany(
                { categorie: id },
                { $set: { name: updateCategorie.name } }
            );
        }

        res.status(200).json({
            success: true,
            msg: 'Categoría actualizada exitosamente!!',
            updateCategorie
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Error al actualizar la categoría',
            error: error.message
        });
    }
}

export const deleteCategorie = async (req, res = response) => {
    try {
        
        const { id } = req.params || {};
        await existeCategoriaById(id);
        await Publication.deleteMany({ categorie: id });

        const categorie = await Categorie.findById(id);
        await soloAdmin(req);
        await statusCategoria(categorie);

        const categorieGeneral = await Categorie.findOne({ name: "general" });
        await noCategoriaGeneral(categorieGeneral);

        const categorieUpdate = await Categorie.findByIdAndUpdate(id, { estado: false }, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Categoría eliminada exitosamente!!',
            categorieUpdate
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Error al eliminar la categoria',
            error: error.message
        })
    }
}

export const restoreCategorie = async (req, res = response) => {
    try {

        const { id } = req.params || {};
        await existeCategoriaById(id);
        await soloAdmin(req);

        const categorie = await Categorie.findByIdAndUpdate(id, { estado: true }, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Categoría restaurada exitosamente!!',
            categorie
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Error al restaurar la categoria',
            error: error.message
        })
    }
}

export const defaultCategorie = async () => {
    try {
        await crearCategoriaSiNoExiste();
    } catch (error) {
        console.log(" ");
        console.error("Error al crear la Categoria General: ", error);
        console.log(" ");
    }
}