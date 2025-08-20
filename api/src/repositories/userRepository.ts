import { query } from '../config/database.ts';
import type { User, CreateUserRequest, UserResponse } from '../types/database.ts';

export class UserRepository {
  // Create a new user
  static async create(userData: CreateUserRequest): Promise<UserResponse> {
    const { username, email, password } = userData;
    
    const createUserQuery = `
      INSERT INTO users (username, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, username, email, created_at, updated_at
    `;

    try {
      const result = await query(createUserQuery, [username, email, password]);
      return result.rows[0];
    } catch (error: any) {
      if (error.code === '23505') { // Unique violation
        if (error.constraint?.includes('username')) {
          throw new Error('Username already exists');
        }
        if (error.constraint?.includes('email')) {
          throw new Error('Email already exists');
        }
      }
      throw new Error('Failed to create user');
    }
  }

  // Find user by ID
  static async findById(id: number): Promise<UserResponse | null> {
    const findUserQuery = `
      SELECT id, username, email, created_at, updated_at
      FROM users
      WHERE id = $1
    `;

    try {
      const result = await query(findUserQuery, [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Failed to find user');
    }
  }

  // Find user by username
  static async findByUsername(username: string): Promise<User | null> {
    const findUserQuery = `
      SELECT id, username, email, password_hash, created_at, updated_at
      FROM users
      WHERE username = $1
    `;

    try {
      const result = await query(findUserQuery, [username]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Failed to find user');
    }
  }

  // Find user by email
  static async findByEmail(email: string): Promise<User | null> {
    const findUserQuery = `
      SELECT id, username, email, password_hash, created_at, updated_at
      FROM users
      WHERE email = $1
    `;

    try {
      const result = await query(findUserQuery, [email]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Failed to find user');
    }
  }

  // Update user
  static async update(id: number, updates: Partial<CreateUserRequest>): Promise<UserResponse | null> {
    const fields = Object.keys(updates);
    if (fields.length === 0) return null;

    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const values = [id, ...Object.values(updates)];

    const updateUserQuery = `
      UPDATE users
      SET ${setClause}
      WHERE id = $1
      RETURNING id, username, email, created_at, updated_at
    `;

    try {
      const result = await query(updateUserQuery, values);
      return result.rows[0] || null;
    } catch (error: any) {
      if (error.code === '23505') { // Unique violation
        throw new Error('Username or email already exists');
      }
      throw new Error('Failed to update user');
    }
  }

  // Delete user
  static async delete(id: number): Promise<boolean> {
    const deleteUserQuery = `
      DELETE FROM users
      WHERE id = $1
    `;

    try {
      const result = await query(deleteUserQuery, [id]);
      return result.rowCount > 0;
    } catch (error) {
      throw new Error('Failed to delete user');
    }
  }

  // Get all users (for admin purposes)
  static async findAll(): Promise<UserResponse[]> {
    const findAllUsersQuery = `
      SELECT id, username, email, created_at, updated_at
      FROM users
      ORDER BY created_at DESC
    `;

    try {
      const result = await query(findAllUsersQuery);
      return result.rows;
    } catch (error) {
      throw new Error('Failed to fetch users');
    }
  }
}
