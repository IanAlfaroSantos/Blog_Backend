import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarUserJWTOptional } from "../middlewares/validar-jwt-optional.js";
import { saveComment, getComments, getCommentById, updateComment, deleteComment } from "./comment.controller.js";

const router = Router();

router.post(
    '/:id',
    validarUserJWTOptional,
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
        validarUserJWTOptional,
        check('id', 'Invalid ID').not().isEmpty(),
        validarCampos
    ],
    updateComment
);

router.delete(
    '/:id',
    [
        validarUserJWTOptional,
        check('id', 'Invalid ID').not().isEmpty(),
        validarCampos
    ],
    deleteComment
);

export default router;