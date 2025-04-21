const bcrypt = require('bcryptjs');
const { getPool } = require('../db');

// --- MODEL FUNCTIONS ---

const insertUser = async (username, email, password) => {
  const pool = getPool();
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO userTable (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, hashedPassword]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error inserting user:", error);
    throw error;
  }
};

const getUserByEmail = async (email) => {
  const pool = getPool();
  try {
    const result = await pool.query(
      'SELECT * FROM userTable WHERE email = $1',
      [email]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw error;
  }
};


// --- CONTROLLER FUNCTIONS ---

exports.signupPage = (req, res) => {
  res.render('signup');
};

exports.signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    await insertUser(username, email, password);
    res.redirect('/login');
  } catch (err) {
    console.error('Signup failed:', err);
    res.status(500).send('Signup failed: ' + err.message);
  }
};

exports.loginPage = (req, res) => {
  res.render('login');
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await getUserByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      req.session.user = {
        id: user.user_id,
        username: user.username,
        email: user.email
      };
      res.redirect('/taskpage');
    } else {
      res.send('Invalid email or password');
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send('Server error during login');
  }
};



exports.logout = (req, res) => {
    req.session.destroy(() => {
      res.redirect('/login');
    });
  };
  