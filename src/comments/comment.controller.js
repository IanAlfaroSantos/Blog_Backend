import Comment from "./comment.model.js";
import User from "../users/user.model.js";
import Publication from "../publications/publication.model.js";
import { request, response } from "express";

export const saveComment = async (req, res) => {
    try {

        const { id } = req.params;
        const data = req.body;
        const user = await User.findOne({ username: data.username.toLowerCase() });
        const publication = await Publication.findById(id);

        if (!user) {
            return res.status(400).json({
                success: false,
                msg: "Usuario no encontrado"
            });
        }

        if (!publication) {
            return res.status(400).json({
                success: false,
                msg: "Publicación no encontrada"
            });
        }

        const comment = await Comment.create({
            ...data,
            user: user._id,
            username: user.username,
            publication: publication._id
        });

        const commentDetails = await Comment.findById(comment._id)
            .populate('user', 'username')
            .populate({
                path: 'publication',
                select: 'title content',
                populate: {
                    path: 'user',
                    select: 'username',
                }
            })

        const details = {
                commentDetails
        }

        res.status(200).json({
            success: true,
            msg: "Comentario creado correctamente",
            details
        });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Error al crear comentario"
        });
    }
}

export const getComments = async (req = request, res = response) => {
    try {

        const { limite = 10, desde = 0 } = req.body;
        const query = { estado: true };

        const [total, comments] = await Promise.all([
            Comment.countDocuments(query),
            Comment.find(query)
           .populate('user', 'username')
           .populate({
            path: 'publication',
                select: 'title content',
                populate: {
                    path: 'user',
                    select: 'username'
                }
           })
           .skip(Number(desde))
           .limit(Number(limite))
        ]);

        res.status(200).json({
            success: true,
            total,
            comments
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener los comentarios',
            error
        });
    }
}

export const getCommentById = async (req, res) => {
    try {

        const { id } = req.params;
        const comment = await Comment.findById(id)
            .populate('user', 'username')
            .populate({
            path: 'publication',
                select: 'title content',
                populate: {
                    path: 'user',
                    select: 'username'
                }
            })

        if (comment.estado === false) {
            return res.status(400).json({
                success: false,
                msg: 'Comentario no disponible'
            });
        }

        if (!comment) {
             return res.status(404).json({
                 success: false,
                 msg: 'Comentario no encontrado'
             });
        }

        res.status(200).json({
            success: true,
            comment
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener comentario por ID',
            error
        });
    }
}