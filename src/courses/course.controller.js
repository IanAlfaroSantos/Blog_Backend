import { crearCursoInformatica, crearCursoElectronica, crearCursoDibujo } from '../helpers/db-validator-courses.js';

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