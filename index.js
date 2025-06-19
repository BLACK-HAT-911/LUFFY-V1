import baileys from '@whiskeysockets/baileys';
const { makeWASocket, useSingleFileAuthState, fetchLatestBaileysVersion, DisconnectReason, makeInMemoryStore } = baileys;

import P from 'pino';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import express from 'express';
import qrcode from 'qrcode-terminal';
import { fileURLToPath } from 'url';

// Load .env
dotenv.config();

// Setup __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Express server for Render (web root alive)
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (_, res) => {
  res.send('🤖 LUFFY V1 is running...');
});
app.listen(PORT, () => console.log(`🌐 Web server ready on port ${PORT}`));

// Setup Baileys auth
const SESSION_FILE = `./${process.env.AUTH_FILE || 'luffy_auth'}.json`;
const { state, saveState } = useSingleFileAuthState(SESSION_FILE);
const store = makeInMemoryStore({ logger: P().child({ level: 'silent', stream: 'store' }) });

// Load events from /events
const loadEvents = async (sock) => {
  const eventsPath = path.join(__dirname, 'events');
  const eventFiles = fs.readdirSync(eventsPath).filter(f => f.endsWith('.js'));
  
  for (const file of eventFiles) {
    try {
      const event = await import(`./events/${file}`);
      const eventName = file.replace('.js', '');
      sock.ev.on(eventName, (...args) => event.default(sock, ...args));
    } catch (err) {
      console.error(`❌ Failed to load event ${file}:`, err);
    }
  }
};

// Start the bot
async function startBot() {
  const { version, isLatest } = await fetchLatestBaileysVersion();
  console.log(`📦 Baileys v${version.join('.')}, Latest: ${isLatest}`);
  
  const sock = makeWASocket({
    version,
    logger: P({ level: 'silent' }),
    printQRInTerminal: true,
    auth: state,
    browser: ['LUFFY V1', 'Safari', '1.0.0']
  });
  
  store.bind(sock.ev);
  
  // Auto-save creds on update
  sock.ev.on('creds.update', saveState);
  
  // Handle connection updates
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;
    
    if (qr) {
      qrcode.generate(qr, { small: true });
    }
    
    if (connection === 'close') {
      const reason = lastDisconnect?.error?.output?.statusCode;
      
      if (reason === DisconnectReason.loggedOut) {
        console.log('❌ Session expired. Delete auth file and re-scan QR.');
        if (fs.existsSync(SESSION_FILE)) fs.unlinkSync(SESSION_FILE);
      } else {
        console.log('⚠️ Disconnected. Trying to reconnect...');
        startBot();
      }
    } else if (connection === 'open') {
      console.log('✅ LUFFY V1 connected to WhatsApp');
    }
  });
  
  // Load events
  await loadEvents(sock);
}

// Start everything
startBot();