// commands/public.js

import fs from 'fs';
const modeFile = './database/mode.json';

// Ensure database folder and file exist
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
  name: 'public',
  alias: [],
  category: 'system',
  description: 'Set bot to public mode (respond to everyone)',
  usage: 'public',
  react: '🌐',
  
  async execute(sock, m, args, { botNumber }) {
    try {
      const senderJid = m.sender?.split('@')[0];
      const botJid = botNumber?.split('@')[0];
      
      if (senderJid !== botJid) {
        return await sock.sendMessage(m.chat, {
          text: '❌ This command is only for the bot owner (the number the bot is logged in as).'
        }, { quoted: m });
      }
      
      setMode('public');
      
      await sock.sendMessage(m.chat, {
        text: '✅ Bot is now in *PUBLIC MODE*.\nIt will respond to everyone.'
      }, { quoted: m });
      
    } catch (err) {
      console.error('[PUBLIC ERROR]', err);
      await sock.sendMessage(m.chat, {
        text: '⚠️ Failed to enter public mode.'
      }, { quoted: m });
    }
  }
};