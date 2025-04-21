const { Pool } = require('pg');

let pool;

const setupDatabase = async () => {
    const tempPool = new Pool({
        user: 'postgres',
        host: 'localhost',
        password: 'pooja',
        port: 5432,
        database: 'postgres'
    });

    try {
        await tempPool.query('CREATE DATABASE taskdb');
        console.log('✅ Database "taskdb" created');
    } catch (err) {
        if (err.code === '42P04') {
            console.log('ℹ️  Database "taskdb" already exists');
        } else {
            console.error('❌ Error creating database:', err);
        }
    } finally {
        await tempPool.end();
    }

    pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'taskdb',
        password: 'pooja',
        port: 5432
    });

    try {
        await pool.query('SELECT NOW()');
        console.log('✅ Connected to "taskdb"!');
    } catch (err) {
        console.error('❌ Failed to connect to "taskdb":', err);
    }
};

const getPool = () => {
    if (!pool) {
        throw new Error('❌ Pool is not initialized. Call setupDatabase() first.');
    }
    return pool;
};

module.exports = {
    setupDatabase,
    getPool
};
