const express = require('express');
const session = require('express-session');
const path = require('path');
const { setupDatabase } = require('./db');

const {createUserTable}= require("./model/userschema")

// const createTaskTable = require("./model/taskschema")
const { createTaskTable } = require('./model/taskschema');


const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

// ✅ Make sure this file exists and named correctly: routes/authRoutes.js
app.use('/', require('./routers/routes'));

(async () => {
  try {
    await setupDatabase();
    await createUserTable();
    await createTaskTable();

    const PORT = 3000;
    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Server startup error:', error);
  }
})();
