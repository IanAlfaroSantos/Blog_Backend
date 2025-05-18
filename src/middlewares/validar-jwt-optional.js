import jwt from "jsonwebtoken";
import User from "../users/user.model.js";

export const validarUserJWTOptional = async (req, res, next) => {

    const token = req.header("x-token");

    if (!token) {
        return next();
    }
    
    try {

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const user = await User.findById(uid);

        if (!user || user.estado === false) {
            return next();
        }

        req.user = user;
        
        next();
        
    } catch (e) {
        next();
    }
}