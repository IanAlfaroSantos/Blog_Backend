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

        publication.comment.push(comment._id);
        await publication.save();

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

export const updateComment = async (req, res = response) => {
    try {

        const { id } = req.params;
        const { _id, username, publication, ...data } = req.body;

        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(400).json({
                success: false,
                msg: 'Comentario no encontrado'
            });
        }

        if (comment.estado === false) {
            return res.status(400).json({
                success: false,
                msg: 'Este comentario no esta disponible'
            });
        }
        
        if (req.user._id.toString() !== comment.user.toString() && req.user.role !== "ADMIN") {
            return res.status(400).json({
                success: false,
                msg: "No tiene permiso para actualizar un comentario que no es suyo"
            });
        }
        
        const updateComment = await Comment.findByIdAndUpdate(id, data, { new: true });

        if (comment.text !== updateComment.text) {
            await Publication.updateMany(
                { comment: id },
                { $set: { text: updateComment.text } }
            )
        }
        
        const commentDetails = await Comment.findById(comment._id)
        .populate('user', 'username')
        .populate({
                path: 'publication',
                select: 'title content',
                populate: {
                    path: 'user',
                    select: 'username'
                }
            })
            
            const details = {
                commentDetails
            }
            
            res.status(200).json({
                success: true,
                msg: 'Comentario actualizado con éxito',
                details
            });
            
        } catch (error) {
            res.status(500).json({
                success: false,
                msg: 'Error al actualizar comentario',
                error
            });
        }
    }
    
    export const deleteComment = async (req, res = response) => {
        try {
            
            const { id } = req.params;
            
            const authenticatedComment = req.comment;
            
            const comment = await Comment.findById(id);
            if (!comment) {
                return res.status(400).json({
                    success: false,
                    msg: 'Comentario no encontrado'
                });
            }
            
            if (req.user._id.toString() !== comment.user.toString() && req.user.role !== "ADMIN") {
                return res.status(400).json({
                    success: false,
                    msg: "No tiene permiso para actualizar un comentario que no es suyo"
                });
            }

            const commentDelete = await Comment.findByIdAndUpdate(id, { estado: false }, { new: true });

            res.status(200).json({
                success: true,
                msg: 'Comentario eliminado con éxito',
                commentDelete,
                authenticatedComment
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                msg: 'Error al eliminar comentario',
                error
        });
    }
}