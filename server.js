const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
// // Middleware 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Главная страница
app.get('/', (req, res) => {
  res.render('home');
});

// страниц входа и регистрации
app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/register', (req, res) => {
  res.render('register');
});

// API-эндпоинты (авторизация, регистрация и т.д.)
const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes);

// MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connection to MongoDB is established');
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`The server is running on the port ${PORT}`));
})
.catch(err => console.error(err));