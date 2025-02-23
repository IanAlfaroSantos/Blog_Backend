import User from '../users/user.model.js';
import Categorie from '../categories/categorie.model.js';

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

export const existenteNameCategorie = async (name = ' ') => {

    const existeName = await Categorie.findOne({ name });

    if (existeName) {
        throw new Error(`El nombre ${ name } ya existe en la base de datos`);
    }
}

export const existeCategorieById = async (id = '') => {

    const existeCategorie = await Categorie.findById(id);

    if (!existeCategorie) {
        throw new Error(`El ID ${ id } no existe en la base de datos`);
    }
}