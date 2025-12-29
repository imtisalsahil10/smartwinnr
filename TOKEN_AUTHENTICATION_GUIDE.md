# Token Authentication System - Verification Guide

## Token Flow Overview

```
User Registers/Logs In
        ↓
Server generates JWT token
        ↓
Client receives token + user data
        ↓
Client stores token in localStorage
        ↓
Client adds token to Authorization header for all API requests
        ↓
Server verifies token for protected routes
```

## How Token Authentication Works in This App

### 1. Server-Side (Backend)

**JWT Generation** (`server/routes/auth.js`):
```javascript
const token = jwt.sign(
  { id: user._id, username: user.username },
  process.env.JWT_SECRET,    // Secret key from .env
  { expiresIn: '7d' }         // Token valid for 7 days
);
```

**Environment Configuration** (`server/.env`):
```
JWT_SECRET=your_jwt_secret_key_change_this_in_production
```

**Token Verification** (`server/middleware/auth.js`):
- Extracts token from `Authorization: Bearer <token>` header
- Verifies token signature using JWT_SECRET
- Returns 403 if token is invalid or expired
- Adds user info to `req.user` if valid

**Protected Routes**:
- `/api/messages` - Requires token
- `/api/rooms` - Requires token
- `/api/users` - Requires token
- `/api/upload` - Requires token

### 2. Client-Side (Frontend)

**Login Process** (`client/src/pages/Login.js`):
```javascript
const response = await axios.post('http://localhost:5000/api/auth/login', formData);
onLogin(response.data.user, response.data.token);  // Pass token to parent
```

**Storage** (`client/src/App.js` - handleLogin function):
```javascript
const handleLogin = (userData, token) => {
  setUser(userData);
  localStorage.setItem('user', JSON.stringify(userData));      // Store user info
  localStorage.setItem('token', token);                        // Store token
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;  // Set header
};
```

**Token Persistence on Page Reload** (`client/src/App.js` - useEffect):
```javascript
useEffect(() => {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  
  if (token && userData) {
    setUser(JSON.parse(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
}, []);
```

## How to Verify Token is Working

### Method 1: Browser DevTools (Recommended)

1. **Open the application**: http://localhost:3001
2. **Open DevTools**: Press `F12` or `Ctrl+Shift+I`
3. **Go to Console tab**
4. **Execute this command**:
   ```javascript
   JSON.parse(localStorage.getItem('user'))
   ```
   Should show: `{id: "...", username: "...", email: "..."}`

5. **Check the token exists**:
   ```javascript
   localStorage.getItem('token')
   ```
   Should show: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (very long string)

6. **Check axios header is set**:
   ```javascript
   console.log(axios.defaults.headers.common['Authorization'])
   ```
   Should show: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Method 2: Network Tab

1. **Open DevTools** (F12)
2. **Go to Network tab**
3. **Perform any action** (send message, create room, upload file)
4. **Click on any API request** in the list
5. **Look at Request Headers** section
6. Should see: `Authorization: Bearer <token>`

### Method 3: Login Test

1. **Open http://localhost:3001**
2. **Register a new account** or login with existing credentials
3. **Expected behavior**:
   - Login succeeds, token is stored
   - Redirected to chat app
   - Can see chat rooms and users
   - Can send messages (which requires token to save to DB)
   - Can upload files (which requires token)

## Troubleshooting Token Issues

### Issue: Login fails with "Invalid credentials"
**Possible Causes**:
- Wrong email/password combination
- User doesn't exist in database
- Database connection issue

**Fix**:
1. Check server console for MongoDB connection
2. Verify user exists in MongoDB Atlas dashboard
3. Try registering a new account

### Issue: Token not persisting after page reload
**Possible Cause**:
- localStorage is being cleared
- Browser privacy mode might not persist storage

**Fix**:
1. Check if localStorage is enabled in browser
2. Check DevTools Console for errors
3. Verify localStorage not being cleared: `localStorage.getItem('token')`

### Issue: API calls fail with 401/403 error
**Possible Causes**:
- Token is not being sent in headers
- Token has expired (valid for 7 days)
- Token is invalid/corrupted

**Fix**:
1. Verify token in DevTools Console (see Method 1)
2. Check Authorization header in Network tab (see Method 2)
3. Check server console for JWT verification errors
4. Try logging out and logging back in

### Issue: File upload fails with "Failed to upload file"
**Possible Causes**:
- Token not passed to upload endpoint
- Multer configuration issue
- File size exceeds 10MB limit
- `/api/upload` route not properly configured

**Fix**:
1. Check token is in Authorization header
2. Verify file size < 10MB
3. Check `/server/uploads` directory exists
4. Verify `/api/upload` route in `server/server.js`

## Testing with curl (Command Line)

### 1. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Response will include `token` value.

### 3. Use Token for Protected Route
```bash
curl -X GET http://localhost:5000/api/rooms \
  -H "Authorization: Bearer <paste_token_here>"
```

Should return list of rooms. If token is invalid, you'll get 403 error.

## Token Structure (JWT)

JWTs have 3 parts separated by dots:

```
header.payload.signature
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJ1c2VybmFtZSI6InRlc3R1c2VyIn0.signature
```

**You can decode the payload** at https://jwt.io (paste entire token)
- Do NOT expose tokens publicly
- The signature is verified server-side

## Token Expiration

- **Valid for**: 7 days
- **After expiration**: User needs to login again
- **No auto-refresh**: Currently requires manual re-login
- **If needed to extend**: Modify `expiresIn` in `server/routes/auth.js`

## Security Best Practices (Currently Implemented)

✅ Token stored in secure localStorage
✅ Token sent only in Authorization header
✅ CORS configured to allow only localhost ports 3000 and 3001
✅ JWT signature verified using secret key
✅ Passwords hashed with bcryptjs before storage
✅ Token includes user ID and username only (no sensitive data)

## What's NOT Implemented (for future enhancement)

- ❌ Token refresh mechanism
- ❌ Logout token blacklisting
- ❌ Role-based access control (Admin, User, etc.)
- ❌ Rate limiting on login attempts
- ❌ Two-factor authentication

## Testing Token-Protected Endpoints

All these endpoints require valid token in Authorization header:

| Endpoint | Method | Requires Token |
|----------|--------|---------------|
| `/api/auth/register` | POST | ❌ No |
| `/api/auth/login` | POST | ❌ No |
| `/api/messages` | GET/POST | ✅ Yes |
| `/api/rooms` | GET/POST/PUT | ✅ Yes |
| `/api/users` | GET | ✅ Yes |
| `/api/upload` | POST | ✅ Yes |

## Quick Verification Checklist

- [ ] Can register new account
- [ ] Can login with credentials
- [ ] Token appears in localStorage after login
- [ ] Token appears in Authorization header in Network tab
- [ ] Can view chat rooms (proves token is valid)
- [ ] Can send messages (proves token is valid for API)
- [ ] Can upload files (proves token is valid for file upload)
- [ ] Token persists after page reload
- [ ] Token cleared after logout
- [ ] Can login again after logout

If all items above are checked, **token authentication is working correctly!**
