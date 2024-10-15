import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())

// JSON parsing middleware
app.use(express.json())

// Simple GET endpoint
app.get('/api/status', (req, res) => {
  res.json({ message: 'RepoDocster backend is running!' })
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
