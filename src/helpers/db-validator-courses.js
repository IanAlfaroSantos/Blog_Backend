import Course from '../courses/course.model.js';

export const soloAdmin = async (req) => {
    if (req.user.role !== "ADMIN") {
        throw new Error(`No tienes permisos para guardar o editar cursos`);
    }
}

export const existeCursoById = async (id = '') => {
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        throw new Error(`El ID ${ id } no existe en la base de datos`);
    }

    const existeCurso = await Course.findById(id);

    if (!existeCurso) {
        throw new Error(`El ID ${ id } no existe en la base de datos`);
    }
}

export const statusCurso = async (curso) => {
    if (!curso.estado) {
        throw new Error("Curso inactivo");
    }
}

export const limiteCursos = async (cursoLimite) => {
    if (cursoLimite >= 3) {
        throw new Error("Ya no se pueden agregar más cursos, el limite de cursos es: 3");
    }
}