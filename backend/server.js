const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./data/db'); // Adjust path if needed
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SALT_ROUNDS = 10;
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// === CARS ===
app.route('/cars')
  .get((req, res) => {
    db.query('SELECT * FROM cars', (err, results) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.json(results);
    });
  })
  .post((req, res) => {
    const { brand, model, year, fuel_type, price, status = 'available', img_url } = req.body;

    if (!brand || !model || !year || !fuel_type || !price) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const sql = `INSERT INTO cars (brand, model, year, fuel_type, price, status, img_url)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.query(sql, [brand, model, year, fuel_type, price, status, img_url], (err, result) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.status(201).json({ message: 'Car added', id: result.insertId });
    });
  });

// Get single car by ID
app.get('/cars/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM cars WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    if (results.length === 0) return res.status(404).json({ message: 'Car not found' });
    res.json(results[0]);
  });
});

app.route('/cars/:id')
  .put((req, res) => {
    const { id } = req.params;
    const { brand, model, year, fuel_type, price, status, img_url } = req.body;

    const sql = `UPDATE cars SET brand=?, model=?, year=?, fuel_type=?, price=?, status=?, img_url=? WHERE id=?`;
    db.query(sql, [brand, model, year, fuel_type, price, status, img_url, id], (err) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.json({ message: 'Car updated', id });
    });
  })
  .patch((req, res) => {
    const { id } = req.params;
    const fields = Object.entries(req.body);
    if (!fields.length) return res.status(400).json({ message: 'No fields to update' });

    const updates = fields.map(([key, _]) => `${key} = ?`).join(', ');
    const values = fields.map(([_, value]) => value);
    values.push(id);

    db.query(`UPDATE cars SET ${updates} WHERE id = ?`, values, (err) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.json({ message: 'Car updated', id });
    });
  })
  .delete((req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM cars WHERE id = ?', [id], (err) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.json({ message: 'Car deleted' });
    });
  });

// === USERS ===
app.route('/users')
  .get((req, res) => {
    db.query('SELECT id, name, email, role, created_at FROM users', (err, results) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.json(results);
    });
  })
  .post(async (req, res) => {
    const { name, email, password, role = 'client' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
      db.query(sql, [name, email, hashedPassword, role], (err, result) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Email already used' });
          }
          return res.status(500).json({ message: 'Server error' });
        }

        res.status(201).json({
          message: 'User created',
          id: result.insertId,
          name,
          email,
          role
        });
      });
    } catch (err) {
      return res.status(500).json({ message: 'Password hashing failed' });
    }
  });

// Get single user by ID
app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT id, name, email, role FROM users WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    if (results.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(results[0]);
  });
});

app.route('/users/:id')
  .put(async (req, res) => {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    const fields = [];
    const values = [];

    if (name) { fields.push('name = ?'); values.push(name); }
    if (email) { fields.push('email = ?'); values.push(email); }

    if (password) {
      try {
        const hashed = await bcrypt.hash(password, SALT_ROUNDS);
        fields.push('password = ?');
        values.push(hashed);
      } catch (err) {
        return res.status(500).json({ message: 'Password hashing failed' });
      }
    }

    if (role) { fields.push('role = ?'); values.push(role); }

    if (fields.length === 0) {
      return res.status(400).json({ message: 'Nothing to update' });
    }

    values.push(id);
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;

    db.query(sql, values, (err) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ message: 'Email already used' });
        }
        return res.status(500).json({ message: 'Server error' });
      }

      res.json({ message: 'User updated', id });
    });
  });

// User login endpoint
app.post('/users/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    if (results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

    const user = results[0];

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Remove password before sending
    delete user.password;
    res.json({ message: 'Login successful', user });
  });
});

// === REGISTRATION ===
app.post('/register', async (req, res) => {
    const { name, email, password, role = 'client' } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Missing fields' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
        db.query(sql, [name, email, hashedPassword, role], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ message: 'Email already used' });
                }
                return res.status(500).json({ message: 'Server error' });
            }

            res.status(201).json({
                message: 'User created',
                id: result.insertId,
                name,
                email,
                role
            });
        });
    } catch (err) {
        return res.status(500).json({ message: 'Password hashing failed' });
    }
});

// === RESERVATIONS ===
app.route('/reservations')
  .get(authenticateToken, (req, res) => {
    const sql = `
      SELECT r.*, u.name AS user_name, c.brand, c.model 
      FROM reservations r
      JOIN users u ON r.user_id = u.id
      JOIN cars c ON r.car_id = c.id
    `;
    db.query(sql, (err, results) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.json(results);
    });
  })
  .post(authenticateToken, async (req, res) => {
    const { user_id, car_id, start_date, end_date } = req.body;

    // Verify the authenticated user matches the reservation user
    if (req.user.id != user_id) {
      return res.status(403).json({ message: 'Unauthorized user' });
    }

    // Input validation
    if (!user_id || !car_id || !start_date || !end_date) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
      // Check car exists and is available
      const [car] = await db.promise().query(
        'SELECT status FROM cars WHERE id = ? FOR UPDATE', 
        [car_id]
      );
      
      if (!car.length) return res.status(404).json({ message: 'Car not found' });
      if (car[0].status !== 'available') {
        return res.status(400).json({ message: 'Car is not available' });
      }

      // Create reservation
      const [result] = await db.promise().query(
        `INSERT INTO reservations (user_id, car_id, start_date, end_date, status)
         VALUES (?, ?, ?, ?, 'pending')`,
        [user_id, car_id, start_date, end_date]
      );

      // Update car status
      await db.promise().query(
        'UPDATE cars SET status = "unavailable" WHERE id = ?',
        [car_id]
      );

      res.status(201).json({ 
        message: 'Reservation created',
        id: result.insertId 
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ 
        message: 'Database error',
        error: err.message 
      });
    }
  });

app.route('/reservations/:id')
  .put((req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ['pending', 'approved', 'rejected', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const sql = 'UPDATE reservations SET status = ? WHERE id = ?';
    db.query(sql, [status, id], (err) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.json({ message: `Reservation ${status}` });
    });
  })
  .delete((req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM reservations WHERE id = ?', [id], (err) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.json({ message: 'Reservation deleted' });
    });
  });

// === AUTHENTICATION ===
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    if (results.length === 0) return res.status(401).json({ message: 'Invalid email or password' });

    const user = results[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  });
});

// Middleware to protect routes
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer TOKEN

  if (!token) return res.status(401).json({ message: 'Token missing' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user; // attach user data to request
    next();
  });
}

app.get('/secure-data', authenticateToken, (req, res) => {
  res.json({ message: 'Secure info', user: req.user });
});

// === START SERVER ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
