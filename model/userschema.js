const { getPool } = require('../db'); // ✅ Import getPool

const createUserTable = async () => {
  try {
    const pool = getPool(); // ✅ Get initialized pool
    const query = `
      CREATE TABLE IF NOT EXISTS userTable (
        user_id SERIAL PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL
      );
    `;
    await pool.query(query);
    console.log('✅ userTable created or already exists');
  } catch (error) {
    console.error('❌ Error creating userTable:', error);
  }
};

module.exports = {
  createUserTable
};
