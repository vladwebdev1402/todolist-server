import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient()
const user = await prisma.user.findMany({
    where: { role: "ADMIN" },
  }).then(res => res[0]);

  if (user) console.log("Администратор уже существует: ", user);
  else {
    const salt = bcrypt.genSaltSync(5);
    const hashPassword = bcrypt.hashSync("admin", salt);
    const newUser = await prisma.user.create({
        data: {
          login: "admin",
          password: hashPassword,
          role: "ADMIN"
        },
      });
    console.log("Администратор создан", newUser)
  }