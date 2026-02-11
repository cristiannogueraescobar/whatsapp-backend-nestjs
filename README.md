# WhatsApp Backend - Nest.js

Professional backend system for receiving and managing WhatsApp messages via webhook.

## 📋 Description

This backend receives messages from WhatsApp bots, stores them in MongoDB, and provides a REST API to query them. It includes WebSocket support for real-time updates.

## 🚀 Features

- ✅ Webhook endpoint to receive WhatsApp bot messages
- ✅ MongoDB storage (Atlas compatible)
- ✅ REST API to query conversations and messages
- ✅ WebSocket (Socket.io) for real-time updates
- ✅ Modular architecture with Nest.js
- ✅ TypeScript for robust development

## 📦 Requirements

- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **MongoDB**: Local or MongoDB Atlas (recommended)

## 🔧 Installation

### 1. Install dependencies

```bash
npm install
```

### 2. Configure MongoDB

Copy the example file:

```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

Edit the `.env` file and configure your MongoDB connection:

```env
MONGODB_URL=mongodb+srv://user:password@cluster.mongodb.net/whatsapp_db
PORT=3000
NODE_ENV=development
```

**For MongoDB Atlas:**
1. Go to https://cloud.mongodb.com/
2. Create a free cluster (M0)
3. Create a database user
4. Add your IP to the whitelist (or 0.0.0.0/0 for development)
5. Get your CONNECTION STRING from "Connect" → "Drivers"
6. Paste the URL in `MONGODB_URL` (replace `<password>` with your actual password)

### 3. Run the server

**Development mode (with hot-reload):**
```bash
npm run start:dev
```

**Production mode:**
```bash
npm run build
npm run start:prod
```

The server will be available at: `http://localhost:3000`

## 📡 API Endpoints

### 1. Webhook - Receive bot messages

```http
POST /webhook
Content-Type: application/json

{
  "phone": "+34612345678",
  "name": "John Doe",
  "message": "Hello, I need help",
  "timestamp": "2024-02-10T10:30:00Z"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Message received and processed",
  "id": "65c7f8a9b4c5d6e7f8g9h0i1"
}
```

**Notes:**
- The `timestamp` field is optional (uses current date if not provided)
- The webhook only accepts POST method

### 2. Get all conversations

```http
GET /conversations
```

**Response:**
```json
{
  "conversations": [
    {
      "phone": "+34612345678",
      "name": "John Doe",
      "lastMessage": "Hello, I need help",
      "lastTimestamp": "2024-02-10T10:30:00.000Z",
      "unreadCount": 3
    }
  ]
}
```

### 3. Get messages from a conversation

```http
GET /messages/:phone?limit=50
```

**Example:**
```http
GET /messages/+34612345678?limit=100
```

**Response:**
```json
{
  "messages": [
    {
      "id": "65c7f8a9b4c5d6e7f8g9h0i1",
      "phone": "+34612345678",
      "name": "John Doe",
      "message": "Hello",
      "timestamp": "2024-02-10T10:30:00.000Z",
      "isFromBot": false
    }
  ]
}
```

### 4. Delete a conversation

```http
DELETE /conversations/:phone
```

**Example:**
```http
DELETE /conversations/+34612345678
```

## 🔌 WebSocket

The backend includes a WebSocket server to send real-time messages to the frontend.

**Connection:**
```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('message', (data) => {
  console.log('New message:', data);
  // data.type === 'new_message'
  // data.data contains: { id, phone, name, message, timestamp, isFromBot }
});
```

## 🤖 WhatsApp Bot Integration

In your WhatsApp bot code (Node.js), add this code to send messages to the backend:

```javascript
const axios = require('axios');

// Backend URL (adjust according to your configuration)
const BACKEND_URL = 'http://localhost:3000';

// When the bot receives a message
client.on('message', async (message) => {
  try {
    const contact = await message.getContact();
    
    // Send to backend
    await axios.post(`${BACKEND_URL}/webhook`, {
      phone: message.from,
      name: contact.pushname || contact.name || message.from,
      message: message.body,
      timestamp: new Date().toISOString()
    });
    
    console.log('✅ Message sent to backend');
  } catch (error) {
    console.error('❌ Error sending to backend:', error.message);
  }
});
```

## 🧪 Testing the Backend

### Test the webhook manually:

**With curl:**
```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{"phone":"+34612345678","name":"Test User","message":"Hello from curl"}'
```

**With PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/webhook" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"phone":"+34612345678","name":"Test","message":"Hello"}'
```

### Check conversations:

Open your browser at:
```
http://localhost:3000/conversations
```

## 📁 Project Structure

```
src/
├── main.ts                      # Entry point
├── app.module.ts                # Main module
├── schemas/                     # MongoDB schemas
│   ├── message.schema.ts
│   └── conversation.schema.ts
├── dto/                         # Data Transfer Objects
│   └── webhook-message.dto.ts
├── webhook/                     # Webhook module
│   ├── webhook.module.ts
│   └── webhook.controller.ts
├── messages/                    # Messages module
│   ├── messages.module.ts
│   ├── messages.controller.ts
│   └── messages.service.ts
├── conversations/               # Conversations module
│   ├── conversations.module.ts
│   ├── conversations.controller.ts
│   └── conversations.service.ts
└── websocket/                   # WebSocket module
    ├── websocket.module.ts
    └── websocket.gateway.ts
```

## 🗄️ Database

MongoDB automatically creates:

### Collection: messages
```typescript
{
  _id: ObjectId,
  phone: string,
  name: string,
  message: string,
  timestamp: Date,
  isFromBot: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Collection: conversations
```typescript
{
  _id: ObjectId,
  phone: string,
  name: string,
  lastMessage: string,
  lastTimestamp: Date,
  unreadCount: number,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Deployment

### Environment variables in production:

```env
MONGODB_URL=mongodb+srv://user:password@cluster.mongodb.net/whatsapp_db
PORT=3000
NODE_ENV=production
```

### Build for production:

```bash
npm run build
```

Compiled files will be in `dist/`

### Run in production:

```bash
npm run start:prod
```

### With PM2 (recommended):

```bash
npm install -g pm2
pm2 start dist/main.js --name whatsapp-backend
pm2 save
pm2 startup
```

## 🛠️ Available Scripts

```bash
npm run start        # Run in normal mode
npm run start:dev    # Run with hot-reload
npm run start:prod   # Run in production
npm run build        # Compile TypeScript to JavaScript
npm run test         # Run tests
npm run lint         # Check code with ESLint
```

## ❓ Troubleshooting

### Error: Cannot connect to MongoDB

- Verify that MongoDB is running (if local)
- Check the URL in the `.env` file
- Make sure your IP is allowed in MongoDB Atlas (Network Access)
- Verify that the password in the CONNECTION STRING is correct

### Error: Port 3000 already in use

Change the port in `.env`:
```env
PORT=3001
```

### WebSocket doesn't connect from frontend

- Verify that CORS is enabled
- Make sure you're using the correct server URL
- In production, use WSS (WebSocket Secure) with SSL certificate

### Bot doesn't send messages

- Verify that the webhook URL is accessible from where the bot runs
- In local development, use ngrok to expose localhost
- Make sure the bot is making POST requests, not GET

## 🔐 Security

For production, consider:

- ✅ Add JWT authentication
- ✅ Validate webhook with API key or signature
- ✅ Rate limiting
- ✅ Configure CORS properly
- ✅ Use environment variables for secrets
- ✅ HTTPS/WSS instead of HTTP/WS

## 📚 Technologies Used

- [Nest.js](https://docs.nestjs.com/) - Backend framework
- [Mongoose](https://mongoosejs.com/) - MongoDB ODM
- [Socket.io](https://socket.io/docs/v4/) - WebSockets
- [MongoDB Atlas](https://www.mongodb.com/docs/atlas/) - Cloud database
- [TypeScript](https://www.typescriptlang.org/) - Typed language

## 📝 Notes

- The backend has NO authentication by default - add it in production
- The `node_modules` folder is not included - install with `npm install`
- The `.env` file is not included - create it from `.env.example`

## 📄 License

MIT
