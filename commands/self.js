// commands/self.js

import fs from 'fs';
const modeFile = './database/mode.json';

// Ensure the database directory and file exist
if (!fs.existsSync('./database')) fs.mkdirSync('./database');
if (!fs.existsSync(modeFile)) fs.writeFileSync(modeFile, JSON.stringify({ mode: 'public' }));

// Helpers to load/save mode
const getMode = () => {
  try {
    const data = JSON.parse(fs.readFileSync(modeFile, { encoding: 'utf8' }));
    return data.mode || 'public';
  } catch {
    return 'public';
  }
};

const setMode = (mode) => {
  fs.writeFileSync(modeFile, JSON.stringify({ mode }, null, 2));
};

export default {
  name: 'self',
  alias: [],
  category: 'system',
  description: 'Put bot in self mode (only respond to owner)',
  usage: 'self',
  react: '🔒',
  
  async execute(sock, m, args, { botNumber }) {
    try {
      const senderJid = m.sender?.split('@')[0];
      const botJid = botNumber?.split('@')[0];
      
      if (senderJid !== botJid) {
        return await sock.sendMessage(m.chat, {
          text: '❌ This command is only for the bot owner (the number the bot is logged in as).'
        }, { quoted: m });
      }
      
      setMode('self');
      
      await sock.sendMessage(m.chat, {
        text: '✅ Bot is now in *SELF MODE*.\nOnly you can use it.'
      }, { quoted: m });
      
    } catch (err) {
      console.error('[SELF ERROR]', err);
      await sock.sendMessage(m.chat, {
        text: '⚠️ Failed to enter self mode.'
      }, { quoted: m });
    }
  }
};