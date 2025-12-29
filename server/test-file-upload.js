#!/usr/bin/env node

/**
 * Test File Upload Authentication
 * Tests: Login -> File Upload with Token
 */

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:5000/api';

async function testFileUploadAuth() {
  console.log('📤 Starting File Upload Authentication Test...\n');
  
  try {
    // 1. Create test user and login
    console.log('1️⃣  Logging in...');
    const testUser = {
      email: 'testuser1766995281322@test.com',
      password: 'password123'
    };
    
    const loginRes = await axios.post(`${API_URL}/auth/login`, testUser);
    const token = loginRes.data.token;
    console.log('   ✅ Login successful');
    console.log(`   Token: ${token.substring(0, 20)}...\n`);

    // 2. Create a dummy file for testing
    console.log('2️⃣  Creating test file...');
    const testFilePath = path.join(__dirname, 'test-file.txt');
    fs.writeFileSync(testFilePath, 'This is a test file for upload testing.');
    console.log('   ✅ Test file created\n');

    // 3. Upload file with token
    console.log('3️⃣  Uploading file with token...');
    const form = new FormData();
    form.append('file', fs.createReadStream(testFilePath));
    
    try {
      const uploadRes = await axios.post(
        `${API_URL}/upload`,
        form,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            ...form.getHeaders()
          }
        }
      );
      
      console.log('   ✅ File uploaded successfully');
      console.log(`   Response: ${JSON.stringify(uploadRes.data, null, 2)}\n`);
      
      console.log('✅ ALL TESTS PASSED!\n');
    } catch (uploadErr) {
      console.log('   ❌ File upload failed');
      console.log(`   Error: ${uploadErr.response?.data?.message || uploadErr.message}`);
      console.log(`   Status: ${uploadErr.response?.status}`);
      console.log(`   Details: ${JSON.stringify(uploadErr.response?.data, null, 2)}\n`);
    }

    // Clean up
    fs.unlinkSync(testFilePath);
    
  } catch (error) {
    console.log('❌ TEST FAILED');
    console.log(`Error: ${error.message}`);
    console.log(`Status: ${error.response?.status}`);
    console.log(`Response Data: ${JSON.stringify(error.response?.data, null, 2)}`);
    console.log(`Full Error: ${JSON.stringify(error, null, 2)}`);
  }
}

testFileUploadAuth();
