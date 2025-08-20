// Basic types for the application
export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  authorId: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  noteId: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Reaction {
  id: string;
  emoji: string;
  noteId: string;
  userId: string;
  createdAt: Date;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Request types
export interface CreateNoteRequest {
  title: string;
  content: string;
  isPublic: boolean;
}

export interface UpdateNoteRequest {
  title?: string;
  content?: string;
  isPublic?: boolean;
}

export interface CreateCommentRequest {
  content: string;
  noteId: string;
}

export interface AddReactionRequest {
  emoji: string;
  noteId: string;
}