import User from './user.model.js'
import { hash } from 'argon2'
import { generateJWT } from '../helpers/generate-jwt.js'
import { request, response } from 'express'
import { crearAdminSiNoExiste, existeUser, existeUserById, noActualizarAdmin, noExistenUserRole, passwordLength, peticionPassword, phoneLength, soloAdmin, statusUser, validarPassword, validarPasswordParaEliminar, validarRole, validarUsernameParaEliminar, verificarUsuarioExistente } from '../helpers/db-validator-users.js'

export const login = async (req, res) => {

    const { email, password, username } = req.body || {};

    try {
        const lowerEmail = email ? email.toLowerCase() : null;
        const lowerUsername = username ? username.toLowerCase() : null;

        const user = await User.findOne({
            $or: [
                { email: lowerEmail },
                { username: lowerUsername }
            ]
        });

        await existeUser(lowerUsername, lowerEmail);
        await statusUser(user);
        await validarPassword(user, password);

        const token = await generateJWT(user.id);

        res.status(200).json({
            success: true,
            msg: 'Sesión iniciada exitosamente!!',
            userDetails: {
                username: user.username,
                token: token
            }
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Error al iniciar la sesión',
            error: error.message
        })
    }
}

export const register = async (req, res) => {
    try {
        
        const data = req.body || {};

        const encryptedPassword = await hash(data.password);
        
        await passwordLength(data.password);
        await phoneLength(data.phone);

        const user = await User.create({
            name: data.name,
            surname: data.surname,
            username: data.username,
            email: data.email,
            phone: data.phone,
            password: encryptedPassword
        })

        res.status(200).json({
            success: true,
            msg: 'Usuario registrado exitosamente!!',
            userDetails: {
                username: user.username
            }
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Error al registrar usuario',
            error: error.message
        })
    }
}

export const getUsers = async (req = request, res = response) => {
    try {

        const { limite = 10, desde = 0 } = req.query || {};
        const query = { estado: true };

        const [ total, users ] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
        ])

        res.status(200).json({
            success: true,
            total,
            msg: "Usuarios obtenidos exitosamente!!",
            users
        })
    
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Error al obtener los usuarios',
            error: error.message
        })       
    }
}

export const getUserById = async (req, res) => {
    try {
        
        const user = req.user;

        res.status(200).json({
            success: true,
            msg: "Usuario encontrado exitosamente!!",
            user
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Error al obtener el usuario',
            error: error.message
        })
    }
}

export const getUserByRole = async (req, res) => {
    try {
        const { role } = req.params || {};

        await validarRole(role);

        const users = await User.find({ role });

        await noExistenUserRole(users, role);

        res.status(200).json({
            success: true,
            msg: "Usuarios obtenidos exitosamente!!",
            users
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al buscar usuarios por rol",
            error: error.message
        })
    }
}

export const updateUser = async (req, res = response) => {
    try {
        
        const user = req.user;
        const { _id, email, role, password, currentPassword, ...data } = req.body || {};
        const { username, phone } = req.body || {};

        await phoneLength(phone);
        await passwordLength(password);
        await noActualizarAdmin(user._id);
        await verificarUsuarioExistente(username, user);
        await peticionPassword(user, password, currentPassword);

        const updateUser = await User.findByIdAndUpdate(user._id, data, { new: true });

        res.status(200).json({
            success: true,
            msg: "Usuario Actualizado exitosamente!!",
            updateUser
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            msg: 'Error al actualizar el usuario',
            error: error.message
        })
    }
}

export const updateRole = async (req, res = response) => {
    try {

        const { id } = req.params;
        let { role } = req.body || {};

        await existeUserById(id);

        const user = await User.findById(id);

        await soloAdmin(req);
        await noActualizarAdmin(id);
        await statusUser(user);
        
        const roleUpdate = await User.findByIdAndUpdate(id, { role }, { new: true });
        
        res.status(200).json({
            success: true,
            msg: 'Role actualizado exitosamente!!',
            roleUpdate
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Error al actualizar Role',
            error: error.message
        });
    }
}

export const deleteUser = async (req, res = response) => {

    try {
        const user = req.user;
        const { password, username } = req.body || {};

        await noActualizarAdmin(user._id);
        await validarUsernameParaEliminar(username, user);
        await validarPasswordParaEliminar(password, user);
        
        const userDelete = await User.findByIdAndUpdate(user._id, { estado: false }, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Usuario eliminado exitosamente!!',
            userDelete
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Error al eliminar usuario',
            error: error.message
        });
    }
}

export const createAddAdmin = async () => {
    try {

        await crearAdminSiNoExiste();

    } catch (error) {
        console.log(error);
        console.log(" ");
        console.error('Error al crear el Usuario ADMIN: ', error.message);
        console.log(" ");
    }
}