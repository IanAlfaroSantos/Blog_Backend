import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarUserJWT } from "../middlewares/validar-jwt.js";
import { uploadPublicationPicture } from "../middlewares/multer-upload.js";
import { savePublication, getPublications, getPublicationById, updatePublication, deletePublication, uploadPublicationImage, getPublicationsByCourse } from "./publication.controller.js";

const router = Router();

router.post(
    '/',
    validarUserJWT,
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

router.get(
    '/course/:courseName',
    [
        check('courseName', 'No es un curso válido').not().isEmpty(),
        validarCampos
    ],
    getPublicationsByCourse
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