import Publication from "./publication.model.js";
import Categorie from "../categories/categorie.model.js"
import Comment from "../comments/comment.model.js";
import User from "../users/user.model.js"
import Course from "../courses/course.model.js";
import { request, response } from "express";
import { existePublicacionDuplicada, existePublicationById, existeUserCategorieOrCourse, permisoPublication, requiredImage, statusPublication } from "../helpers/db-validator-publications.js";

export const savePublication = async (req, res) => {
    try {

        const data = req.body || {};
        const userId = req.user._id;
        const user = await User.findById(userId);
        const categorie = await Categorie.findOne({ name: data.nameCategorie.toLowerCase() });
        const course = await Course.findOne({ name: data.nameCourse.toLowerCase() });

        await existeUserCategorieOrCourse(user, categorie, course);
        await existePublicacionDuplicada(data.title, data.content, user._id);

        const publication = await Publication.create({
            ...data,
            user: user._id,
            username: user.username,
            categorie: categorie._id,
            nameCategorie: categorie.name,
            course: course._id,
            nameCourse: course.name
        });

        const publicationDetails = await Publication.findById(publication._id)
            .populate('user', 'username')
            .populate('categorie', 'name')
            .populate('course', 'name');

        res.status(200).json({
            success: true,
            msg: "Publicación guardada exitosamente!!",
            publicationDetails
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al guardar la publicación",
            error: error.message
        });
    }
}

export const uploadPublicationImage = async (req, res) => {
    try {
        
        const { id } = req.params || {};
        const { image } = req.body || {};
        
        await requiredImage(image);
        await existePublicationById(id);

        const publication = await Publication.findById(id);
        await permisoPublication(req, publication);
        
        publication.image = image;
        await publication.save();

        res.status(200).json({
            success: true,
            msg: "Imagen subida exitosamente!!",
            publication
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al subir la imagen",
            error: error.message
        })
    }
}

export const getPublications = async (req = request, res = response) => {
    try {

        const { limite = 10, desde = 0 } = req.query || {};
        const query = { estado: true };

        const [total, publications] = await Promise.all([
            Publication.countDocuments(query),
            Publication.find(query)
            .populate('user', 'username')
            .populate('categorie', 'name')
            .populate('course', 'name')
            .populate({
                path: 'comment',
                match: { estado: true },
                select: 'text',
                populate: {
                    path: 'user',
                    select: 'username'
                }
            })
            .skip(Number(desde))
            .limit(Number(limite))
        ])

        res.status(200).json({
            success: true,
            total,
            msg: "Publicaciones obtenidas exitosamente!!",
            publications
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al obtener publicaciones",
            error: error.message
        });
    }
}

export const getPublicationById = async (req, res) => {
    try {

        const { id } = req.params || {};

        await existePublicationById(id);

        const publication = await Publication.findById(id)
            .populate('user', 'username')
            .populate('categorie', 'name')
            .populate('course', 'name')
            .populate({
                path: 'comment',
                match: { estado: true },
                select: 'text',
                populate: {
                    path: 'user',
                    select: 'username'
                }
            });

        await statusPublication(publication);

        res.status(200).json({
            success: true,
            msg: "Publicación obtenida exitosamente!!",
            publication
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al obtener publicación",
            error: error.message
        });
    }
}

export const updatePublication = async (req, res = response) => {
    try {

        const { id } = req.params;
        const { _id, username, ...data } = req.body;
        
        await existePublicationById(id);

        const publication = await Publication.findById(id);
        await statusPublication(publication);
        await permisoPublication(req, publication);
        
        const user = await User.findOne({ username: username.toLowerCase() });
        const categorie = await Categorie.findOne({ name: data.nameCategorie.toLowerCase() });
        const course = await Course.findOne({ name: data.nameCourse.toLowerCase() });
        await existeUserCategorieOrCourse(user, categorie, course);
        await existePublicacionDuplicada(data.title, data.content, req.user._id, id);

        data.categorie = categorie._id;
        data.course = course._id;

        await Publication.findByIdAndUpdate(id, data, { new: true });

        const publicationDetails = await Publication.findById(publication._id)
            .populate('user', 'username')
            .populate('categorie', 'name')
            .populate('course', 'name');

        res.status(200).json({
            success: true,
            msg: "Publicación actualizada exitosamente!!",
            publicationDetails
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al actualizar publicación",
            error: error.message
        });
    }
}

export const deletePublication = async (req, res = response) => {
    try {

        const { id } = req.params;
        
        await existePublicationById(id);

        const publication = await Publication.findById(id);
        await permisoPublication(req, publication);
        await statusPublication(publication);

        await Comment.deleteMany({ publication: id });

        const publicationDelete = await Publication.findByIdAndUpdate(id, { estado: false }, { new: true });

        res.status(200).json({
            success: true,
            msg: "Publicación eliminada exitosamente!!",
            publicationDelete
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al eliminar publicación",
            error: error.message
        });
    }
}