// commands/apk.js
import axios from 'axios';
import fs from 'fs';
import path from 'path';

export default {
  name: 'apk',
  alias: [],
  category: 'downloader',
  description: 'Download APK from Play Store',
  usage: 'apk <app name>',
  react: '📦',
  
  async execute(sock, m, args) {
    try {
      if (!args[0]) {
        return await sock.sendMessage(m.chat, {
          text: '❗Please provide an app name.\n\n*Usage:* /apk WhatsApp'
        }, { quoted: m });
      }
      
      const query = args.join(' ');
      const apiURL = `https://api.nexoracle.com/downloader/apk?apikey=7902cbef76b269e176&q=${encodeURIComponent(query)}`;
      
      const { data } = await axios.get(apiURL, { responseType: 'arraybuffer' });
      
      if (!data || data.length < 1000) {
        return await sock.sendMessage(m.chat, {
          text: '❗APK not found or failed to download. Try another app.'
        }, { quoted: m });
      }
      
      const tempPath = path.join('./', `${Date.now()}.apk`);
      fs.writeFileSync(tempPath, data);
      
      await sock.sendMessage(m.chat, {
        document: fs.readFileSync(tempPath),
        fileName: `${query}.apk`,
        mimetype: 'application/vnd.android.package-archive'
      }, { quoted: m });
      
      fs.unlinkSync(tempPath); // cleanup
      
    } catch (err) {
      console.error('APK Error:', err);
      await sock.sendMessage(m.chat, {
        text: '⚠️ Something went wrong while fetching the APK.'
      }, { quoted: m });
    }
  }
};