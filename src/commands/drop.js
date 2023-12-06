import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const tasks = await prisma.todo.deleteMany();
const user = await prisma.user.deleteMany();
console.log("Количество удалённых задач: ", tasks.count)
console.log("Количество удалённых пользователей: ", user.count)