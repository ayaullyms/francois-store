const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Проверка на существование пользователя
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User with this email already exists' });

    // Создаем пользователя. Если role не указана, будет использовано значение по умолчанию ('user')
    user = new User({ name, email, password, role });
    await user.save();

    res.status(201).json({ message: 'User has been successfully registered' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Поиск пользователя
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Подписываем JWT-токен с id и ролью пользователя
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login };
