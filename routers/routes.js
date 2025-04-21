// routes.js

const express = require('express');
const router = express.Router();

// Controllers
const userController = require('../controllers/userController');
const taskController = require('../controllers/taskController');

// --- USER AUTH ROUTES ---
router.get('/signup', userController.signupPage);
router.post('/signup', userController.signup);

router.get('/login', userController.loginPage);
router.post('/login', userController.login);

router.get('/logout', userController.logout);

// --- TASK ROUTES (protected) ---
router.get('/taskpage', taskController.taskPage);
router.post('/addtask', taskController.addTask);
router.post('/edittask/:task_id', taskController.editTask);
router.get('/deletetask/:task_id', taskController.deleteTask);

module.exports = router;
