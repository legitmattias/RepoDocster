import express from 'express'
import { Request, Response } from 'express'
import cors from 'cors'
import httpContext from 'express-http-context'
import helmet from 'helmet'
import { randomUUID } from 'node:crypto'
import http from 'node:http'
import { router } from './routes/router.js'
import BackendConfig from './config/BackendConfig.js'
import HttpError from './utils/HttpError'

try {
  // Convert process.env.PORT to a number or default to 4000 if not set.
  const port = Number(process.env.PORT) || 4000

  // Initialize Config.
  const config = new BackendConfig(
    port,
    process.env.GITHUB_TOKEN || '',
    process.env.GITHUB_API_URL || 'https://api.github.com',
    process.env.GITHUB_ACCEPT_HEADER || 'application/vnd.github.v3.raw'
  )

  const app = express()

  // Enable CORS.
  app.use(
    cors({
      origin: ['http://localhost:3000'], // The React frontend.
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

  // Register router.
  app.use('/', router(config))

  // Error handler middleware.
  app.use((err: HttpError, req: Request, res: Response) => {
    const statusCode = err.status || 500

    // Use HTTP status code description or fallback to a generic message.
    let message =
      err.message ||
      http.STATUS_CODES[statusCode] ||
      'An unexpected condition was encountered.'

    // Set message based on status code for common cases.
    switch (statusCode) {
      case 400:
        message = 'Client Error: Validation or request issue.'
        break
      case 401:
        message = 'Unauthorized: Invalid or missing credentials.'
        break
      case 404:
        message = 'Not Found: The requested resource was not found.'
        break
      case 409:
        message = 'Conflict: The resource is already registered.'
        break
    }

    if (process.env.NODE_ENV === 'production') {
      // Production: Only return status code and message.
      res.status(statusCode).json({
        status_code: statusCode,
        message,
      })
    } else {
      // Development: Return status code, message, and full error stack for debugging.
      res.status(statusCode).json({
        status_code: statusCode,
        message,
        stack: err.stack,
      })
    }
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
