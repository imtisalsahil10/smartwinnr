# SmartWinnr Client

Frontend for SmartWinnr chat application built with React.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm start
   ```

App opens at `http://localhost:3001` (or `http://localhost:3000` if 3001 is in use)

## Available Scripts

- `npm start` - Run development server
- `npm run build` - Create production build
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## Components

- **Login/Register** - Authentication pages
- **ChatApp** - Main chat interface
- **ChatWindow** - Message display and input
- **RoomList** - Available chat rooms
- **UserList** - Online users
- **MessageList** - Message display with file support
- **MessageInput** - Message input with emoji and file upload

## Features

- Real-time messaging
- File and image uploads
- Emoji picker
- Typing indicators
- Online user list
- Room management
- Responsive design

## Styling

Custom CSS in `/src/styles/`:
- App.css - Main layout
- Auth.css - Login/Register pages
- ChatWindow.css - Chat area
- MessageList.css - Message display
- MessageInput.css - Input field and emojis
- Components.css - Room/User lists

## File Structure

```
client/
├── public/
│   ├── index.html
│   └── favicon.svg
├── src/
│   ├── components/     # React components
│   ├── pages/          # Page components
│   ├── styles/         # CSS files
│   ├── App.js
│   └── index.js
└── package.json
```
