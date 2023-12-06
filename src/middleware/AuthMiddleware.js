import  jwt  from "jsonwebtoken";
import { SECRET_KEY } from "../../config.js";

const DecodeToken = (token) => {
    return jwt.verify(token, SECRET_KEY);
}

export const AuthMiddlewareRole = (roles) => {
     return (req, res, next) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const user = DecodeToken(token);
            if (roles.indexOf(user.role) !== -1) next();
            else return res.status(403).json({message: "Недостаточно прав"})
        } catch(e) {
            return res.status(403).json({message: "Пользователь не авторизован"})
        }
    }
}
