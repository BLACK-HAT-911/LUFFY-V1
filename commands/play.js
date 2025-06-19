// commands/play.js
import axios from 'axios';
import fs from 'fs';
import path from 'path';

export default {
  name: 'play',
  alias: [],
  category: 'downloader',
  description: 'Play music from YouTube (MP3)',
  usage: 'play <song name>',
  react: '🎵',
  
  async execute(sock, m, args) {
    try {
      if (!args[0]) {
        return await sock.sendMessage(m.chat, {
          text: '❗Please provide a song name.\n\n*Usage:* /play Despacito'
        }, { quoted: m });
      }
      
      const query = args.join(' ');
      const apiURL = `https://api.nexoracle.com/downloader/ytplaymp3?apikey=7902cbef76b269e176&q=${encodeURIComponent(query)}`;
      
      const res = await axios.get(apiURL);
      const result = res.data;
      
      if (!result || !result.result || !result.result.url) {
        return await sock.sendMessage(m.chat, {
          text: '❗Could not find the audio. Try a different song.'
        }, { quoted: m });
      }
      
      const audioBuffer = await axios.get(result.result.url, { responseType: 'arraybuffer' });
      const tempFile = path.join('./', `${Date.now()}.mp3`);
      fs.writeFileSync(tempFile, audioBuffer.data);
      
      await sock.sendMessage(m.chat, {
        audio: fs.readFileSync(tempFile),
        mimetype: 'audio/mpeg',
        ptt: false
      }, { quoted: m });
      
      fs.unlinkSync(tempFile); // cleanup
      
    } catch (err) {
      console.error('Play command error:', err);
      await sock.sendMessage(m.chat, {
        text: '⚠️ Something went wrong while processing your request.'
      }, { quoted: m });
    }
  }
};