import sys
import json
from datetime import datetime

print("=================================================")
print("     SmartWinnr Chat Application - Setup Guide    ")
print("=================================================\n")

setup_steps = [
    {
        "step": 1,
        "title": "Prerequisites Installation",
        "instructions": [
            "Download and install Node.js v16.0.0 or higher from https://nodejs.org/",
            "Download and install MongoDB from https://www.mongodb.com/try/download/community",
            "Verify installations: node --version && npm --version && mongod --version"
        ]
    },
    {
        "step": 2,
        "title": "Backend Setup",
        "instructions": [
            "Open PowerShell and navigate to: d:\\applications assignments\\smartwinnr\\server",
            "Run: npm install",
            "Update .env file with your MongoDB connection string",
            "Run: npm run dev (for development) or npm start (for production)"
        ]
    },
    {
        "step": 3,
        "title": "Frontend Setup",
        "instructions": [
            "Open another PowerShell and navigate to: d:\\applications assignments\\smartwinnr\\client",
            "Run: npm install",
            "Run: npm start",
            "Browser will open at http://localhost:3000"
        ]
    },
    {
        "step": 4,
        "title": "MongoDB Setup",
        "instructions": [
            "Make sure MongoDB is running on port 27017",
            "Windows: Open Services and start 'MongoDB Server'",
            "Or run 'mongod' from command line to start MongoDB server"
        ]
    },
    {
        "step": 5,
        "title": "First Use",
        "instructions": [
            "Go to Register page and create a new account",
            "Login with your credentials",
            "Create a new chat room or join existing ones",
            "Start chatting in real-time!"
        ]
    }
]

for step in setup_steps:
    print(f"\n{'='*50}")
    print(f"STEP {step['step']}: {step['title']}")
    print(f"{'='*50}")
    for i, instruction in enumerate(step['instructions'], 1):
        print(f"  {i}. {instruction}")

print(f"\n{'='*50}")
print("TECH STACK VERSIONS")
print(f"{'='*50}")

versions = {
    "Node.js": "16.0.0+",
    "npm": "7.0.0+",
    "MongoDB": "5.0+",
    "React": "18.2.0",
    "Express.js": "4.18.2",
    "Socket.io": "4.6.1",
    "Mongoose": "7.0.0",
    "JWT": "9.0.0"
}

for tech, version in versions.items():
    print(f"  • {tech}: {version}")

print(f"\n{'='*50}")
print("KEY FEATURES")
print(f"{'='*50}")

features = [
    "Real-time chat with WebSockets",
    "User authentication with JWT",
    "Multiple chat rooms",
    "Private conversations",
    "Online user status",
    "Typing indicators",
    "Message persistence in MongoDB",
    "Responsive design",
    "Media upload ready"
]

for feature in features:
    print(f"  ✓ {feature}")

print(f"\n{'='*50}")
print("USEFUL COMMANDS")
print(f"{'='*50}")

commands = {
    "Backend (Development)": "cd server && npm run dev",
    "Backend (Production)": "cd server && npm start",
    "Frontend": "cd client && npm start",
    "Install Dependencies": "npm install",
    "Build Frontend": "cd client && npm run build",
    "Check Node version": "node --version",
    "Check npm version": "npm --version"
}

for cmd_name, cmd in commands.items():
    print(f"  {cmd_name}:")
    print(f"    {cmd}")

print(f"\n{'='*50}")
print(f"Setup Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
print("="*50)
