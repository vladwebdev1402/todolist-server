import express from "express";
import cors from "cors";
import todoRouter from "./routes/todo.routes.js";
import http from "http";
import { Server } from "socket.io";
import AuthRouter from "./routes/auth.routes.js";
const PORT = 3050;
const app = express();
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use('/api', todoRouter);
app.use("/auth", AuthRouter);

app.get('/', (req, res) => {
    res.json("Сервер запущен порт 3050")
  });
app.listen(PORT);
console.log("Server on port", PORT);


const wsApp = express();
const server = http.createServer(wsApp);
const io = new Server(server, {cors: {origin: "*",}});
server.listen(5050, () => {
    wsApp.get('/', (req, res) => {
        res.json("socket");
      });

    io.on('connection', (socket) => {
        socket.on('chat message', (msg) => {
            io.emit('chat message', {msg, id: socket.id});
          });
        socket.on('disconnect', () => {
            console.log('user disconnected');
          });
      });
    console.log('WebSocket on port :5050' );
  });
