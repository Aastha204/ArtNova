const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Ensure this path is correct
const AuthRouter=require('./Routes/AuthRouter')
const bodyParser = require('body-parser');
const errorMiddleware = require('./Middlewares/errorMiddleware');

require('dotenv').config();

const app = express();
app.use(cors());
// app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/imagegenerator", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error: ', err));


app.use('/auth',AuthRouter)

// Error handling middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
