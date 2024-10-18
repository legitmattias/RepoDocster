import express from 'express'
import { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import httpContext from 'express-http-context'
import helmet from 'helmet'
import { randomUUID } from 'node:crypto'
import http from 'node:http'
import { router } from './routes/router'

const app = express()
const PORT = process.env.PORT || 4000

// Enable CORS.
app.use(cors({
  origin: ['http://localhost:3000'],  // The React frontend.
  credentials: true
}))

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

// Register router.
app.use('/', router)

// Error handler middleware.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {

  // Default to 500 if no status code is provided.
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500
  const message = err.message || 'Internal Server Error'

  res.status(statusCode).json({
    status_code: statusCode,
    message: message
  })
})

// Start the server.
http.createServer(app).listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
