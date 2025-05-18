import { crearCursoInformatica, crearCursoElectronica, crearCursoDibujo } from '../helpers/db-validator-courses.js';
import Course from './course.model.js';

export const createCourses = async () => {
    try {

        await crearCursoInformatica();
        await crearCursoElectronica();
        await crearCursoDibujo();

    } catch (error) {
        console.log(error);
        console.log(" ");
        console.error('Error al crear Cursos: ', error.message);
        console.log(" ");
    }
}

export const getCourses = async (req = request, res = response) => {
    try {

        const { limite = 10, desde = 0 } = req.query || {};
        const query = { estado: true };

        const [total, courses] = await Promise.all([
            Course.countDocuments(query),
            Course.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ])

        res.status(200).json({
            success: true,
            total,
            msg: "Cursos obtenidos exitosamente!!",
            courses
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al obtener cursos",
            error: error.message
        })
    }
}