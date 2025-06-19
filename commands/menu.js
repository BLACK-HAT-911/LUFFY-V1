// commands/menu.js
import { downloadContentFromMessage } from '@whiskeysockets/baileys';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const OWNER = 'BLACK-HAT-911';
const OWNER_NUM = '+254780931677';
const BOT_NAME = 'LUFFY V1';
const BANNER_URL = 'https://files.catbox.moe/kxlcw6.jpg';
const REPO_LINK = 'https://github.com/BLACK-HAT-911/LUFFY-V1';
const CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbAxoHNF6sn7hhz2Ss24'; // <-- replace if needed

const MENU_COMMANDS = ['luffy', 'start', 'bot', 'monkey'];

const getDate = () => {
  const now = new Date();
  return `${String(now.getDate()).padStart(2, '0')}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getFullYear()).slice(2)}`;
};

const menuText = (user) => `｟ 𝐋𝐔𝐅𝐅𝐘 𝐕!𝟏 𝐌𝐀𝐈𝐍 𝐌𝐄𝐍𝐔 ｠  
⪨ *Bot Name : ${BOT_NAME}*  
⪨ *Owner : @${user.replace('+', '')}*  
⪨ *Prefix : [/.]*  
⪨ *Commands : 9*  
⪨ *Date : ${getDate()}*  

—( 𝐂𝐨𝐦𝐦𝐚𝐧𝐝 𝐋𝐢𝐬𝐭 )  
> *play*  
> *apk*  
> *autoreact*  
> *self*  
> *public*  
> *owner*  
> *repo*  
> *channel*  
> *telegram*  

𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐋𝐔𝐅𝐅𝐘 𝐕𝟏`;

export default {
  name: 'menu',
  alias: MENU_COMMANDS,
  description: 'Show LUFFY V1 main menu',
  category: 'main',
  usage: '',
  react: '☠️',
  async execute(sock, m, args, commandInfo) {
    try {
      const sender = m.pushName || 'User';
      const userJid = m.sender;
      
      await sock.sendMessage(m.chat, {
        image: { url: BANNER_URL },
        caption: menuText(userJid.split('@')[0]),
        contextInfo: {
          externalAdReply: {
            title: `${BOT_NAME} ┃ Main Menu`,
            body: `By ${OWNER}`,
            thumbnailUrl: BANNER_URL,
            mediaType: 1,
            renderLargerThumbnail: true,
            showAdAttribution: true,
            sourceUrl: REPO_LINK,
          }
        }
      }, { quoted: m });
    } catch (err) {
      console.error('Error in menu.js:', err);
      await sock.sendMessage(m.chat, { text: '⚠️ Failed to load menu.' }, { quoted: m });
    }
  }
};