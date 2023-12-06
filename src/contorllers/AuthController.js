import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../config.js";
const prisma = new PrismaClient();

const generateToken = (payload) => {
    return jwt.sign(payload, SECRET_KEY, {expiresIn: "72h"});
}

class AuthController {
  static async signup(req, res) {
    try {
      const { login, password } = req.body;

      if (password.length < 6 || login.length < 6)
        return res
          .status(401)
          .json({
            message:
              "Пароль или логин слишком короткие. Длина пароля и логина не менее 6-ти символов",
          });

      const user = await prisma.user.findMany({
        where: { login: login },
      });

      if (user.length > 0)
        return res
          .status(401)
          .json({ message: "Пользователь с таким логином уже существует" });

      const mefedron = bcrypt.genSaltSync(5);
      const hashPassword = bcrypt.hashSync(password, mefedron);

      await prisma.user.create({
        data: {
          login,
          password: hashPassword,
          role: "USER"
        },
      });

      return res
        .status(200)
        .json({ message: "Пользователь успешно зарегестрирован" });
    } catch (e) {
      console.log(e);
      return res.status(401).json({ message: "Ошибка регистрации" });
    }
  }

  static async login(req, res) {
    try {
        const {login, password} = req.body;

        const user = await prisma.user.findMany({
            where: { login: login },
        }).then(res => res[0])

        if (!user) return res.status(401).json({ message: "Пользователь с таким логином не найден"})

        if (bcrypt.compareSync(password, user.password)) {
            const token = generateToken(user);
            res.setHeader("Authorization", `Bearer ${token}`);
            return res.status(200).json({message:"Авторизация прошла успешно", token})
        }
        else return res.status(401).json({message:"Пароль введён неверно"});        

    } catch (e) {
      console.log(e);
      return res.status(401).json({ message: "Ошибка авторизации" });
    }
  }

  static async users(req, res) {
    try {
      const users = await prisma.user.findMany();
      res.status(200).json(users);
    } catch (e) {
      console.log(e);
    }
  }
}

export default AuthController;
