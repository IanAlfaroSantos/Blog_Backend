import User from './user.model.js'
import { hash, verify } from 'argon2'
import { generateJWT } from '../helpers/generate-jwt.js'
import { response, request } from 'express'

export const login = async (req, res) => {

    const { email, password, username } = req.body

    try {
        const lowerEmail = email ? email.toLowerCase() : null;
        const lowerUsername = username ? username.toLowerCase() : null;

        const user = await User.findOne({
            $or: [{ email: lowerEmail }, { username: lowerUsername }]
        });

        if (!user) {
            return res.status(404).json({
                msg: 'Credenciales incorrectas, correo o nombre de usuario no existe en la base de datos'
            })
        }

        if (!user.estado) {
            return res.status(404).json({
                msg: 'El usuario no existe en la base de datos'
            })
        }

        const validPassword = await verify(user.password, password);

        if (!validPassword) {
            return res.status(404).json({
                msg: 'Contraseña incorrecta'
            })
        }

        const token = await generateJWT(user.id);

        res.status(200).json({
            msg: '¡¡Inicio de Sesión exitoso!!',
            userDetails: {
                username: user.username,
                token: token
            }
        })

    } catch (e) {
        
        console.error(e);

        return res.status(500).json({
            msg: 'Error no se pudo iniciar la sesión del usuario',
            error: e.message
        })
    }
}

export const register = async (req, res) => {
    try {
        
        const data = req.body;

        const encryptedPassword = await hash(data.password);
        
        const user = await User.create({
            name: data.name,
            surname: data.surname,
            username: data.username.toLowerCase(),
            email: data.email.toLowerCase(),
            phone: data.phone,
            password: encryptedPassword
        })

        res.status(200).json({
            msg: '¡¡Usuario registrado con éxito!!',
            userDetails: {
                username: user.username
            }
        })

    } catch (error) {
        
        console.error(error);

        return res.status(500).json({
            msg: 'User registration failded',
            error: error.message
        })
    }
}

export const getUsers = async (req = request, res = response) => {
    try {

        const { limite = 10, desde = 0 } = req.body;
        const query = { estado: true };

        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
           .skip(Number(desde))
           .limit(Number(limite))
        ])

        res.status(200).json({
            success: true,
            total,
            users
        })
    
    } catch (error) {

        res.status(500).json({
            success: false,
            msg: 'Error al obtener los usuarios',
            error
        })       
    }
}

export const getUserById = async (req, res) => {
    try {
        
        const { id } = req.params;

        const user = await User.findById(id);

        if (user.estado === false) {
            return res.status(400).json({
                success: false,
                msg: 'Este usuario buscado no esta disponible'
            })
        }

        if (!user) {
            return res.status(404).json({
                success: false,
                msg: 'Usuario no encontrado'
            })
        }

        res.status(200).json({
            success: true,
            user
        })

    } catch (error) {
        
        res.status(500).json({
            success: false,
            msg: 'Error al obtener el usuario',
            error
        })
    }
}

export const updateUser = async (req, res = response) => {
    try {
        
        const { id } = req.params;
        const { _id, email, role, password, currentPassword, ...data } = req.body;
        let { username } = req.body;

        if (username) {
            username = username.toLowerCase();
            data.username = username;
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({
                success: false,
                msg: 'Usuario no encontrado'
            })
        }

        if (user.estado === false) {
            return res.status(400).json({
                success: false,
                msg: 'Este usuario no esta disponible'
            })
        }

        if (req.user.id !== id && req.user.role !== "ADMIN") {
            return res.status(400).json({
                success: false,
                msg: 'No tiene permiso para actualizar un perfil que no es suyo'
            })
        }

        if (password) {
            if (!currentPassword) {
                return res.status(400).json({
                    success: false,
                    msg: 'Debe proporcionar la contraseña actual para cambiarla'
                })
            }
            
            const verifyPassword = await verify(user.password, currentPassword);
            
            if (!verifyPassword) {
                return res.status(400).json({
                    success: false,
                    msg: 'Contraseña actual incorrecta'
                })
            }

            data.password = await hash(password);
        }


        const updateUser = await User.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            success: true,
            msg: "Usuario Actualizado",
            updateUser
        })

    } catch (error) {
        
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar el usuario',
            error
        })
    }
}

export const createAddAdmin = async (res) => {
    try {

        await User.deleteOne({ role: "ADMIN" });

        const encryptedPassword = await hash("Admin100");
        const adminUser = new User({
            name: "Ian",
            surname: "Alfaro",
            username: "Administrador",
            email: "useradmin@gmail.com",
            phone: "78363432",
            password: encryptedPassword,
            role: "ADMIN"
        });

        await adminUser.save();

        return res.status(200).json({
            success: true,
            msg: "Usuario ADMIN se ha creado con éxito"
        })
    
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Error al crear el usuario ADMIN',
            error
        })
    }
}

createAddAdmin();