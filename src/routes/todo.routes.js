import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { AuthMiddlewareRole } from "../middleware/AuthMiddleware.js";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../config.js";

const DecodeToken = (token) => {
  return jwt.verify(token, SECRET_KEY);
}

const todoRouter = Router();
const prisma = new PrismaClient();

function Todo(query) {
  this.name = query.name;
  this.desc = query.desc;
  this.completed = query.completed;
}

//name desc compelted
todoRouter.get(
  "/todo",
  AuthMiddlewareRole(["ADMIN", "USER"]),
  async (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const user = DecodeToken(token);
      const todo = await prisma.todo.findMany({where: {userId: user.id}});
      res.status(200).json(todo);
    } catch (e) {
      res.status(404).json({ message: e.message });
    }
  }
);

//name desc
todoRouter.post(
  "/todo",
  AuthMiddlewareRole(["ADMIN", "USER"]),
  async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const user = DecodeToken(token);
    const newTodo = await prisma.todo.create({
      data: {
        name: req.body.name,
        desc: req.body.desc,
        userId: user.id
      },
    });
    res.status(200).json(newTodo);
  }
);

//id name desc compelted
todoRouter.put(
  "/todo",
  AuthMiddlewareRole(["ADMIN", "USER"]),
  async (req, res) => {
    try {
      const putTodo = await prisma.todo.update({
        where: { id: req.body.id },
        data: new Todo(req.body),
      });
      res.status(200).json(putTodo);
    } catch (e) {
      res.status(404).json({ message: e.message });
    }
  }
);

todoRouter.delete(
  "/todo",
  AuthMiddlewareRole(["ADMIN", "USER"]),
  async (req, res) => {
    try {
      const deleteTodo = await prisma.todo.delete({
        where: { id: req.body.id },
      });

      res.status(200).json(deleteTodo);
    } catch (e) {
      res.status(404).json({ message: e.message });
    }
  }
);
export default todoRouter;
