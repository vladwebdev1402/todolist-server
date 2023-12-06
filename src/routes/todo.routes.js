import { PrismaClient } from "@prisma/client";
import {Router} from "express"
import { AuthMiddlewareRole } from "../middleware/AuthMiddleware.js";
const todoRouter = Router();
const prisma = new PrismaClient()

function Todo(query) {
    this.name = query.name
    this.desc = query.desc
    this.completed = query.completed
}

//name desc compelted
todoRouter.get('/todo', AuthMiddlewareRole(["ADMIN", "USER"]), async (req, res) => {
    const todo = await prisma.todo.findMany()
    res.json(todo)
})

//name desc 
todoRouter.post('/todo', AuthMiddlewareRole(["ADMIN", "USER"]), async (req, res) => {
    const newTodo = await prisma.todo.create(
        {
            data: {
                name: req.body.name,
                desc: req.body.desc
            }
        }
    )   
    res.json(newTodo)
})

//id name desc compelted
todoRouter.put("/todo", AuthMiddlewareRole(["ADMIN", "USER"]), async (req, res) => {
    try {
        const putTodo = await prisma.todo.update(
            {
                where: {id: req.body.id,},
                data: new Todo(req.body)
            }, 
            
        )
        res.json(putTodo)
    }
    catch(e) {
        res.json(e)
    }
    
})


todoRouter.delete("/todo",AuthMiddlewareRole(["ADMIN", "USER"]), async (req, res) => {
    try {
        const deleteTodo = await prisma.todo.delete(
            {
                where: {id: req.body.id,}
            }
        )
    
        res.json(deleteTodo)
    }
    catch(e) {res.json(e)}
   
})
export default todoRouter;