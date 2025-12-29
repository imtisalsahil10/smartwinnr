# Environment Configuration Template

## Backend Server (.env)

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/smartwinnr_chat

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_that_should_be_very_long_and_random_123456

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5000

# File Upload Configuration
MAX_FILE_SIZE=5242880  # 5MB in bytes
UPLOAD_FOLDER=./uploads
```

## Frontend Configuration (client/package.json)

```json
{
  "proxy": "http://localhost:5000",
  "homepage": ".",
}
```

## Frontend Environment Variables (if needed)

Create `client/.env` file:
```bash
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## Production Configuration

### Backend (.env for Production)

```bash
# Server Configuration
PORT=80
NODE_ENV=production

# Database Configuration
MONGODB_URI=mongodb://your-prod-db-host:27017/smartwinnr_chat

# JWT Configuration (use strong secret)
JWT_SECRET=super_strong_random_secret_key_for_production_only

# CORS Configuration
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# File Upload Configuration
MAX_FILE_SIZE=10485760  # 10MB
UPLOAD_FOLDER=/var/uploads

# Session Configuration
SESSION_SECRET=another_random_secret_key

# Rate Limiting
RATE_LIMIT_WINDOW=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend Build Configuration

```bash
# In client directory
npm run build

# This creates optimized production build in 'build' folder
```

## MongoDB Setup

### Local Development

```bash
# Start MongoDB server
mongod

# Connect to database
mongo mongodb://localhost:27017/smartwinnr_chat

# View collections
show collections

# View users
db.users.find()

# View messages
db.messages.find()

# View rooms
db.rooms.find()
```

### MongoDB Atlas (Cloud)

```
1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create cluster
3. Get connection string
4. Update MONGODB_URI in .env:
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/smartwinnr_chat?retryWrites=true&w=majority
```

## Docker Configuration (Optional)

### Dockerfile for Backend

```dockerfile
FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
```

### Dockerfile for Frontend

```dockerfile
FROM node:16 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:5.0
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: smartwinnr_chat

  backend:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/smartwinnr_chat
      - JWT_SECRET=your_jwt_secret
      - NODE_ENV=development
    depends_on:
      - mongodb

  frontend:
    build: ./client
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

## Environment Variable Security

### Best Practices

1. **Never commit .env files** - Add to .gitignore
2. **Use strong secrets** - Min 32 characters for JWT_SECRET
3. **Different secrets per environment** - Dev, staging, production
4. **Rotate secrets regularly** - Update in production
5. **Use environment-specific configs** - Don't hardcode values
6. **Encrypt sensitive data** - Use AWS Secrets Manager, Vault, etc.
7. **Audit access logs** - Monitor who accesses configuration
8. **Use HTTPS in production** - For all connections
9. **Validate all inputs** - Server and client-side
10. **Limit CORS origins** - Only allow necessary domains

## Windows System Environment Variables

### For Global Access

1. Open System Properties → Environment Variables
2. Add new variables:
   - Variable name: `MONGODB_URI`
   - Variable value: `mongodb://localhost:27017/smartwinnr_chat`
3. Restart applications to apply

## macOS/Linux System Environment Variables

### Add to ~/.bash_profile or ~/.zshrc

```bash
export MONGODB_URI=mongodb://localhost:27017/smartwinnr_chat
export JWT_SECRET=your_secret_key
export NODE_ENV=development
export PORT=5000
```

Then apply:
```bash
source ~/.bash_profile  # or ~/.zshrc
```

## Checking Configuration

### Verify Environment Variables

```bash
# Show all environment variables
env

# Check specific variable
echo $MONGODB_URI

# In Node.js
console.log(process.env.MONGODB_URI)

# In React
console.log(process.env.REACT_APP_API_URL)
```

## Production Deployment Checklist

- [ ] Change NODE_ENV to 'production'
- [ ] Use strong JWT_SECRET (32+ characters)
- [ ] Configure production MONGODB_URI
- [ ] Update CORS allowed origins
- [ ] Enable HTTPS
- [ ] Set secure cookie flags
- [ ] Implement rate limiting
- [ ] Add logging and monitoring
- [ ] Setup database backups
- [ ] Configure error tracking (Sentry)
- [ ] Setup CDN for static assets
- [ ] Enable compression middleware
- [ ] Configure WAF (Web Application Firewall)
- [ ] Setup monitoring and alerts
- [ ] Document deployment process
- [ ] Prepare rollback procedure

