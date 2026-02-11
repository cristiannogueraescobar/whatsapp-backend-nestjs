# Backend WhatsApp - Nest.js

Backend profesional para recibir y gestionar mensajes de WhatsApp a través de webhook.

## 📋 Descripción

Este backend recibe mensajes del bot de WhatsApp, los almacena en MongoDB y proporciona una API REST para consultarlos. Incluye soporte para WebSockets para actualizaciones en tiempo real.

## 🚀 Características

- ✅ Webhook para recibir mensajes del bot de WhatsApp
- ✅ Almacenamiento en MongoDB (Atlas compatible)
- ✅ API REST para consultar conversaciones y mensajes
- ✅ WebSocket (Socket.io) para actualizaciones en tiempo real
- ✅ Arquitectura modular con Nest.js
- ✅ TypeScript para desarrollo robusto

## 📦 Requisitos

- **Node.js**: v18 o superior
- **npm**: v9 o superior
- **MongoDB**: Local o MongoDB Atlas (recomendado)

## 🔧 Instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar MongoDB

Copia el archivo de ejemplo:

```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

Edita el archivo `.env` y configura tu conexión a MongoDB:

```env
MONGODB_URL=mongodb+srv://usuario:password@cluster.mongodb.net/whatsapp_db
PORT=3000
NODE_ENV=development
```

**Para MongoDB Atlas:**
1. Ve a https://cloud.mongodb.com/
2. Crea un cluster gratuito (M0)
3. Crea un usuario de base de datos
4. Añade tu IP a la whitelist (o 0.0.0.0/0 para desarrollo)
5. Obtén tu CONNECTION STRING desde "Connect" → "Drivers"
6. Pega la URL en `MONGODB_URL` (reemplaza `<password>` con tu contraseña real)

### 3. Ejecutar el servidor

**Modo desarrollo (con hot-reload):**
```bash
npm run start:dev
```

**Modo producción:**
```bash
npm run build
npm run start:prod
```

El servidor estará disponible en: `http://localhost:3000`

## 📡 API Endpoints

### 1. Webhook - Recibir mensajes del bot

```http
POST /webhook
Content-Type: application/json

{
  "phone": "+34612345678",
  "name": "Juan Pérez",
  "message": "Hola, necesito ayuda",
  "timestamp": "2024-02-10T10:30:00Z"
}
```

**Respuesta:**
```json
{
  "status": "success",
  "message": "Mensaje recibido y procesado",
  "id": "65c7f8a9b4c5d6e7f8g9h0i1"
}
```

**Notas:**
- El campo `timestamp` es opcional (si no se envía, usa la fecha actual)
- El webhook solo acepta método POST

### 2. Obtener todas las conversaciones

```http
GET /conversations
```

**Respuesta:**
```json
{
  "conversations": [
    {
      "phone": "+34612345678",
      "name": "Juan Pérez",
      "lastMessage": "Hola, necesito ayuda",
      "lastTimestamp": "2024-02-10T10:30:00.000Z",
      "unreadCount": 3
    }
  ]
}
```

### 3. Obtener mensajes de una conversación

```http
GET /messages/:phone?limit=50
```

**Ejemplo:**
```http
GET /messages/+34612345678?limit=100
```

**Respuesta:**
```json
{
  "messages": [
    {
      "id": "65c7f8a9b4c5d6e7f8g9h0i1",
      "phone": "+34612345678",
      "name": "Juan Pérez",
      "message": "Hola",
      "timestamp": "2024-02-10T10:30:00.000Z",
      "isFromBot": false
    }
  ]
}
```

### 4. Eliminar una conversación

```http
DELETE /conversations/:phone
```

**Ejemplo:**
```http
DELETE /conversations/+34612345678
```

## 🔌 WebSocket

El backend incluye un servidor WebSocket para enviar mensajes en tiempo real al frontend.

**Conexión:**
```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Conectado al servidor');
});

socket.on('message', (data) => {
  console.log('Nuevo mensaje:', data);
  // data.type === 'new_message'
  // data.data contiene: { id, phone, name, message, timestamp, isFromBot }
});
```

## 🤖 Integrar con el Bot de WhatsApp

En el código del bot de WhatsApp (Node.js), añade este código para enviar mensajes al backend:

```javascript
const axios = require('axios');

// URL del backend (ajusta según tu configuración)
const BACKEND_URL = 'http://localhost:3000';

// Cuando el bot reciba un mensaje
client.on('message', async (message) => {
  try {
    const contact = await message.getContact();
    
    // Enviar al backend
    await axios.post(`${BACKEND_URL}/webhook`, {
      phone: message.from,
      name: contact.pushname || contact.name || message.from,
      message: message.body,
      timestamp: new Date().toISOString()
    });
    
    console.log('✅ Mensaje enviado al backend');
  } catch (error) {
    console.error('❌ Error enviando al backend:', error.message);
  }
});
```

## 🧪 Probar el Backend

### Probar el webhook manualmente:

**Con curl:**
```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{"phone":"+34612345678","name":"Test User","message":"Hola desde curl"}'
```

**Con PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/webhook" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"phone":"+34612345678","name":"Test","message":"Hola"}'
```

### Verificar conversaciones:

Abre el navegador en:
```
http://localhost:3000/conversations
```

## 📁 Estructura del Proyecto

```
src/
├── main.ts                      # Punto de entrada
├── app.module.ts                # Módulo principal
├── schemas/                     # Esquemas de MongoDB
│   ├── message.schema.ts
│   └── conversation.schema.ts
├── dto/                         # Data Transfer Objects
│   └── webhook-message.dto.ts
├── webhook/                     # Módulo webhook
│   ├── webhook.module.ts
│   └── webhook.controller.ts
├── messages/                    # Módulo mensajes
│   ├── messages.module.ts
│   ├── messages.controller.ts
│   └── messages.service.ts
├── conversations/               # Módulo conversaciones
│   ├── conversations.module.ts
│   ├── conversations.controller.ts
│   └── conversations.service.ts
└── websocket/                   # Módulo WebSocket
    ├── websocket.module.ts
    └── websocket.gateway.ts
```

## 🗄️ Base de Datos

MongoDB crea automáticamente:

### Colección: messages
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

### Colección: conversations
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

## 🚀 Despliegue

### Variables de entorno en producción:

```env
MONGODB_URL=mongodb+srv://usuario:password@cluster.mongodb.net/whatsapp_db
PORT=3000
NODE_ENV=production
```

### Build para producción:

```bash
npm run build
```

Los archivos compilados estarán en `dist/`

### Ejecutar en producción:

```bash
npm run start:prod
```

### Con PM2 (recomendado):

```bash
npm install -g pm2
pm2 start dist/main.js --name whatsapp-backend
pm2 save
pm2 startup
```

## 🛠️ Scripts Disponibles

```bash
npm run start        # Ejecutar en modo normal
npm run start:dev    # Ejecutar con hot-reload
npm run start:prod   # Ejecutar en producción
npm run build        # Compilar TypeScript a JavaScript
npm run test         # Ejecutar tests
npm run lint         # Verificar código con ESLint
```

## ❓ Troubleshooting

### Error: Cannot connect to MongoDB

- Verifica que MongoDB esté corriendo (si es local)
- Revisa la URL en el archivo `.env`
- Asegúrate de que la IP esté permitida en MongoDB Atlas (Network Access)
- Verifica que la contraseña en la CONNECTION STRING sea correcta

### Error: Port 3000 already in use

Cambia el puerto en `.env`:
```env
PORT=3001
```

### WebSocket no conecta desde el frontend

- Verifica que CORS esté habilitado
- Asegúrate de usar la URL correcta del servidor
- En producción, usa WSS (WebSocket Secure) con certificado SSL

### El bot no envía mensajes

- Verifica que la URL del webhook sea accesible desde donde corre el bot
- En desarrollo local, usa ngrok para exponer el localhost
- Asegúrate de que el bot esté haciendo POST, no GET

## 🔐 Seguridad

Para producción, considera:

- ✅ Añadir autenticación JWT
- ✅ Validar webhook con API key o firma
- ✅ Rate limiting
- ✅ Configurar CORS correctamente
- ✅ Usar variables de entorno para secretos
- ✅ HTTPS/WSS en lugar de HTTP/WS

## 📚 Tecnologías Utilizadas

- [Nest.js](https://docs.nestjs.com/) - Framework backend
- [Mongoose](https://mongoosejs.com/) - ODM para MongoDB
- [Socket.io](https://socket.io/docs/v4/) - WebSockets
- [MongoDB Atlas](https://www.mongodb.com/docs/atlas/) - Base de datos en la nube
- [TypeScript](https://www.typescriptlang.org/) - Lenguaje tipado

## 📝 Notas

- El backend NO tiene autenticación por defecto - añádela en producción
- La carpeta `node_modules` no está incluida - se instala con `npm install`
- El archivo `.env` no está incluido - créalo desde `.env.example`

## 💬 Soporte

Para preguntas o problemas, contactar al desarrollador.

## 📄 Licencia

MIT
