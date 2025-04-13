const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const express = require('express');
const http = require('http');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const { createAdapter } = require('@socket.io/redis-adapter');
const redis = require('./db/redis');
const db = require('./db/database');
dotenv.config();
const rateLimit = require('./middleware/RateLimiterMiddleware');
const AuthController = require('./controllers/AuthController');
const { authenticate, authorize } = require('./middleware/AuthMiddleware');

const ProductRoutes = require('./routes/ProductRoutes');
const StockMovementRoutes = require('./routes/StockMovementRoutes');
const StoreRoutes = require('./routes/StoreRoutes');
const SupplierRoutes = require('./routes/SupplierRoutes');
const UserRoutes = require('./routes/UserRoutes');
const StoreStockRoutes = require('./routes/StoreStockRoutes');
const ReportRoutes = require('./routes/ReportRoutes');
if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  
  db.setupDatabases();
  db.testConnections().then(() => {
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
  });

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died with code ${code}`);
    if (code !== 0 && !worker.exitedAfterDisconnect) {
      console.log('Starting a new worker...');
      cluster.fork();
    }
  });

  process.on('SIGINT', () => {
    console.log('Master shutting down...');
    for (const id in cluster.workers) {
      cluster.workers[id].kill();
    }
    process.exit(0);
  });
} 
else {
  const app = express();
  const server = http.createServer(app);
  const PORT = process.env.PORT || 3000;

  const io = require('socket.io')(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    },
    adapter: createAdapter(redis.duplicate(), redis.duplicate()),
    transports: ['websocket'],
    pingTimeout: 60000,
    pingInterval: 25000
  });

  const stockNamespace = io.of('/stock-updates');
  
  stockNamespace.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.query.token;
      if (!token) throw new Error('Authentication token missing');
      
      const user = await require('./middleware/AuthMiddleware').verifyToken(token);
      if (!user) throw new Error('Invalid user');
      
      socket.user = user;
      next();
    } catch (err) {
      console.error(`Worker ${process.pid} auth error:`, err.message);
      next(new Error('Authentication failed'));
    }
  });

  stockNamespace.on('connection', (socket) => {
    console.log(`Worker ${process.pid}: New client connected (ID: ${socket.id})`);
    
    socket.on('subscribe', ({ storeId, productId }, callback) => {
      if (!storeId || !productId) {
        return callback({ error: 'Missing storeId or productId' });
      }
      
      const room = `store:${storeId}:product:${productId}`;
      socket.join(room);
      console.log(`Worker ${process.pid}: Client subscribed to ${room}`);
      callback({ status: 'subscribed', room });
    });
    
    socket.on('unsubscribe', ({ storeId, productId }) => {
      const room = `store:${storeId}:product:${productId}`;
      socket.leave(room);
    });

    socket.on('error', (err) => {
      console.error(`Worker ${process.pid} socket error:`, err);
    });

    socket.on('disconnect', (reason) => {
      console.log(`Worker ${process.pid}: Client disconnected (Reason: ${reason})`);
    });
  });

  app.set('socketio', stockNamespace);

  app.use((req, res, next) => {
    res.set('X-Worker-ID', process.pid);
    next();
  });

  app.use(rateLimit);
  app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  }));
  app.use(cookieParser());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  app.get('/health', async (req, res) => {
    try {
      await db.sequelize.query('SELECT 1');
      
      res.json({
        status: 'healthy',
        worker: process.pid,
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        connections: (server._connections || 0)
      });
    } catch (error) {
      res.status(500).json({
        status: 'unhealthy',
        error: error.message
      });
    }
  });

  app.post('/login', AuthController.login);

  app.use(authenticate);
  app.use('/products', authorize(['admin', 'store-manager']), ProductRoutes);
  app.use('/stock', authorize(['admin', 'store-manager']), StockMovementRoutes);
  app.use('/stores', authorize(['admin', 'store-manager']), StoreRoutes);
  app.use('/suppliers', authorize(['admin', 'supplier']), SupplierRoutes);
  app.use('/users', authorize(['admin']), UserRoutes);
  app.use('/store-stock', authorize(['admin', 'store-manager', 'analytics']), StoreStockRoutes);
  app.use('/report', authorize(['analytics']), ReportRoutes);

  app.use((err, req, res, next) => {
    console.error(`Worker ${process.pid} Error:`, {
      path: req.path,
      method: req.method,
      error: err.stack
    });
    
    res.status(err.status || 500).json({
      error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
      worker: process.pid
    });
  });

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Worker ${process.pid} listening on port ${PORT}`);
  }).on('error', (err) => {
    console.error(`Worker ${process.pid} failed to start:`, err);
    process.exit(1);
  });

  const gracefulShutdown = () => {
    console.log(`Worker ${process.pid} shutting down...`);
    
    server.close(() => {
      io.close(() => {
        console.log(`Worker ${process.pid} closed all connections`);
        process.exit(0);
      });
    });

    setTimeout(() => {
      console.error(`Worker ${process.pid} shutdown timeout - forcing exit`);
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
}



