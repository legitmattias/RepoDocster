import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(express.json());
app.use(cors());

// Basic routes
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Listen on port
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
