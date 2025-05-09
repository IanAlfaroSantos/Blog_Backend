import Comment from "./comment.model.js";
import User from "../users/user.model.js";
import Publication from "../publications/publication.model.js";
import { request, response } from "express";
import { existeCommentById, existeUserOrPublication, permisoComment, statusComment } from "../helpers/db-validator-comments.js";

export const saveComment = async (req, res) => {
    try {

        const { id } = req.params || {};
        const data = req.body || {};
        const userId = req.user._id;
        const user = await  User.findById(userId);
        const publication = await Publication.findById(id);

        await existeUserOrPublication(user, publication)

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

        res.status(200).json({
            success: true,
            msg: "Comentario creado correctamente",
            commentDetails
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al crear comentario",
            error: error.message
        });
    }
}

export const getComments = async (req = request, res = response) => {
    try {

        const { limite = 10, desde = 0 } = req.query || {};
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
            msg: "Comentarios obtenidos existosamente!!",
            comments
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Error al obtener los comentarios',
            error: error.message
        });
    }
}

export const getCommentById = async (req, res) => {
    try {
        
        const { id } = req.params || {};

        await existeCommentById(id);

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

        await statusComment(comment);

        res.status(200).json({
            success: true,
            msg: "Comentario obtenido exitosamente!!",
            comment
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Error al obtener comentario por ID',
            error: error.message
        });
    }
}

export const updateComment = async (req, res = response) => {
    try {

        const { id } = req.params || {};
        const { _id, username, publication, ...data } = req.body;

        await existeCommentById(id);

        const comment = await Comment.findById(id);

        await statusComment(comment);
        await permisoComment(req, comment);
        
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
            
        res.status(200).json({
            success: true,
            msg: 'Comentario actualizado exitosamente!!',
            commentDetails
        });
            
        } catch (error) {
            return res.status(500).json({
                success: false,
                msg: 'Error al actualizar comentario',
                error: error.message
            });
        }
    }
    
    export const deleteComment = async (req, res = response) => {
        try {
            
            const { id } = req.params || {};

            const comment = await Comment.findById(id);
            await existeCommentById(id);
            
            await statusComment(comment);
            await permisoComment(req, comment);

            const commentDelete = await Comment.findByIdAndUpdate(id, { estado: false }, { new: true });

            res.status(200).json({
                success: true,
                msg: 'Comentario eliminado exitosamente!!',
                commentDelete
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                msg: 'Error al eliminar comentario',
                error: error.message
        });
    }
}