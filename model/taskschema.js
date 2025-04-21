const { getPool } = require('../db');

const createTaskTable = async () => {
  try {
    const pool = getPool();
    const query = `
      CREATE TABLE IF NOT EXISTS taskTable (
        task_id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES userTable(user_id),
        title VARCHAR(100) NOT NULL,
        description TEXT,
        status VARCHAR(20) DEFAULT 'pending'
      );
    `;
    await pool.query(query);
    console.log('✅ taskTable created or already exists');
  } catch (error) {
    console.error('❌ Error creating taskTable:', error);
  }
};

module.exports = {
  createTaskTable // ✅ Make sure this is exported
};
