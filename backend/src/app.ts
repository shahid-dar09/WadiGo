import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import v1Router from './routes/api/v1/index.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { ApiResponse } from './utils/api-response.js';

const app = express();

// Security and utility middleware
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Version 1
app.use('/api/v1', v1Router);

// 404 Handler
app.use((_req, res) => {
  res.status(404).json(ApiResponse.error('API endpoint not found'));
});

// Central Error Handling Middleware
app.use(errorMiddleware);

export default app;
