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