const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const xss = require('xss-clean');
const propertyRoutes = require('./routes/propertyRoutes');
const errorHandler = require('./middlewares/errorHandler');
const ensureTableSchema = require('./config/checkSchema');

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(cors());
app.use(xss());  // Sanitizes all incoming request data to remove malicious content

// API routes
app.use('/api/property', propertyRoutes);

// Error handler middleware
app.use(errorHandler);

// Ensure table schema is correct
ensureTableSchema();

// Server startup
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
