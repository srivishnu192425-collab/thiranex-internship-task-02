require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');

const { initDB } = require('./config/db');
const { initSocket } = require('./socket/socketHandler');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});
initSocket(io);

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });
}

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Thiranex Task Management API',
    version: '1.0.0'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

initDB().then(() => {
  server.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`  Task Management API Server Running!`);
    console.log(`  Local URL:   http://localhost:${PORT}`);
    console.log(`  Health:      http://localhost:${PORT}/api/health`);
    console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`===============================================`);
  });
});

module.exports = { app, server };
