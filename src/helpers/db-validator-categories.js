import Categorie from '../categories/categorie.model.js';

export const soloAdmin = async (req) => {
    if (req.user.role !== "ADMIN") {
        throw new Error(`No tienes permisos para guardar, editar o eliminar categorias`);
    }
}

export const existeCategoriaById = async (id = '') => {
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        throw new Error(`El ID ${ id } no existe en la base de datos`);
    }

    const existeCategoria = await Categorie.findById(id);

    if (!existeCategoria) {
        throw new Error(`El ID ${ id } no existe en la base de datos`);
    }
}

export const statusCategoria = async (categorie) => {
    if (!categorie.estado) {
        throw new Error("Categoria inactiva");
    }
}

export const noCategoriaGeneral = async (categorieGeneral, id = '') => {
    if (categorieGeneral && id === categorieGeneral._id.toString()) {
        throw new Error("No se puede editar o eliminar la categoria por defecto");
    }
}

export const crearCategoriaSiNoExiste = async () => {
    const verifyCategorie = await Categorie.findOne({ name: "general" });

    if (!verifyCategorie) {
        const categorieGeneral = new Categorie({
            name: "general",
            description: "Categoría por defecto para publicaciones sin una categoría especifica"
        });

        await categorieGeneral.save();
    
        console.log(" ");
        console.log("La Categoria General fue creada exitosamente!!");
        console.log(" ");
    } else {
        console.log(" ");
        console.log("La Categoria General ya existe, no se creó nuevamente");
        console.log(" ");
    }
}