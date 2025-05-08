import { hash, verify } from 'argon2';
import User from '../users/user.model.js';

export const existenteEmail = async (email = ' ') => {

    const existeEmail = await User.findOne({ email });

    if (existeEmail) {
        throw new Error(`El email ${ email } ya existe en la base de datos`);
    }
}

export const existeUserById = async (id = '') => {
    
    const existeUser = await User.findById(id);
    
    if (!existeUser) {
        throw new Error(`El ID ${ id } no existe en la base de datos`);
    }
}

export const existeUser = async (username = '', email = '') => {
    
    let user;

    if (username) {
        user = await User.findOne({ username });

        if (!user) {
            throw new Error(`El username ${ username } es incorrecto`);
        }
    } else if (email) {
        user = await User.findOne({ email });

        if (!user) {
            throw new Error(`El email ${ email } es incorrecto`);
        }
    }

    return user;
}

export const statusUser = async (user) => {
    if (!user.estado) {
        throw new Error("El usuario esta inactivo");
    }
}

export const validarPassword = async (user, password = '') => {
    const validPassword = await verify(user.password, password);

    if (!validPassword) {
        throw new Error("Contraseña incorrecta");
    }
}

export const passwordLength = async (password = '') => {
    if (password.length > 8 || password.length < 8) {
        throw new Error("La contraseña debe contener exactamente 8 caracteres");
    }
}

export const phoneLength = async (phone = '') => {
    if (phone.length > 8 || phone.length < 8) {
        throw new Error("El número de telefono debe contener exactamente 8 caracteres");
    }
}

export const peticionPassword = async (user, password, currentPassword) => {

    if (password) {
        if (!currentPassword) {
            throw new Error("Debe proporcionar la contraseña actual para cambiarla");
        }
        
        const verifyPassword = await verify(user.password, currentPassword);
        
        if (!verifyPassword) {
            throw new Error("Contraseña actual incorrecta");
        }
    
        user.password = await hash(password);
        await user.save();
    }
}

export const validarRole = async (role = '') => {
    if (!["USER", "ADMIN"].includes(role)) {
        throw new Error("Role invalido, solo se permiten 'USER' o 'ADMIN'");
    }
}

export const noExistenUserRole = async (users, role) => {
    if (!users.length) {
        throw new Error(`No se encontraron usuarios con el rol ${ role }`);
    }
}

export const noActualizarAdmin = async (id) => {

    const user = await User.findById(id);
    
    if (user.username === "administrador") {
        throw new Error('No se puede actualizar o eliminar al ADMIN por defecto');
    }
}

export const verificarUsuarioExistente = async (username, user) => {

    if (username && username !== user.username) {
        const existingUser = await User.findOne({ username });

        if (existingUser && existingUser._id.toString() !== user._id.toString()) {
            throw new Error(`El nombre de usuario ${ username } ya existe en la base de datos`);
        }
    }
}

export const soloAdmin = async (req) => {
    if (req.user.role !== "ADMIN") {
        throw new Error("Solo los ADMIN pueden actualizar el role de otros usuarios");
    }
}

export const validarUsernameParaEliminar = async (username = '', user) => {
    if (!username) {
        throw new Error('Necesita proporcionar su username para poder eliminar');
    }

    if (user.username.toLowerCase() !== username.toLowerCase()) {
        throw new Error('El nombre de usuario es incorrecto');
    }
}

export const validarPasswordParaEliminar = async (password = '', user) => {
    if (!password) {
        throw new Error('Necesita proporcionar su contraseña para poder eliminar');
    }

    const validPassword = await verify(user.password, password);
    if (!validPassword) {
        throw new Error('Contraseña incorrecta');
    }
}

export const crearAdminSiNoExiste = async () => {
    const verifyUser = await User.findOne({ username: "administrador" })

    if (!verifyUser) {
        const encryptedPassword = await hash("Admin100");

        const adminUser = new User({
            name: "Ian",
            surname: "Alfaro",
            username: "administrador",
            email: "admin@gmail.com",
            phone: "78363432",
            password: encryptedPassword,
            role: "ADMIN"
        });
    
        await adminUser.save();
    
        console.log(" ");
        console.log("El usuario ADMIN fue creado exitosamente");
        console.log(" ");
    } else {
        console.log(" ");
        console.log("El usuario ADMIN ya existe, no se creó nuevamente");
        console.log(" ");
    }
}