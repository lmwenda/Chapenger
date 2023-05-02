import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import socket, { Socket, Server } from "socket.io";
import express, { Application } from 'express';
import path from "path";

// Configurations

dotenv.config();

// Initializations

const port: number = 5000;
const app: Application = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  }
});

app.use(express.json());

// app.get("/", (req: Request, res: any) => {
  // res.sendFile('index.html', { root: path.join(__dirname, '../templates') });
// })

interface T{
    room: string,
    author: string,
    message: string,
    time: string
}

io.on('connection', (socket: Socket): void => {
  console.log('a user connected: ' + socket.id);

  socket.on('join room', ({ room }: T): void => {
    socket.join(room);
    console.log(`USER WITH ID: (${socket.id}) JOINED ROOM: (${room})`)
  })

  socket.on("chat message", (data: T): void => {
    console.log(`MESSAGE CONTENT: ("${data.message}") SENT FROM USER WITH ID: (${socket.id})`); 
    socket.broadcast.to(data.room).emit("receive_message", { 
      room: data.room, 
      author: data.author, 
      message: data.message, 
      time: data.time 
    });
  });

  socket.on("disconnect", (roomId: string): void => {
    console.log(`a user disconnected: ${roomId}`);
  });
});



// Server Listening

server.listen(port, (): void => console.log(`Server Running on http://localhost:${port}/`));
