const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Ensure this path is correct
const AuthRouter=require('./Routes/AuthRouter')
const bodyParser = require('body-parser');
const errorMiddleware = require('./Middlewares/errorMiddleware');
const ImageUploadRouter = require('./Routes/ImageUploadRouter'); 
const UserRoutes=require('./Routes/UserRoutes');
const ImageGeneratorRouter=require('./Routes/ImageGenerator');
const ContactRouter=require('./Routes/Contact');
const Subscribe=require('./Routes/PaymentRoute');
const path = require('path');


require('dotenv').config();

const app = express();
app.use(cors());
// app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/imagegenerator", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error: ', err));


app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use('/auth',AuthRouter)
app.use('/api', ImageUploadRouter);
app.use('/api',UserRoutes);
app.use('/api',ImageGeneratorRouter);
app.use('/api',ContactRouter);
app.use('/api',Subscribe);

// Error handling middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
