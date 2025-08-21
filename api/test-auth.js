const axios = require('axios');

const API_BASE = 'http://localhost:4000/api';

async function testAuth() {
  try {
    console.log('🧪 Testing Authentication Flow...\n');

    // 1. Register a new user
    console.log('1. Registering new user...');
    const registerResponse = await axios.post(`${API_BASE}/users/register`, {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('✅ User registered successfully');
    console.log('User data:', registerResponse.data.user);
    console.log('');

    // 2. Login with the user
    console.log('2. Logging in...');
    const loginResponse = await axios.post(`${API_BASE}/users/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('✅ Login successful');
    console.log('Token received:', loginResponse.data.token ? 'Yes' : 'No');
    console.log('');

    const token = loginResponse.data.token;

    // 3. Create a note with authentication
    console.log('3. Creating a note with authentication...');
    const createNoteResponse = await axios.post(`${API_BASE}/notes`, {
      title: 'My First Note',
      content: 'This is a test note created with authentication',
      is_public: false
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Note created successfully');
    console.log('Note data:', createNoteResponse.data.note);
    console.log('');

    // 4. Get user's notes
    console.log('4. Getting user notes...');
    const getNotesResponse = await axios.get(`${API_BASE}/notes/my`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Notes retrieved successfully');
    console.log('Number of notes:', getNotesResponse.data.notes.length);
    console.log('');

    // 5. Test without authentication (should fail)
    console.log('5. Testing without authentication (should fail)...');
    try {
      await axios.post(`${API_BASE}/notes`, {
        title: 'Unauthorized Note',
        content: 'This should fail'
      });
      console.log('❌ This should have failed!');
    } catch (error) {
      console.log('✅ Correctly rejected unauthorized request');
      console.log('Error message:', error.response.data.message);
    }

    console.log('\n🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testAuth();
