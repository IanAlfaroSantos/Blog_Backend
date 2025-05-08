import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarUserJWT } from "../middlewares/validar-jwt.js";
import { getCourseById, getCourses, saveCourse, updateCourse } from "./course.controller.js";

const router = Router();

router.post(
    '/',
    validarUserJWT,
    validarCampos,
    saveCourse
)

router.get(
    '/',
    getCourses
)

router.get(
    '/:id',
    [
        check("id", "Invalid ID").not().isEmpty(),
        validarCampos
    ],
    getCourseById
)

router.put(
    '/:id',
    [
        validarUserJWT,
        check("id", "Invalid ID").not().isEmpty(),
        validarCampos
    ],
    updateCourse
)

export default router;