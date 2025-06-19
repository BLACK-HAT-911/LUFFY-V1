// events/messageCreate.js

import fs from 'fs';
import path from 'path';

// Config
const PREFIXES = ['.', '/'];
const AUTOREACT_DB_PATH = './database/autoreact.json';
const COMMANDS_DIR = './commands';

export default async function messageCreate(sock, m) {
  try {
    // Basic checks
    if (!m.message) return; // no message content
    if (m.key && m.key.remoteJid === 'status@broadcast') return; // ignore status
    
    const sender = m.sender; // full jid (e.g. 254780931677@s.whatsapp.net)
    const senderNumber = sender.split('@')[0];
    const chatId = m.chat;
    const isGroup = chatId.endsWith('@g.us');
    const botNumber = sock.user?.id?.split(':')[0];
    
    // Load autoreact db and react if enabled
    let autoReactData = {};
    if (fs.existsSync(AUTOREACT_DB_PATH)) {
      autoReactData = JSON.parse(fs.readFileSync(AUTOREACT_DB_PATH, { encoding: 'utf8' }));
    }
    if (autoReactData[chatId]) {
      try {
        await sock.sendMessage(chatId, {
          react: { text: '❤️', key: m.key }
        });
      } catch (e) {
        console.error('Auto-react failed:', e);
      }
    }
    
    // Load bot mode (self/public)
    let mode = 'public';
    const modePath = './database/mode.json';
    if (fs.existsSync(modePath)) {
      const modeData = JSON.parse(fs.readFileSync(modePath, { encoding: 'utf8' }));
      mode = modeData.mode || 'public';
    }
    
    // In self mode, ignore all except owner messages
    if (mode === 'self' && senderNumber !== botNumber) return;
    
    // Extract command and args
    let body = '';
    
    // Support text messages (including extended text)
    if (m.message.conversation) body = m.message.conversation;
    else if (m.message.extendedTextMessage?.text) body = m.message.extendedTextMessage.text;
    else return; // unsupported message type
    
    // Detect prefix if any
    const prefix = PREFIXES.find(p => body.startsWith(p));
    const isCommand = prefix != null;
    
    // Extract command name & args
    let commandName = '';
    let args = [];
    if (isCommand) {
      const parts = body.slice(prefix.length).trim().split(/\s+/);
      commandName = parts.shift().toLowerCase();
      args = parts;
    } else {
      // No prefix - allow some commands without prefix like menu commands
      const noPrefixCmds = ['luffy', 'start', 'bot', 'monkey'];
      const firstWord = body.trim().split(/\s+/)[0].toLowerCase();
      if (noPrefixCmds.includes(firstWord)) {
        commandName = 'menu'; // map to menu command
        args = [];
      }
    }
    
    if (!commandName) return;
    
    // Load commands dynamically
    const commandFiles = fs.readdirSync(COMMANDS_DIR).filter(file => file.endsWith('.js'));
    const commands = {};
    for (const file of commandFiles) {
      const command = await import(path.join(process.cwd(), COMMANDS_DIR, file));
      commands[command.default.name] = command.default;
      if (command.default.alias) {
        for (const alias of command.default.alias) {
          commands[alias] = command.default;
        }
      }
    }
    
    const command = commands[commandName];
    if (!command) return; // command not found
    
    // Execute command
    await command.execute(sock, m, args, { botNumber });
    
  } catch (err) {
    console.error('⚠️ Error in messageCreate event:', err);
  }
}