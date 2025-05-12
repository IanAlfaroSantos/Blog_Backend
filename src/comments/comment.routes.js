import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarUserJWT } from "../middlewares/validar-jwt.js";
import { saveComment, getComments, getCommentById, updateComment, deleteComment } from "./comment.controller.js";

const router = Router();

router.post(
    '/:id',
    validarUserJWT,
    validarCampos,
    saveComment
);

router.get(
    '/',
    getComments
);

router.get(
    '/:id',
    [
        check('id', 'Invalid ID').not().isEmpty(),
        validarCampos
    ],
    getCommentById
);

router.put(
    '/:id',
    [
        validarUserJWT,
        check('id', 'Invalid ID').not().isEmpty(),
        validarCampos
    ],
    updateComment
);

router.delete(
    '/:id',
    [
        validarUserJWT,
        check('id', 'Invalid ID').not().isEmpty(),
        validarCampos
    ],
    deleteComment
);

export default router;