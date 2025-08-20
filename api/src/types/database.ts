// Database entity types
export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

export interface Note {
  id: number;
  user_id: number;
  title: string;
  content: string | null;
  is_public: boolean;
  created_at: Date;
  updated_at: Date;
}

// Request/Response types
export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
}

export interface CreateNoteRequest {
  title: string;
  content?: string;
  is_public?: boolean;
}

export interface UpdateNoteRequest {
  title?: string;
  content?: string;
  is_public?: boolean;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}

export interface NoteResponse {
  id: number;
  user_id: number;
  title: string;
  content: string | null;
  is_public: boolean;
  created_at: Date;
  updated_at: Date;
}

// Database query result types
export interface QueryResult<T> {
  rows: T[];
  rowCount: number;
}

// Error types
export interface DatabaseError {
  code: string;
  message: string;
  detail?: string;
}

// Connection types
export interface DatabaseConfig {
  user: string;
  host: string;
  database: string;
  password: string;
  port: number;
  max: number;
  idleTimeoutMillis: number;
  connectionTimeoutMillis: number;
  ssl: boolean | { rejectUnauthorized: boolean };
}
