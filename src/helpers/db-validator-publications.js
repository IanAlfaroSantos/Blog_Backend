import Publication from '../publications/publication.model.js';

export const existePublicationById = async (id = '') => {

    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        throw new Error(`El ID ${id} no existe en la base de datos`);
    }

    const existePublication = await Publication.findById(id);

    if (!existePublication) {
        throw new Error(`El ID ${id} no existe en la base de datos`);
    }
}

export const existeUserOrCourse = async (user, course) => {
    if (!user) {
        throw new Error(`Usuario no encontrado`);
    }

    if (!course) {
        throw new Error(`Curso no encontrado. Cursos existentes: Informatica, Electronica y Dibujo`);
    }
}

export const statusPublication = async (publication) => {
    if (!publication.estado) {
        throw new Error("Publicación inactiva");
    }
}

export const permisoPublication = async (req, publication) => {
    if (req.user._id.toString() !== publication.user.toString() && req.user.role !== "ADMIN") {
        throw new Error("No tiene permiso para actualizar o eliminar una publicación que no es suya");
    }
}

export const requiredImage = async (image = '') => {
    if (!image) {
        throw new Error("La imagen es requerida");
    }
}

export const existePublicacionDuplicada = async (title, content, userId, publicationId = null) => {
    const query = {
        user: userId,
        $or: [
            { title: title.trim() },
            { content: content.trim() }
        ]
    };

    if (publicationId) {
        query._id = { $ne: publicationId };
    }

    const publicacion = await Publication.findOne(query);

    if (publicacion) {
        throw new Error('Ya existe una publicación con este título o contenido por el mismo usuario');
    }
}