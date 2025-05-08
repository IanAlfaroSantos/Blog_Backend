import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarUserJWT } from "../middlewares/validar-jwt.js";
import { deleteFileOnError } from "../middlewares/delete-file-on-error.js"
import { login, register, getUsers, getUserById, updateUser, getUserByRole, updateRole, deleteUser } from "./user.controller.js";

const router = Router();

router.post(
    '/login',
    deleteFileOnError,
    login
);

router.post(
    '/register',
    deleteFileOnError,
    register
);

router.get(
    '/',
    getUsers
);

router.get(
    '/search/',
    validarUserJWT,
    getUserById
);

router.get(
    '/role/:role',
    getUserByRole
);

router.put(
    '/',
    validarUserJWT,
    updateUser
);

router.put(
    '/role/:id',
    [
        validarUserJWT,
        check("id", "Invalid ID").not().isEmpty(),
        check("role", "Invalid role. Valid role are: USER or ADMIN").isIn(["USER", "ADMIN"]),
        validarCampos
    ],
    updateRole
);

router.delete(
    '/',
    validarUserJWT,
    deleteUser
);

export default router;