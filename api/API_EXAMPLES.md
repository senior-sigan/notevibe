# API Usage Examples

## Users API

### Register a new user

```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

Response:

```json
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### Get user by ID

```bash
curl http://localhost:3000/api/users/1
```

Response:

```json
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### Get all users

```bash
curl http://localhost:3000/api/users
```

Response:

```json
{
  "users": [
    {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### Update user

```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_updated",
    "email": "john.updated@example.com"
  }'
```

Response:

```json
{
  "message": "User updated successfully",
  "user": {
    "id": 1,
    "username": "john_updated",
    "email": "john.updated@example.com",
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T11:00:00.000Z"
  }
}
```

### Delete user

```bash
curl -X DELETE http://localhost:3000/api/users/1
```

Response:

```json
{
  "message": "User deleted successfully"
}
```

## Notes API

### Create a new note

```bash
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Note",
    "content": "This is the content of my first note.",
    "is_public": false
  }'
```

Response:

```json
{
  "message": "Note created successfully",
  "note": {
    "id": 1,
    "user_id": 1,
    "title": "My First Note",
    "content": "This is the content of my first note.",
    "is_public": false,
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### Create a public note

```bash
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Public Note",
    "content": "This note is public and can be viewed by anyone.",
    "is_public": true
  }'
```

### Get user's notes

```bash
curl http://localhost:3000/api/notes/my
```

Response:

```json
{
  "notes": [
    {
      "id": 2,
      "user_id": 1,
      "title": "Public Note",
      "content": "This note is public and can be viewed by anyone.",
      "is_public": true,
      "created_at": "2024-01-15T10:35:00.000Z",
      "updated_at": "2024-01-15T10:35:00.000Z"
    },
    {
      "id": 1,
      "user_id": 1,
      "title": "My First Note",
      "content": "This is the content of my first note.",
      "is_public": false,
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### Get public notes

```bash
curl http://localhost:3000/api/notes/public
```

Response:

```json
{
  "notes": [
    {
      "id": 2,
      "user_id": 1,
      "title": "Public Note",
      "content": "This note is public and can be viewed by anyone.",
      "is_public": true,
      "created_at": "2024-01-15T10:35:00.000Z",
      "updated_at": "2024-01-15T10:35:00.000Z"
    }
  ]
}
```

### Get note by ID

```bash
curl http://localhost:3000/api/notes/1
```

Response:

```json
{
  "note": {
    "id": 1,
    "user_id": 1,
    "title": "My First Note",
    "content": "This is the content of my first note.",
    "is_public": false,
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### Update note

```bash
curl -X PUT http://localhost:3000/api/notes/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Note Title",
    "content": "This is the updated content of my note.",
    "is_public": true
  }'
```

Response:

```json
{
  "message": "Note updated successfully",
  "note": {
    "id": 1,
    "user_id": 1,
    "title": "Updated Note Title",
    "content": "This is the updated content of my note.",
    "is_public": true,
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T11:00:00.000Z"
  }
}
```

### Delete note

```bash
curl -X DELETE http://localhost:3000/api/notes/1
```

Response:

```json
{
  "message": "Note deleted successfully"
}
```

### Search notes

```bash
curl http://localhost:3000/api/notes/search/note
```

Response:

```json
{
  "notes": [
    {
      "id": 2,
      "user_id": 1,
      "title": "Public Note",
      "content": "This note is public and can be viewed by anyone.",
      "is_public": true,
      "created_at": "2024-01-15T10:35:00.000Z",
      "updated_at": "2024-01-15T10:35:00.000Z"
    }
  ]
}
```

## Error Responses

### Validation Error

```json
{
  "error": "Validation Error",
  "message": "Username, email, and password are required"
}
```

### Not Found

```json
{
  "error": "Not Found",
  "message": "User not found"
}
```

### Conflict (Duplicate Entry)

```json
{
  "error": "Conflict",
  "message": "Username already exists"
}
```

### Internal Server Error

```json
{
  "error": "Internal Server Error",
  "message": "Failed to create user"
}
```

## Using with JavaScript/TypeScript

### Fetch API Example

```javascript
// Create a new user
const createUser = async (userData) => {
  const response = await fetch('http://localhost:3000/api/users/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  
  return response.json();
};

// Create a new note
const createNote = async (noteData) => {
  const response = await fetch('http://localhost:3000/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(noteData),
  });
  
  return response.json();
};

// Usage
createUser({
  username: 'john_doe',
  email: 'john@example.com',
  password: 'password123'
}).then(result => console.log(result));

createNote({
  title: 'My Note',
  content: 'Note content',
  is_public: false
}).then(result => console.log(result));
```

### Axios Example

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Users
const users = {
  register: (userData) => api.post('/users/register', userData),
  getById: (id) => api.get(`/users/${id}`),
  getAll: () => api.get('/users'),
  update: (id, updates) => api.put(`/users/${id}`, updates),
  delete: (id) => api.delete(`/users/${id}`),
};

// Notes
const notes = {
  create: (noteData) => api.post('/notes', noteData),
  getMy: () => api.get('/notes/my'),
  getPublic: () => api.get('/notes/public'),
  getById: (id) => api.get(`/notes/${id}`),
  update: (id, updates) => api.put(`/notes/${id}`, updates),
  delete: (id) => api.delete(`/notes/${id}`),
  search: (query) => api.get(`/notes/search/${query}`),
};

// Usage
users.register({
  username: 'john_doe',
  email: 'john@example.com',
  password: 'password123'
}).then(response => console.log(response.data));

notes.create({
  title: 'My Note',
  content: 'Note content',
  is_public: false
}).then(response => console.log(response.data));
```
