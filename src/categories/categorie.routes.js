import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarUserJWT } from "../middlewares/validar-jwt.js";
import { saveCategorie, getCategories, getCategorieById, updateCategorie, deleteCategorie, restoreCategorie } from "./categorie.controller.js";

const router = Router();

router.post(
    '/',
    [
        validarUserJWT,
        validarCampos
    ],
    saveCategorie
);

router.get(
    '/',
    getCategories
);

router.get(
    '/:id',
    [
        check('id', 'No es un ID válido').not().isEmpty(),
        validarCampos
    ],
    getCategorieById
);

router.put(
    '/:id',
    [
        validarUserJWT,
        check('id', 'No es un ID válido').not().isEmpty(),
        validarCampos
    ],
    updateCategorie
);

router.delete(
    '/:id',
    [
        validarUserJWT,
        check('id', 'No es un ID válido').not().isEmpty(),
        validarCampos
    ],
    deleteCategorie
);

router.put(
    '/restore/:id',
    [
        validarUserJWT,
        check('id', 'No es un ID válido').not().isEmpty(),
        validarCampos
    ],
    restoreCategorie
);

export default router;