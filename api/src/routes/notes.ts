import { Router } from 'express';
import { NoteRepository } from '../repositories/noteRepository.ts';
import type { CreateNoteRequest, UpdateNoteRequest } from '../types/database.ts';
import pino from 'pino'

const logger = pino();
const router = Router();

// Create a new note
router.post('/', async (req, res) => {
  try {
    const { title, content, is_public }: CreateNoteRequest = req.body;
    
    // For now, we'll use a default user ID (1)
    // In a real app, this would come from authentication middleware
    const userId = 1;

    // Validate input
    if (!title) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Title is required'
      });
    }

    const note = await NoteRepository.create(userId, {
      title,
      content,
      is_public
    });

    res.status(201).json({
      message: 'Note created successfully',
      note
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create note'
    });
  }
});

// Get all notes for current user
router.get('/my', async (req, res) => {
  try {
    // For now, we'll use a default user ID (1)
    // In a real app, this would come from authentication middleware
    const userId = 1;

    const notes = await NoteRepository.findByUserId(userId);
    res.json({ notes });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch notes'
    });
  }
});

// Get all public notes
router.get('/public', async (req, res) => {
  try {
    const notes = await NoteRepository.findPublicNotes();
    res.json({ notes });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch public notes'
    });
  }
});

// Get note by ID
router.get('/:id', async (req, res) => {
  try {
    const noteId = parseInt(req.params.id);
    
    if (isNaN(noteId)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid note ID'
      });
    }

    // For now, we'll use a default user ID (1)
    // In a real app, this would come from authentication middleware
    const userId = 1;

    const note = await NoteRepository.findById(noteId, userId);
    
    if (!note) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Note not found'
      });
    }

    res.json({ note });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch note'
    });
  }
});

// Update note
router.put('/:id', async (req, res) => {
  try {
    const noteId = parseInt(req.params.id);
    
    if (isNaN(noteId)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid note ID'
      });
    }

    const updates: UpdateNoteRequest = req.body;
    
    // Remove immutable fields from updates
    delete (updates as any).id;
    delete (updates as any).user_id;
    delete (updates as any).created_at;
    delete (updates as any).updated_at;

    // For now, we'll use a default user ID (1)
    // In a real app, this would come from authentication middleware
    const userId = 1;

    const note = await NoteRepository.update(noteId, userId, updates);
    
    if (!note) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Note not found or you do not have permission to update it'
      });
    }

    res.json({
      message: 'Note updated successfully',
      note
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update note'
    });
  }
});

// Delete note
router.delete('/:id', async (req, res) => {
  try {
    const noteId = parseInt(req.params.id);
    
    if (isNaN(noteId)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid note ID'
      });
    }

    // For now, we'll use a default user ID (1)
    // In a real app, this would come from authentication middleware
    const userId = 1;

    const deleted = await NoteRepository.delete(noteId, userId);
    
    if (!deleted) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Note not found or you do not have permission to delete it'
      });
    }

    res.json({
      message: 'Note deleted successfully'
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete note'
    });
  }
});

// Search notes
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    
    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Search query is required'
      });
    }

    // For now, we'll use a default user ID (1)
    // In a real app, this would come from authentication middleware
    const userId = 1;

    const notes = await NoteRepository.search(query, userId);
    res.json({ notes });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to search notes'
    });
  }
});

export default router;
