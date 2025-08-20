import { Pool, PoolConfig } from 'pg';

const dbConfig: PoolConfig = {
  connectionString: process.env['DATABASE_URL'],
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
};

// Create a new pool instance
const pool = new Pool(dbConfig);

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Test database connection
export const testConnection = async (): Promise<void> => {
  try {
    const client = await pool.connect();
    console.log('✅ Database connection successful');
    client.release();
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    throw err;
  }
};

// Get a client from the pool
export const getClient = () => pool.connect();

// Execute a query
export const query = (text: string, params?: any[]) => pool.query(text, params);

// Close the pool
export const closePool = () => pool.end();

export default pool;
