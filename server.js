const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware 
app.use(express.json());
app.use(express.static('views'));

app.use('/api', authRoutes);

// MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connection to MongoDB is established');
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`The server is running on the port ${PORT}`));
})
.catch(err => console.error(err));
