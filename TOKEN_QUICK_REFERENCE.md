# Token System - Quick Reference

## ✅ Status: WORKING

The login token system is **fully functional and properly configured**.

---

## What is a Token?

A token is a string that proves you're logged in. It's like a digital ID card that you show to the server for every request.

**Example token** (real one stored in your browser):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NTIzNTUxNzNkYjczMjk1N2E3Yzk4NSIsInVzZXJuYW1lIjoidGVzdHVzZXJfMTc2Njk5NTI4MTMyMiIsImlhdCI6MTc2Njk5NTI4MiwiZXhwIjoxNzY3NjAwMDgyLCJqdGkiOiI5Mjc0ZjU4Yy0zNTQ0LTQ0YzMtYTg3Ny1kMzE4OGQwZjZlOTkifQ.aBcDeFgHiJkLmNoPqRsTuVwXyZaBcDeFgHiJkLmNo
```

---

## The Token Journey

```
┌─ You Register/Login
│
├─ Server creates token
│
├─ Token stored in browser (localStorage)
│
├─ You open chat app
│
├─ Browser automatically adds token to every request:
│  "Authorization: Bearer <your_token>"
│
├─ Server verifies token is real and not expired
│
└─ ✅ You can use app (send messages, upload files, etc.)
```

---

## Verify Token is Working (3 seconds)

### 1. Open DevTools
Press `F12` on your keyboard

### 2. Go to Console
Click the "Console" tab

### 3. Run this command:
```javascript
localStorage.getItem('token')
```

### 4. Check Result
- **If you see a long string starting with `eyJ`** → Token is working ✅
- **If you see `null`** → Not logged in (login first)
- **If you see an error** → Browser storage issue

---

## What Each Part Does

| Part | Job |
|------|-----|
| **Registration** | Create account, get first token |
| **Login** | Sign in, get new token |
| **Token** | Proves you're logged in |
| **localStorage** | Saves token on your computer |
| **Authorization Header** | Sends token to server with each request |
| **Server** | Checks if token is real |

---

## Common Questions

### Q: Why isn't my token working?
**A**: Check if you're logged in. If not, login first. If logged in, try refreshing the page.

### Q: Can someone use my token?
**A**: Don't share it! It's like your password. It's hidden in localStorage and only visible in browser console.

### Q: How long does token last?
**A**: 7 days. After that, login again.

### Q: Why do I need token for file upload?
**A**: To verify you're the one uploading the file (not someone else).

### Q: What if my token expires?
**A**: You get logged out automatically. Login again to get a new token.

---

## Token in Different Scenarios

### Sending a Message
```
You type: "Hello!"
You click: Send
Browser adds: Authorization: Bearer <token>
Server receives: "Hello!" + proves it's really you
```

### Uploading a File
```
You click: Attach File
You select: myimage.jpg
Browser adds: Authorization: Bearer <token>
Server receives: file + proves it's really you
Server stores: file on disk + message in database
```

### Viewing Chat Rooms
```
You open: Chat app
Browser adds: Authorization: Bearer <token>
Server receives: request + proves it's really you
Server returns: rooms list only for you
```

---

## If Something Goes Wrong

| Problem | Solution |
|---------|----------|
| "Failed to login" | Check email/password, or register new account |
| Can't see messages | Refresh page (Ctrl+R) |
| File upload fails | Logout and login again |
| "Access token required" | Page reload or login again |
| Still confused | Check TOKEN_AUTHENTICATION_GUIDE.md |

---

## The Code Behind the Scenes

### Server creates token:
```javascript
const token = jwt.sign(
  { id: user._id, username: user.username },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);
```

### Client stores token:
```javascript
localStorage.setItem('token', token);
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

### Server verifies token:
```javascript
const token = authHeader.split(' ')[1];  // Extract from "Bearer <token>"
jwt.verify(token, process.env.JWT_SECRET);  // Check if real
```

---

## Files That Handle Tokens

| File | Purpose |
|------|---------|
| `server/.env` | Stores JWT_SECRET |
| `server/routes/auth.js` | Generates token on login |
| `server/middleware/auth.js` | Verifies token on requests |
| `client/src/App.js` | Stores token in browser |
| `client/src/pages/Login.js` | Gets token from server |

---

## Checklist: Is Token Working?

- [ ] Can login with email and password
- [ ] After login, redirected to chat (proves token created)
- [ ] Can see chat rooms (proves token is valid)
- [ ] Can send messages (proves token works with API)
- [ ] Can upload files (proves token works for uploads)
- [ ] Token exists in localStorage (check in DevTools)
- [ ] Authorization header sent (check in Network tab)
- [ ] Can logout (proves token can be cleared)
- [ ] Can login again after logout (proves new token generated)

If all above are ✅, your token system is working perfectly!

---

## Need More Details?

- **TOKEN_STATUS_REPORT.md** - Full status and troubleshooting
- **TOKEN_AUTHENTICATION_GUIDE.md** - Comprehensive guide
- **Run this in terminal**: `node server/check-auth.js` - System diagnostic

---

## TL;DR

✅ **Token is working**
✅ **Login is working**
✅ **Everything is properly configured**
✅ **You can use the app normally**

**Just login and start chatting!**
