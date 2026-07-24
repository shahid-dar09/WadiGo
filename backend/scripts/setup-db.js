import mysql from 'mysql2/promise';

async function initDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
    });

    console.log('🔌 Connected to local XAMPP MySQL server.');
    await connection.query('CREATE DATABASE IF NOT EXISTS wadigo_db;');
    console.log('✅ Database "wadigo_db" created or verified successfully.');
    await connection.end();
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    process.exit(1);
  }
}

initDatabase();
