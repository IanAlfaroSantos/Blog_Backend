import Comment from '../comments/comment.model.js';

export const existeCommentById = async (id = '') => {

    const existeComment = await Comment.findById(id);

    if (!existeComment) {
        throw new Error(`El ID ${ id } no existe en la base de datos`);
    }
}