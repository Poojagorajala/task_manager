const { getPool } = require('../db');

const insertTask = async (user_id, title, description) => {
  const pool = getPool();
  try {
    const result = await pool.query(
      'INSERT INTO taskTable (user_id, title, description) VALUES ($1, $2, $3) RETURNING *', 
      [user_id, title, description]

    );
  
    return result.rows[0];
  } catch (error) {
    console.error("Error inserting task:", error);
    throw error;
  }
};

const getTasksByUser = async (user_id) => {
  const pool = getPool();
  try {
    const result = await pool.query(
      'SELECT * FROM taskTable WHERE user_id = $1',
      [user_id]
    );
    return result.rows;
  } catch (error) {
    console.error("Error retrieving tasks:", error);
    throw error;
  }
};

const updateTask = async (user_id, task_id, title, description, status) => {
  const pool = getPool();
  try {
    const result = await pool.query(
      `UPDATE taskTable
       SET title = $3, description = $4, status = $5
       FROM userTable
       WHERE taskTable.task_id = $1
         AND taskTable.user_id = userTable.user_id
         AND userTable.user_id = $2
       RETURNING taskTable.*`,
      [task_id, user_id, title, description, status]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};


// const updateTask = async (user_id, task_id, title, description) => {
//   const pool = getPool();
//   try {
//     const result = await pool.query(
//       'UPDATE taskTable SET title = $3,description = $4 ,status = $5 WHERE task_id = $1 AND user_id = $2 RETURNING *',
//       [task_id, user_id, title, description,]
//     );
//     return result.rows[0];
//   } catch (error) {
//     console.error("Error updating task:", error);
//     throw error;
//   }
// };

const deleteTask = async (user_id, task_id) => {
  const pool = getPool();
  try {
    const result = await pool.query(
      'DELETE FROM taskTable WHERE task_id = $1 AND user_id = $2 RETURNING *',
      [task_id, user_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};



exports.taskPage = async (req, res) => {
    if (req.session.user) {
      res.set('Cache-Control', 'no-store');
      try {
        const tasks = await getTasksByUser(req.session.user.id);
        res.render('taskpage', { user: req.session.user, tasks });
      } catch (error) {
        console.error("Error loading tasks:", error);
        res.status(500).send("Could not load tasks.");
      }
    } else {
      res.redirect('/login');
    }
  };
  
  exports.addTask = async (req, res) => {
    const { title,description } = req.body;
    console.log(req.body);
    const user_id = req.session.user?.id;
    try {
      await insertTask(user_id, title,description);
      res.redirect('/taskpage');
    } catch (error) {
      console.error("Error adding task:", error);
      res.status(500).send("Failed to add task.");
    }
  };
  
  exports.editTask = async (req, res) => {
    const { task_id } = req.params;
    const { title ,description,status} = req.body;
    
    const user_id = req.session.user?.id;
    try {
      await updateTask(user_id, task_id, title,description,status);
      res.redirect('/taskpage');
    } catch (error) {
      console.error("Error editing task:", error);
      res.status(500).send("Failed to edit task.");
    }
  };
  
  exports.deleteTask = async (req, res) => {
    const { task_id } = req.params;
    const user_id = req.session.user?.id;
    try {
      await deleteTask(user_id, task_id);
      res.redirect('/taskpage');
    } catch (error) {
      console.error("Error deleting task:", error);
      res.status(500).send("Failed to delete task.");
    }
  };