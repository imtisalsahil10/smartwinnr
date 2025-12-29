#!/usr/bin/env node

/**
 * Quick Authentication System Diagnostic
 * Checks all components of the token authentication system
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔐 Authentication System Diagnostic\n');
console.log('='.repeat(50));

const checks = [];

// 1. Check .env file
console.log('\n1️⃣  Checking Server Configuration...');
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (envContent.includes('JWT_SECRET')) {
    console.log('   ✅ JWT_SECRET configured');
    checks.push(true);
  } else {
    console.log('   ❌ JWT_SECRET missing in .env');
    checks.push(false);
  }
} else {
  console.log('   ❌ .env file not found');
  checks.push(false);
}

// 2. Check auth routes
console.log('\n2️⃣  Checking Auth Routes...');
const authPath = path.join(__dirname, 'routes/auth.js');
if (fs.existsSync(authPath)) {
  const authContent = fs.readFileSync(authPath, 'utf8');
  const hasRegister = authContent.includes('router.post(\'/register\'');
  const hasLogin = authContent.includes('router.post(\'/login\'');
  const hasJWT = authContent.includes('jwt.sign');
  
  if (hasRegister && hasLogin && hasJWT) {
    console.log('   ✅ Register route present');
    console.log('   ✅ Login route present');
    console.log('   ✅ JWT token generation present');
    checks.push(true);
  } else {
    console.log('   ❌ Missing auth endpoints');
    checks.push(false);
  }
} else {
  console.log('   ❌ Auth routes file not found');
  checks.push(false);
}

// 3. Check auth middleware
console.log('\n3️⃣  Checking Auth Middleware...');
const middlewarePath = path.join(__dirname, 'middleware/auth.js');
if (fs.existsSync(middlewarePath)) {
  const middlewareContent = fs.readFileSync(middlewarePath, 'utf8');
  const hasVerify = middlewareContent.includes('jwt.verify');
  const hasAuthHeader = middlewareContent.includes('authorization');
  
  if (hasVerify && hasAuthHeader) {
    console.log('   ✅ Token verification present');
    console.log('   ✅ Authorization header check present');
    checks.push(true);
  } else {
    console.log('   ❌ Token verification incomplete');
    checks.push(false);
  }
} else {
  console.log('   ❌ Auth middleware file not found');
  checks.push(false);
}

// 4. Check User model
console.log('\n4️⃣  Checking User Model...');
const userModelPath = path.join(__dirname, 'models/User.js');
if (fs.existsSync(userModelPath)) {
  const userContent = fs.readFileSync(userModelPath, 'utf8');
  const hasPassword = userContent.includes('password');
  const hasBcrypt = userContent.includes('bcrypt');
  
  if (hasPassword && hasBcrypt) {
    console.log('   ✅ Password field present');
    console.log('   ✅ Bcrypt integration present');
    checks.push(true);
  } else {
    console.log('   ❌ User model incomplete');
    checks.push(false);
  }
} else {
  console.log('   ❌ User model file not found');
  checks.push(false);
}

// 5. Check protected routes
console.log('\n5️⃣  Checking Protected Routes...');
const serverPath = path.join(__dirname, 'server.js');
if (fs.existsSync(serverPath)) {
  const serverContent = fs.readFileSync(serverPath, 'utf8');
  const hasMessageRoute = serverContent.includes('authenticateToken');
  const hasUploadRoute = serverContent.includes('/api/upload');
  
  if (hasMessageRoute) {
    console.log('   ✅ Protected routes configured');
    checks.push(true);
  } else {
    console.log('   ❌ Protected routes not configured');
    checks.push(false);
  }
  
  if (hasUploadRoute) {
    console.log('   ✅ File upload route present');
  } else {
    console.log('   ❌ File upload route missing');
  }
} else {
  console.log('   ❌ Server file not found');
  checks.push(false);
}

// 6. Check client-side
console.log('\n6️⃣  Checking Client Configuration...');
const clientAppPath = path.join(__dirname, '../client/src/App.js');
if (fs.existsSync(clientAppPath)) {
  const appContent = fs.readFileSync(clientAppPath, 'utf8');
  const hasLogin = appContent.includes('handleLogin');
  const hasLocalStorage = appContent.includes('localStorage');
  const hasAxiosHeader = appContent.includes('axios.defaults.headers');
  
  if (hasLogin && hasLocalStorage && hasAxiosHeader) {
    console.log('   ✅ Login handler present');
    console.log('   ✅ LocalStorage integration present');
    console.log('   ✅ Axios header configuration present');
    checks.push(true);
  } else {
    console.log('   ❌ Client authentication incomplete');
    checks.push(false);
  }
} else {
  console.log('   ❌ Client App file not found');
  checks.push(false);
}

// Summary
console.log('\n' + '='.repeat(50));
const passedChecks = checks.filter(c => c).length;
const totalChecks = checks.length;

console.log(`\n📊 Results: ${passedChecks}/${totalChecks} checks passed\n`);

if (passedChecks === totalChecks) {
  console.log('✅ Authentication system is properly configured!\n');
  console.log('Next steps:');
  console.log('1. Start server: npm run dev');
  console.log('2. Start client: npm start');
  console.log('3. Test login with a user account');
  console.log('4. Check DevTools Console for token verification');
} else {
  console.log('⚠️  Some checks failed. Review the errors above.\n');
  console.log('Common issues:');
  console.log('- Missing JWT_SECRET in .env file');
  console.log('- Auth routes not properly configured');
  console.log('- Client-side token handling incomplete');
}

console.log('\nFor detailed guide, see: TOKEN_AUTHENTICATION_GUIDE.md\n');
