const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./data/db');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// === CARS ===
app.route('/cars')
  // GET all cars
  .get((req, res) => {
    db.query('SELECT id, brand, model, year, status, img_url, fuel_type, price FROM cars', (err, results) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.json(results);
    });
  })
  // POST a new car
  .post((req, res) => {
    const {
      brand,
      model,
      year,
      status = 'available', // Default value
      img_url,
      fuel_type,
      price
    } = req.body;

    // Validate required fields
    if (!brand || !model || !year || !fuel_type || !price) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const sql = `
      INSERT INTO cars (brand, model, year, status, img_url, fuel_type, price)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [brand, model, year, status, img_url, fuel_type, price],
      (err, result) => {
        if (err) return res.status(500).json({ message: 'Server error' });

        res.status(201).json({
          message: 'Car added successfully',
          id: result.insertId,
          brand,
          model,
          year,
          status,
          img_url,
          fuel_type,
          price
        });
      }
    );
  });

app.route('/cars/:id')
  // PUT full update
  .put((req, res) => {
    const { id } = req.params;
    const {
      brand,
      model,
      year,
      status,
      img_url,
      fuel_type,
      price
    } = req.body;

    // Validate required fields
    if (!brand || !model || !year || !fuel_type || !price) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const sql = `
      UPDATE cars SET 
        brand = ?, 
        model = ?, 
        year = ?, 
        status = ?, 
        img_url = ?, 
        fuel_type = ?, 
        price = ?
      WHERE id = ?
    `;

    db.query(
      sql,
      [brand, model, year, status, img_url, fuel_type, price, id],
      (err) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        
        // Verify if any rows were affected
        db.query('SELECT ROW_COUNT() as affectedRows', (err, result) => {
          if (err) return res.status(500).json({ message: 'Server error' });
          
          if (result[0].affectedRows === 0) {
            return res.status(404).json({ message: 'Car not found' });
          }
          
          res.json({
            message: 'Car updated',
            id,
            brand,
            model,
            year,
            status,
            img_url,
            fuel_type,
            price
          });
        });
      }
    );
  })
  // PATCH partial update
  .patch((req, res) => {
    const { id } = req.params;
    const updates = req.body;

    // Validate at least one field is provided
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    // Prepare fields to update
    const fields = [];
    const values = [];
    const validFields = ['brand', 'model', 'year', 'status', 'img_url', 'fuel_type', 'price'];

    Object.entries(updates).forEach(([key, value]) => {
      if (validFields.includes(key) && value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (fields.length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    values.push(id);
    const sql = `UPDATE cars SET ${fields.join(', ')} WHERE id = ?`;

    db.query(sql, values, (err) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      
      // Verify if any rows were affected
      db.query('SELECT ROW_COUNT() as affectedRows', (err, result) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        
        if (result[0].affectedRows === 0) {
          return res.status(404).json({ message: 'Car not found' });
        }
        
        res.json({ 
          message: 'Car updated',
          id,
          ...updates
        });
      });
    });
  })
  // DELETE car
  .delete((req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM cars WHERE id = ?', [id], (err, result) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Car not found' });
      }
      
      res.json({ message: 'Car deleted successfully' });
    });
  });


// === USERS ===
app.route('/users')
  // GET all users
  .get((req, res) => {
    db.query('SELECT id, name, email, role, created_at FROM users', (err, results) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.json(results);
    });
  })
  // POST create user
  .post((req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, email, password, role || 'client'], (err, result) => {
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
        role: role || 'client'
      });
    });
  });

app.route('/users/:id')
  // PUT update user
  .put((req, res) => {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    const fields = [];
    const values = [];

    if (name) { fields.push('name = ?'); values.push(name); }
    if (email) { fields.push('email = ?'); values.push(email); }
    if (password) { fields.push('password = ?'); values.push(password); }
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
  })
  // DELETE user
  .delete((req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM users WHERE id = ?', [id], (err) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.json({ message: 'User deleted' });
    });
  });


// === RESERVATIONS ===
app.route('/reservations')
  // GET all reservations
  .get((req, res) => {
    const sql = `
      SELECT r.id, r.user_id, u.name AS user_name, r.car_id, c.brand, c.model, r.start_date, r.end_date, r.status
      FROM reservations r
      JOIN users u ON r.user_id = u.id
      JOIN cars c ON r.car_id = c.id
    `;

    db.query(sql, (err, results) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.json(results);
    });
  })
  // POST new reservation
  .post((req, res) => {
    const { user_id, car_id, start_date, end_date } = req.body;

    if (!user_id || !car_id || !start_date || !end_date) {
        return res.status(400).json({ message: 'Missing fields' });
    }

    const sql = 'INSERT INTO reservations (user_id, car_id, start_date, end_date, status) VALUES (?, ?, ?, ?, "pending")';
    
    db.query(sql, [user_id, car_id, start_date, end_date], (err, result) => {
        if (err) return res.status(500).json({ message: 'Server error' });

        res.status(201).json({
            message: 'Reservation created successfully',
            id: result.insertId,
            user_id,
            car_id,
            start_date,
            end_date,
            status: 'pending'
        });
    });
});



app.route('/reservations/:id')
  // PUT update reservation status (approve/reject)
  .put((req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const sql = 'UPDATE reservations SET status = ? WHERE id = ?';
    db.query(sql, [status, id], (err) => {
      if (err) return res.status(500).json({ message: 'Server error' });

      res.json({ message: `Reservation ${status}`, id });
    });
  })
  // DELETE reservation
  .delete((req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM reservations WHERE id = ?', [id], (err) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.json({ message: 'Reservation deleted successfully' });
    });
  });

// === Start Server ===
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
