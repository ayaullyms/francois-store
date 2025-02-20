const jwt = require('jsonwebtoken');

const getProfile = (req, res) => {
  const token = req.query.token;
  if (!token) {
    return res.redirect('/');
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.render('profile', { user: decoded, token: token });
  } catch (error) {
    console.error('Profile token error:', error);
    return res.redirect('/');
  }
};

module.exports = { getProfile };
