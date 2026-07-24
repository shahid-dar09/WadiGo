import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import app from './app.js';
import { env } from './config/env.js';
import { prisma } from './config/prisma.js';

const server = http.createServer(app);

// Initialize Socket.IO
const io = new SocketIOServer(server, {
  cors: {
    origin: env.CORS_ORIGIN,
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`🔌 Client connected to Socket.IO: ${socket.id}`);

  socket.on('join_order_room', (orderId: string) => {
    socket.join(`order:${orderId}`);
    console.log(`Socket ${socket.id} joined room: order:${orderId}`);
  });

  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected from Socket.IO: ${socket.id}`);
  });
});

async function main() {
  try {
    // Verify DB connectivity
    await prisma.$connect();
    console.log('✅ Database connected successfully via Prisma Client');

    server.listen(Number(env.PORT), () => {
      console.log(`🚀 WadiGo API Server running on http://localhost:${env.PORT}`);
      console.log(`📡 Socket.IO Realtime Gateway initialized on port ${env.PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

main();
