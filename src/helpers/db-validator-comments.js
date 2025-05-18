import Comment from '../comments/comment.model.js';

export const existeCommentById = async (id = '') => {

    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        throw new Error(`El ID ${ id } no existe en la base de datos`);
    }

    const existeComment = await Comment.findById(id);

    if (!existeComment) {
        throw new Error(`El ID ${ id } no existe en la base de datos`);
    }
}

export const existeUserOrPublication = async (publication) => {
    
    if (!publication) {
        throw new Error(`Publicación no encontrada`);
    }
}

export const statusComment = async (comment) => {
    if (!comment.estado) {
        throw new Error("Comentario no disponible");
    }
}

export const permisoComment = async (req, comment) => {
    if (!comment.user) {
        if (req.user && req.user.role !== "ADMIN") {
            throw new Error("No puede editar o eliminar comentarios anónimos");
        }
        return;
    }

    if (!req.user) {
        throw new Error("Debe iniciar sesión para modificar este comentario");
    }

    if (req.user._id.toString() !== comment.user.toString() && req.user.role !== "ADMIN") {
        throw new Error("No tiene permiso para actualizar o eliminar un comentario que no es suyo");
    }
}