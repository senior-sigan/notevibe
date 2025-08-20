import { query } from '../config/database.ts';
import pino from 'pino'

const logger = pino();

// Create users table
export const createUsersTable = async (): Promise<void> => {
  const createUsersTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await query(createUsersTableQuery);
    logger.info('✅ Users table created successfully');
  } catch (error) {
    logger.error({ err }, '❌ Error creating users table');
    throw error;
  }
};

// Create notes table
export const createNotesTable = async (): Promise<void> => {
  const createNotesTableQuery = `
    CREATE TABLE IF NOT EXISTS notes (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      content TEXT,
      is_public BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await query(createNotesTableQuery);
    logger.info('✅ Notes table created successfully');
  } catch (err) {
    logger.error({ err }, '❌ Error creating notes table');
    throw err;
  }
};

// Create updated_at trigger function
export const createUpdatedAtTrigger = async (): Promise<void> => {
  const createTriggerFunctionQuery = `
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    $$ language 'plpgsql';
  `;

  try {
    await query(createTriggerFunctionQuery);
    logger.info('✅ Updated at trigger function created successfully');
  } catch (err) {
    logger.error({ err }, '❌ Error creating trigger function');
    throw err;
  }
};

// Create triggers for updated_at
export const createTriggers = async (): Promise<void> => {
  const createUsersTriggerQuery = `
    DROP TRIGGER IF EXISTS update_users_updated_at ON users;
    CREATE TRIGGER update_users_updated_at
      BEFORE UPDATE ON users
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  `;

  const createNotesTriggerQuery = `
    DROP TRIGGER IF EXISTS update_notes_updated_at ON notes;
    CREATE TRIGGER update_notes_updated_at
      BEFORE UPDATE ON notes
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  `;

  try {
    await query(createUsersTriggerQuery);
    await query(createNotesTriggerQuery);
    logger.info('✅ Triggers created successfully');
  } catch (err) {
    logger.error({ err }, '❌ Error creating triggers');
    throw err;
  }
};

// Run all migrations
export const runMigrations = async (): Promise<void> => {
  try {
    logger.info('🔄 Running database migrations...');
    await createUsersTable();
    await createNotesTable();
    await createUpdatedAtTrigger();
    await createTriggers();
    logger.info('✅ All migrations completed successfully');
  } catch (err) {
    logger.error({ err }, '❌ Migration failed');
    throw err;
  }
};
