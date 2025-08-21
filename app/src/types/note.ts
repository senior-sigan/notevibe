export interface Note {
  id: number;
  user_id: number;
  title: string;
  content: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  author_name: string;
}

export interface NotesResponse {
  notes: Note[];
}

export interface NoteResponse {
  note: Note;
}
