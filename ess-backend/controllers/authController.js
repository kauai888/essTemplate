const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Dummy users (replace with DB later)
const users = [
  { id: 1, username: 'employee1', password: bcrypt.hashSync('password123', 8), role: 'employee' },
  { id: 2, username: 'manager1', password: bcrypt.hashSync('managerpass', 8), role: 'approver' }
];

exports.login = (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const validPassword = bcrypt.compareSync(password, user.password);
  if (!validPassword) return res.status(401).json({ message: 'Invalid password' });

  const token = jwt.sign({ id: user.id, role: user.role }, 'secretKey', { expiresIn: '1h' });

  res.json({
    message: 'Login successful',
    token,
    role: user.role
  });
};
