// commands/autoreact.js

import fs from 'fs';
const dbPath = './database/autoreact.json';

// Create the database folder/file if missing
if (!fs.existsSync('./database')) fs.mkdirSync('./database');
if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify({}));

// Load database safely with encoding
const loadData = () => {
  try {
    return JSON.parse(fs.readFileSync(dbPath, { encoding: 'utf8' }));
  } catch {
    return {};
  }
};

// Save updated state
const saveData = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

export default {
  name: 'autoreact',
  alias: [],
  category: 'system',
  description: 'Toggle automatic emoji reaction per chat',
  usage: 'autoreact on/off',
  react: '❤️',
  
  async execute(sock, m, args) {
    try {
      const jid = m.chat;
      const db = loadData();
      
      if (!args[0] || !['on', 'off'].includes(args[0].toLowerCase())) {
        return await sock.sendMessage(jid, {
          text: `❗Usage: /autoreact on or /autoreact off`
        }, { quoted: m });
      }
      
      const toggle = args[0].toLowerCase() === 'on';
      db[jid] = toggle;
      saveData(db);
      
      const replyText = toggle ?
        `✅ Auto-react has been *enabled* for this chat.\nI will now react ❤️ to all messages.` :
        `❌ Auto-react has been *disabled* for this chat.`;
      
      await sock.sendMessage(jid, { text: replyText }, { quoted: m });
      
    } catch (err) {
      console.error('[AutoReact Error]', err);
      await sock.sendMessage(m.chat, {
        text: '⚠️ Failed to update auto-react setting.'
      }, { quoted: m });
    }
  }
};