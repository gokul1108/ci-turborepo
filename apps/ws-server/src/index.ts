import prisma from '@repo/db/client';
import { WebSocketServer } from 'ws';
 const server = new WebSocketServer({ port: 3003 });


 server.on('connection', (socket) => {
    socket.on('message', (message) => {
        console.log('received: %s', message);
    });

    socket.send('Hello! Message From Server!!');

 });