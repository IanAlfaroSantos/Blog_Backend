import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarUserJWT } from "../middlewares/validar-jwt.js";
import { uploadPublicationPicture } from "../middlewares/multer-upload.js";
import { savePublication, getPublications, getPublicationById, updatePublication, deletePublication, uploadPublicationImage } from "./publication.controller.js";

const router = Router();

router.post(
    '/',
    validarUserJWT,
    validarCampos,
    savePublication
);

router.post(
    '/image/:id',
    validarUserJWT,
    uploadPublicationPicture.single('image'),
    uploadPublicationImage
);

router.get(
    '/',
    getPublications
);

router.get(
    '/:id',
    [
        check('id', 'No es un ID válido').not().isEmpty(),
        validarCampos
    ],
    getPublicationById
);

router.put(
    '/:id',
    [
        validarUserJWT,
        check('id', 'No es un ID válido').not().isEmpty(),
        validarCampos
    ],
    updatePublication
);

router.delete(
    '/:id',
    [
        validarUserJWT,
        check('id', 'No es un ID válido').not().isEmpty(),
        validarCampos
    ],
    deletePublication
);

export default router;