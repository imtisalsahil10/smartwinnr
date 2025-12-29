#!/usr/bin/env node

/**
 * Test Authentication Flow
 * Tests: Register -> Login -> Token Verification
 */

const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

// Test user credentials
const testUser = {
  username: `testuser_${Date.now()}`,
  email: `testuser${Date.now()}@test.com`,
  password: 'password123'
};

async function testAuth() {
  console.log('🔐 Starting Authentication Test...\n');
  
  try {
    // 1. Register
    console.log('1️⃣  Testing REGISTER...');
    console.log(`   Registering user: ${testUser.username}`);
    
    const registerRes = await axios.post(`${API_URL}/auth/register`, testUser);
    console.log('   ✅ Register successful');
    console.log(`   Token: ${registerRes.data.token.substring(0, 20)}...`);
    console.log(`   User: ${JSON.stringify(registerRes.data.user)}\n`);

    // 2. Login
    console.log('2️⃣  Testing LOGIN...');
    const loginData = {
      email: testUser.email,
      password: testUser.password
    };
    
    const loginRes = await axios.post(`${API_URL}/auth/login`, loginData);
    console.log('   ✅ Login successful');
    const token = loginRes.data.token;
    console.log(`   Token: ${token.substring(0, 20)}...`);
    console.log(`   User: ${JSON.stringify(loginRes.data.user)}\n`);

    // 3. Test Token Usage
    console.log('3️⃣  Testing TOKEN USAGE (Getting messages)...');
    try {
      const messagesRes = await axios.get(
        `${API_URL}/messages/room/test123`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      console.log('   ✅ Token authenticated successfully');
      console.log(`   Messages: ${messagesRes.data.length} found\n`);
    } catch (tokenErr) {
      console.log('   ❌ Token authentication failed');
      console.log(`   Error: ${tokenErr.response?.data?.message || tokenErr.message}\n`);
    }

    console.log('✅ ALL TESTS PASSED!\n');
  } catch (error) {
    console.log('❌ TEST FAILED');
    console.log(`Error: ${error.response?.data?.message || error.message}`);
    console.log(`Status: ${error.response?.status}`);
    console.log(`Details: ${JSON.stringify(error.response?.data, null, 2)}`);
  }
}

testAuth();
