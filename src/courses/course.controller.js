import Course from "./course.model.js";
import Publication from "../publications/publication.model.js";
import { request, response } from "express";
import { soloAdmin, limiteCursos, existeCursoById, statusCurso } from "../helpers/db-validator-courses.js";

export const saveCourse = async (req, res) => {
    try {
        
        const data = req.body || {};

        const cursoLimite = await Course.countDocuments();
        await limiteCursos(cursoLimite);
        await soloAdmin(req);

        const course = await Course.create({
            name: data.name,
            description: data.description
        });

        res.status(200).json({
            success: true,
            msg: "Curso guardado exitosamente!!",
            course
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al guardar el curso",
            error: error.message
        });
    }
}

export const getCourses = async (req = request, res = response) => {
    try {
        
        const { limite = 10, desde = 0 } = req.query || {};
        const query = { estado: true };

        const [ total, courses ] = await Promise.all([
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

export const getCourseById = async (req, res) => {
    try {
        
        const { id } = req.params || {};
        await existeCursoById(id);

        const curso = await Course.findById(id);
        await statusCurso(curso);

        res.status(200).json({
            success: true,
            msg: "Curso obtenido exitosamente!!",
            curso
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al obtener curso",
            error: error.message
        })
    }
}

export const updateCourse = async (req, res = response) => {
    try {

        const { id } = req.params || {};
        const { _id, ...data } = req.body || {};

        await existeCursoById(id);

        const curso = await Course.findById(id);
        await statusCurso(curso);
        await soloAdmin(req);

        const updateCurso = await Course.findByIdAndUpdate(id, data, { new: true });

        if (curso.name !== updateCurso.name) {
            await Publication.updateMany(
                { course: id },
                { $set: { name: updateCurso.name } }
            )
        }

        res.status(200).json({
            success: true,
            msg: "Curso Actualizado exitosamente!!",
            updateCurso
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al actualizar curso",
            error: error.message
        })
    }
}