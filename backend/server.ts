import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
   res.send('Backend engine is running!');
});

// Start server
app.listen(PORT, () => {
   console.log(`Server started on port ${PORT}`);
});