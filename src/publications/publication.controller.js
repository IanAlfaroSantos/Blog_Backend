import Publication from "./publication.model.js";
import Categorie from "../categories/categorie.model.js"
import User from "../users/user.model.js"
import { request, response } from "express";

export const savePublication = async (req, res) => {
    try {

        const data = req.body;
        const user = await User.findOne({ username: data.username.toLowerCase() });
        const categorie = await Categorie.findOne({ name: data.name.toLowerCase() });

        if (!user) {
            return res.status(400).json({
                success: false,
                msg: "Usuario no encontrado"
            });
        }

        if (!categorie) {
            return res.status(400).json({
                success: false,
                msg: "Categoría no encontrada"
            });
        }

        const publication = await Publication.create({
            ...data,
            user: user._id,
            username: user.username,
            categorie: categorie._id,
            name: categorie.name
        });

        const publicationDetails = await Publication.findById(publication._id)
            .populate('user', 'username')
            .populate('categorie', 'name');

        const details = {
            detailsPublication: {
                publicationDetails
            }
        }

        res.status(200).json({
            success: true,
            msg: "Publicación guardada con éxito",
            publication,
            details
        });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Error al guardar la publicación",
            error
        });
    }
}

export const getPublications = async (req = request, res = response) => {
    try {

        const { limite = 10, desde = 0 } = req.body;
        const query = { estado: true };

        const [total, publications] = await Promise.all([
            Publication.countDocuments(query),
            Publication.find(query)
           .populate('user', 'username')
           .populate('categorie', 'name')
           .skip(Number(desde))
           .limit(Number(limite))
        ])

        res.status(200).json({
            success: true,
            total,
            publications
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al obtener las publicaciones",
            error
        });
    }
}

export const getPublicationById = async (req, res) => {
    try {

        const { id } = req.params;

        const publication = await Publication.findById(id)
            .populate('user', 'username')
            .populate('categorie', 'name');

        if (publication.estado === false) {
            return res.status(400).json({
                success: false,
                msg: "Esta publicación no está disponible"
            });
        }

        if (!publication) {
            return res.status(404).json({
                success: false,
                msg: "Publicación no encontrada"
            });
        }

        res.status(200).json({
            success: true,
            publication
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al obtener la publicación por ID",
            error
        });
    }
}

export const updatePublication = async (req, res = response) => {
    try {

        const { id } = req.params;
        const { _id, username, ...data } = req.body;
        let { name } = req.body;

        
        if (name) {
            name = name.toLowerCase();
            data.name = name;
        }
        
        const publication = await Publication.findById(id);
        if (!publication) {
            return res.status(400).json({
                success: false,
                msg: "Publicación no encontrada"
            });
        }

        if (publication.estado === false) {
            return res.status(400).json({
                success: false,
                msg: 'Esta publicación no esta disponible'
            })
        }
        
        const user = await User.findOne({ username: username.toLowerCase() });
        if (!user) {
            return res.status(400).json({
                success: false,
                msg: "Usuario no encontrado"
            });
        }
        
        const categorie = await Categorie.findOne({ name });
        if (!categorie) {
            return res.status(400).json({
                success: false,
                msg: "Categoría no encontrada"
            });
        }

        data.categorie = categorie._id;


        if (req.user._id.toString() !== publication.user.toString() && req.user.role !== "ADMIN") {
            return res.status(400).json({
                success: false,
                msg: "No tiene permiso para actualizar una publicación que no es suya"
            });
        }

        await Publication.findByIdAndUpdate(id, data, { new: true });

        const publicationDetails = await Publication.findById(publication._id)
            .populate('user', 'username')
            .populate('categorie', 'name');

        const details = {
            detailsPublication: {
                publicationDetails
            }
        }

        res.status(200).json({
            success: true,
            msg: "Publicación actualizada con éxito",
            details
        });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Error al actualizar la publicación",
            error
        });
    }
}

export const deletePublication = async (req, res = response) => {
    try {

        const { id } = req.params;

        const authenticatedPublication = req.publication;

        const publication = await Publication.findById(id);
        if (!publication) {
            return res.status(400).json({
                success: false,
                msg: "Publicación no encontrada"
            });
        }

        if (req.user.id.toString() !== publication.user.toString() && req.user.role !== "ADMIN") {
            return res.status(400).json({
                success: false,
                msg: "No tiene permiso para eliminar una publicación que no es suya"
            });
        }

        const publicationDelete = await Publication.findByIdAndUpdate(id, { estado: false }, { new: true });

        res.status(200).json({
            success: true,
            msg: "Publicación eliminada con éxito",
            publicationDelete,
            authenticatedPublication
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al eliminar la publicación",
            error
        });
    }
}