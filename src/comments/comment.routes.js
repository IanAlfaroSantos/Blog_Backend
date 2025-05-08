import { Router } from "express";
import { check } from "express-validator";
import { existeCommentById } from "../helpers/db-validator-comments.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarUserJWT } from "../middlewares/validar-jwt.js";
import { saveComment, getComments, getCommentById, updateComment, deleteComment } from "./comment.controller.js";

const router = Router();

router.post(
    '/:id',
    validarCampos,
    saveComment
);

router.get(
    '/',
    getComments
);

router.get(
    '/findComment/:id',
    [
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom(existeCommentById),
        validarCampos
    ],
    getCommentById
);

router.put(
    '/:id',
    [
        validarUserJWT,
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom(existeCommentById),
        validarCampos
    ],
    updateComment
);

router.delete(
    '/:id',
    [
        validarUserJWT,
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom(existeCommentById),
        validarCampos
    ],
    deleteComment
);

export default router;