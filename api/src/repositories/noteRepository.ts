import { query } from '../config/database.ts';
import type { Note, CreateNoteRequest, UpdateNoteRequest, NoteResponse } from '../types/database.ts';

export class NoteRepository {
  // Create a new note
  static async create(userId: number, noteData: CreateNoteRequest): Promise<NoteResponse> {
    const { title, content, is_public = false } = noteData;
    
    const createNoteQuery = `
      INSERT INTO notes (user_id, title, content, is_public)
      VALUES ($1, $2, $3, $4)
      RETURNING id, user_id, title, content, is_public, created_at, updated_at
    `;

    try {
      const result = await query(createNoteQuery, [userId, title, content, is_public]);
      const note = result.rows[0];
      
      // Get author name
      const authorQuery = `SELECT username FROM users WHERE id = $1`;
      const authorResult = await query(authorQuery, [userId]);
      note.author_name = authorResult.rows[0].username;
      
      return note;
    } catch (error) {
      throw new Error('Failed to create note', { cause: error });
    }
  }

  // Find note by ID
  static async findById(id: number, userId?: number): Promise<NoteResponse | null> {
    let findNoteQuery: string;
    let params: any[];

    if (userId) {
      // User can only see their own notes or public notes
      findNoteQuery = `
        SELECT n.id, n.user_id, n.title, n.content, n.is_public, n.created_at, n.updated_at,
               u.username as author_name
        FROM notes n
        JOIN users u ON n.user_id = u.id
        WHERE n.id = $1 AND (n.user_id = $2 OR n.is_public = true)
      `;
      params = [id, userId];
    } else {
      // Public notes only
      findNoteQuery = `
        SELECT n.id, n.user_id, n.title, n.content, n.is_public, n.created_at, n.updated_at,
               u.username as author_name
        FROM notes n
        JOIN users u ON n.user_id = u.id
        WHERE n.id = $1 AND n.is_public = true
      `;
      params = [id];
    }

    try {
      const result = await query(findNoteQuery, params);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Failed to find note', { cause: error });
    }
  }

  // Get all notes for a user
  static async findByUserId(userId: number): Promise<NoteResponse[]> {
    const findNotesQuery = `
      SELECT n.id, n.user_id, n.title, n.content, n.is_public, n.created_at, n.updated_at,
             u.username as author_name
      FROM notes n
      JOIN users u ON n.user_id = u.id
      WHERE n.user_id = $1
      ORDER BY n.updated_at DESC
    `;

    try {
      const result = await query(findNotesQuery, [userId]);
      return result.rows;
    } catch (error) {
      throw new Error('Failed to fetch user notes', { cause: error });
    }
  }

  // Get all public notes
  static async findPublicNotes(): Promise<NoteResponse[]> {
    const findPublicNotesQuery = `
      SELECT n.id, n.user_id, n.title, n.content, n.is_public, n.created_at, n.updated_at,
             u.username as author_name
      FROM notes n
      JOIN users u ON n.user_id = u.id
      ORDER BY n.created_at DESC
    `;

    try {
      const result = await query(findPublicNotesQuery);
      return result.rows;
    } catch (error) {
      throw new Error('Failed to fetch public notes', { cause: error });
    }
  }

  // Update note
  static async update(id: number, userId: number, updates: UpdateNoteRequest): Promise<NoteResponse | null> {
    const fields = Object.keys(updates);
    if (fields.length === 0) return null;

    const setClause = fields.map((field, index) => `${field} = $${index + 3}`).join(', ');
    const values = [id, userId, ...Object.values(updates)];

    const updateNoteQuery = `
      UPDATE notes
      SET ${setClause}
      WHERE id = $1 AND user_id = $2
      RETURNING id, user_id, title, content, is_public, created_at, updated_at
    `;

    try {
      const result = await query(updateNoteQuery, values);
      if (!result.rows[0]) return null;
      
      const note = result.rows[0];
      
      // Get author name
      const authorQuery = `SELECT username FROM users WHERE id = $1`;
      const authorResult = await query(authorQuery, [userId]);
      note.author_name = authorResult.rows[0].username;
      
      return note;
    } catch (error) {
      throw new Error('Failed to update note', { cause: error });
    }
  }

  // Delete note
  static async delete(id: number, userId: number): Promise<boolean> {
    const deleteNoteQuery = `
      DELETE FROM notes
      WHERE id = $1 AND user_id = $2
    `;

    try {
      const result = await query(deleteNoteQuery, [id, userId]);
      return (result.rowCount || 0) > 0;
    } catch (error) {
      throw new Error('Failed to delete note', { cause: error });
    }
  }

  // Search notes by title or content
  static async search(query: string, userId?: number): Promise<NoteResponse[]> {
    let searchQuery: string;
    let params: any[];

    if (userId) {
      // User can search their own notes and public notes
      searchQuery = `
        SELECT n.id, n.user_id, n.title, n.content, n.is_public, n.created_at, n.updated_at,
               u.username as author_name
        FROM notes n
        JOIN users u ON n.user_id = u.id
        WHERE (n.user_id = $1 OR n.is_public = true)
          AND (n.title ILIKE $2 OR n.content ILIKE $2)
        ORDER BY n.updated_at DESC
      `;
      params = [userId, `%${query}%`];
    } else {
      // Public notes only
      searchQuery = `
        SELECT n.id, n.user_id, n.title, n.content, n.is_public, n.created_at, n.updated_at,
               u.username as author_name
        FROM notes n
        JOIN users u ON n.user_id = u.id
        WHERE n.is_public = true
          AND (n.title ILIKE $1 OR n.content ILIKE $1)
        ORDER BY n.created_at DESC
      `;
      params = [`%${query}%`];
    }

    try {
      const result = await query(searchQuery, params);
      return result.rows;
    } catch (error) {
      throw new Error('Failed to search notes', { cause: error });
    }
  }

  // Get note count for a user
  static async countByUserId(userId: number): Promise<number> {
    const countQuery = `
      SELECT COUNT(*) as count
      FROM notes
      WHERE user_id = $1
    `;

    try {
      const result = await query(countQuery, [userId]);
      return Number(result.rows[0].count);
    } catch (error) {
      throw new Error('Failed to count user notes', { cause: error });
    }
  }
}
