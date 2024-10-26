import express from 'express'
import { Request, Response } from 'express'
import cors from 'cors'
import httpContext from 'express-http-context'
import helmet from 'helmet'
import { randomUUID } from 'node:crypto'
import http from 'node:http'
import AppRouter from './routes/AppRouter.js'
import BackendConfig from './config/BackendConfig.js'
import HttpError from './utils/HttpError.js'

try {
  // Initialize Config.
  const config = new BackendConfig()

  const app = express()

  // Enable CORS.
  app.use(
    cors({
      origin: ['http://localhost:3000', 'https://repodocster-frontend.onrender.com/'],
      credentials: true,
    })
  )

  // Set HTTP headers for security.
  app.use(helmet())

  // Parse incoming JSON requests.
  app.use(express.json())

  // Add request-scoped context.
  app.use(httpContext.middleware)

  // Middleware for logging request info and setting a request UUID.
  app.use((req, res, next) => {
    req.requestUuid = randomUUID()
    httpContext.set('request', req)
    next()
  })

  // Log request information
  app.use((req, res, next) => {
    console.log(`Received request: ${req.method} ${req.url}`)
    next()
  })

  // Init and register router.
  const appRouter = new AppRouter(config)
  app.use('/', appRouter.getRouter())

  // Error handler middleware.
  app.use((err: HttpError, req: Request, res: Response) => {
    const statusCode = err.status || 500

    // Use HTTP status code description or fallback to a generic message.
    const message =
      err.message ||
      http.STATUS_CODES[statusCode] ||
      'An unexpected condition was encountered.'

    // Log the error for debugging.
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        `Error: ${message}\nStatus: ${statusCode}\nStack: ${err.stack}`
      )
    }

    // Production: Only return status code and message, in development also return error stack.
    res.status(statusCode).json({
      status_code: statusCode,
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    })
  })

  // Start the server.
  const httpServer = http.createServer(app)
  httpServer.listen(config.getPort(), () => {
    const address = httpServer.address()
    if (address && typeof address !== 'string') {
      console.log(`Server running at http://localhost:${address.port}`)
    } else {
      console.log('Server running')
    }
  })
} catch (err) {
  console.error('Failed to start server:', (err as Error).message)
  process.exitCode = 1
}
