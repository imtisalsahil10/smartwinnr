# Testing Checklist - File Upload & Real-Time Chat

## Pre-Testing Setup
- [ ] Server running: `npm run dev` (port 5000)
- [ ] Client running: `npm start` (port 3000)
- [ ] Two browser windows open (or two different browsers)
- [ ] Users logged in with different accounts

## File Upload Testing

### Test 1: Basic File Upload
- [ ] User 1 logs in
- [ ] Open chat room
- [ ] Click attachment icon (📎)
- [ ] Select a file
- [ ] **Expected:** Success message appears
- [ ] **Expected:** File message shows in chat
- [ ] **Expected:** Message includes file name and download link

### Test 2: Image Upload & Display
- [ ] Repeat Test 1 with an image file (JPG, PNG)
- [ ] **Expected:** Image displays as thumbnail in chat
- [ ] **Expected:** Can click image to open in new tab

### Test 3: File Upload Cross-Browser Sync
- [ ] User 1 uploads file in first browser window
- [ ] **Expected:** File message appears in User 1's window immediately
- [ ] **Expected:** File message appears in User 2's window immediately (in second browser)
- [ ] Both users can download the file

### Test 4: Large File Upload
- [ ] Try uploading file approaching 10MB limit
- [ ] **Expected:** Upload succeeds
- [ ] Try uploading file > 10MB
- [ ] **Expected:** Server rejects with error message

### Test 5: Various File Types
- [ ] [ ] PDF file
- [ ] [ ] Word document (.docx)
- [ ] [ ] Text file (.txt)
- [ ] [ ] Image file (.jpg, .png, .gif)
- [ ] [ ] Video file (.mp4)
- [ ] **Expected:** All should upload and download correctly

## Real-Time Chat Testing

### Test 6: Message Synchronization
- [ ] User 1 sends text message
- [ ] **Expected:** Message appears in User 1's window immediately
- [ ] **Expected:** Message appears in User 2's window immediately
- [ ] User 2 sends reply
- [ ] **Expected:** Reply appears in both windows

### Test 7: Multiple Messages Sequence
- [ ] User 1 sends 3 messages quickly
- [ ] User 2 sends 2 messages
- [ ] **Expected:** All messages appear in order in both windows
- [ ] **Expected:** No messages are duplicated
- [ ] **Expected:** Sender information is correct

### Test 8: Emoji in Messages
- [ ] User 1 types message with emoji picker
- [ ] Select an emoji from picker
- [ ] Send message
- [ ] **Expected:** Emoji appears in message
- [ ] **Expected:** Message syncs to User 2's window with emoji intact

### Test 9: File + Message Combination
- [ ] User 1 uploads file
- [ ] User 1 sends text message
- [ ] **Expected:** Both appear in sequence
- [ ] **Expected:** Both sync to User 2's window

### Test 10: Typing Indicator
- [ ] User 1 starts typing (don't send yet)
- [ ] **Expected:** "User 1 is typing..." appears in User 2's window
- [ ] User 1 stops typing (wait 1 second)
- [ ] **Expected:** "typing..." message disappears from User 2's window

## Database Persistence Testing

### Test 11: Message History
- [ ] User 1 sends several messages
- [ ] User 2 joins room later
- [ ] **Expected:** User 2 sees all previous messages
- [ ] User 1 uploads file
- [ ] Refresh browser for User 1
- [ ] **Expected:** File message still appears in history
- [ ] **Expected:** Download link still works

### Test 12: Multiple Rooms
- [ ] Create Room A and Room B
- [ ] User 1 sends message in Room A
- [ ] User 1 switches to Room B, sends message
- [ ] User 2 joins Room A
- [ ] **Expected:** User 2 only sees Room A messages, not Room B

## Error Handling Testing

### Test 13: Network Error Recovery
- [ ] User 1 sends message
- [ ] Disconnect server or internet
- [ ] **Expected:** Error message appears
- [ ] Reconnect
- [ ] Send another message
- [ ] **Expected:** Works normally again

### Test 14: Invalid File
- [ ] Try to upload file with no extension
- [ ] **Expected:** Either uploads or shows error
- [ ] Check file is accessible

### Test 15: Permission Testing
- [ ] Log out User 2
- [ ] User 1 tries to upload file
- [ ] **Expected:** File upload succeeds for authenticated user
- [ ] (Anonymous user should not be able to upload)

## Performance Testing

### Test 16: Rapid Messages
- [ ] Send 10 messages rapidly from User 1
- [ ] **Expected:** All messages appear correctly in User 2's window
- [ ] **Expected:** No lag or sync delays

### Test 17: Large File with Active Chat
- [ ] Start uploading large file
- [ ] While uploading, User 2 sends messages
- [ ] **Expected:** Messages sync in real-time
- [ ] File continues uploading
- [ ] **Expected:** Upload completes successfully

## Browser Console Testing
- [ ] Open DevTools (F12)
- [ ] Check Console tab for errors
- [ ] **Expected:** No red error messages
- [ ] Check Network tab
- [ ] **Expected:** All API calls return 200 status
- [ ] Check for Socket.io connection messages

## Final Verification Checklist
- [ ] All 17 tests passed
- [ ] No console errors
- [ ] No network errors
- [ ] Files are in `/server/uploads/` directory
- [ ] Database has all messages
- [ ] Real-time sync working flawlessly
- [ ] Ready for submission

## If Tests Fail

1. **File upload fails:**
   - Check `/server/uploads/` directory exists
   - Check server console for multer errors
   - Verify file size < 10MB
   - Check Authorization header in Network tab

2. **Real-time sync fails:**
   - Check Socket.io connection in browser console
   - Verify both users are in same room
   - Check server console for socket errors
   - Refresh both browser windows

3. **Download fails:**
   - Check file exists in `/server/uploads/`
   - Verify static route is configured in server.js
   - Check URL in file message matches actual file

4. **General debugging:**
   - Restart server and client
   - Clear browser cache (Ctrl+Shift+Delete)
   - Open DevTools before testing
   - Test one feature at a time
