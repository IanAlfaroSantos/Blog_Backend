'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import limiter from "../src/middlewares/validar-cant-peticiones.js";
import { createAddAdmin } from '../src/users/user.controller.js';
import { defaultCategorie } from '../src/categories/categorie.controller.js';
import userRoutes from '../src/users/user.routes.js';
import categorieRoutes from '../src/categories/categorie.routes.js';
import publicationRoutes from '../src/publications/publication.routes.js';

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false }));
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(limiter);
}

const routes = (app) => {
    app.use('/opinionManager/v1/users', userRoutes);
    app.use('/opinionManager/v1/categories', categorieRoutes);
    app.use('/opinionManager/v1/publications', publicationRoutes);
};

const conectarDB = async () => {
    try {
        await dbConnection();
        console.log('¡¡Conexión a la base de datos exitosa!!');
        await createAddAdmin();
        await defaultCategorie();
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        process.exit(1);
    }
}

export const initServer = async () => {
    const app = express();
    const port = process.env.PORT || 3000;

    try {
        middlewares(app);
        conectarDB();
        routes(app);
        app.listen(port);
        console.log(`Server running on port ${port}`);
    } catch (error) {
        console.log(`Server init failded: ${error}`);
    }
}