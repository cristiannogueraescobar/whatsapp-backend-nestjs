# 🚀 GUÍA RÁPIDA DE INSTALACIÓN

## ⚡ Instalación en 3 pasos

### 1️⃣ Instalar dependencias
```bash
npm install
```
(Tardará 2-3 minutos)

### 2️⃣ Configurar MongoDB
```bash
# Windows
copy .env.example .env

# Mac/Linux  
cp .env.example .env
```

Edita `.env` y pega tu CONNECTION STRING de MongoDB Atlas:
```env
MONGODB_URL=mongodb+srv://usuario:password@cluster.mongodb.net/whatsapp_db
```

**¿No tienes MongoDB Atlas?**
1. Ve a https://cloud.mongodb.com/
2. Crea cuenta gratis
3. Crea cluster M0 (gratis)
4. Crea usuario de base de datos
5. En "Network Access" añade IP: `0.0.0.0/0`
6. En "Connect" → "Drivers" copia la CONNECTION STRING

### 3️⃣ Ejecutar
```bash
npm run start:dev
```

Deberías ver:
```
🚀 Backend corriendo en http://localhost:3000
📡 WebSocket disponible en ws://localhost:3000
```

---

## ✅ Probar que funciona

**Abre el navegador en:**
```
http://localhost:3000/conversations
```

Deberías ver:
```json
{"conversations":[]}
```

**Enviar mensaje de prueba:**
```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{"phone":"+34612345678","name":"Test","message":"Hola"}'
```

---

## 🤖 Conectar el bot de WhatsApp

En el código del bot, añade:

```javascript
const axios = require('axios');

client.on('message', async (message) => {
  const contact = await message.getContact();
  
  await axios.post('http://localhost:3000/webhook', {
    phone: message.from,
    name: contact.pushname || contact.name,
    message: message.body
  });
});
```

---

## 📖 Documentación completa

Ver `README.md` para toda la documentación.

---

## ⚠️ Problemas comunes

**Error de MongoDB:**
- Verifica tu CONNECTION STRING en `.env`
- Asegúrate de reemplazar `<password>` con tu contraseña real
- Verifica que tu IP esté en la whitelist de MongoDB Atlas

**Puerto 3000 ocupado:**
Cambia el puerto en `.env`: `PORT=3001`

**¿Más ayuda?**
Lee el `README.md` completo.
