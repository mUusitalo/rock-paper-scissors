import express from 'express';
const app = express();
import http from 'http';
const server = http.createServer(app);
import { Server } from 'socket.io'
const io = new Server(server);
import { SERVER_PORT } from './server/config'

io.on('connection', (socket) => {
  console.log('User connected');
});

server.listen(SERVER_PORT, () => {
  console.log(`Listening on ${SERVER_PORT}`);
});