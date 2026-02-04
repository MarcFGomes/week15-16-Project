const express = require('express');
const sequelize = require('./config/connection');
const routes = require('./controllers');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Friendly home route (helps students verify the server is running)
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Menu API is running 🚀',
    tryThese: ['GET /api/sections', 'GET /api/items', 'GET /api/tags'],
  });
});

app.use(routes);

sequelize
  .sync()
  .then(() => {
    console.log('✅ Database connected & models synced');
    console.log(`🌐 Server listening on http://localhost:${PORT}`);
    app.listen(PORT);
  })
  .catch((err) => {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  });
