import jwt from "jsonwebtoken";
import User from "../users/user.model.js";

export const validarUserJWT = async (req, res, next) => {

    const token = req.header("x-token");

    if (!token) {
        return res.status(400).json({
            msg: "Para realizar esta acción necesita iniciar sesión"
        });
    }
    
    try {

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const user = await User.findById(uid);

        if (!user) {
            return res.status(400).json({
                msg: "Usuario no encontrado"
            });
        }

        if (user.estado === false) {
            return res.status(400).json({
                msg: "Usuario inactivo"
            });
        }

        req.user = user;
        
        next();
        
    } catch (e) {
        return res.status(400).json({
            msg: "Token no válido"
        });
    }
}