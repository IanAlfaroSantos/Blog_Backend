import User from '../users/user.model.js';
import Categorie from '../categories/categorie.model.js';
import Publication from '../publications/publication.model.js';
import Comment from '../comments/comment.model.js';

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

export const existePublicationById = async (id = '') => {

    const existePublication = await Publication.findById(id);

    if (!existePublication) {
        throw new Error(`El ID ${ id } no existe en la base de datos`);
    }
}

export const existeCommentById = async (id = '') => {

    const existeComment = await Comment.findById(id);

    if (!existeComment) {
        throw new Error(`El ID ${ id } no existe en la base de datos`);
    }
}