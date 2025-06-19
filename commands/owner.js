// commands/owner.js

const OWNER_NUMBER = '+254780931677';
const OWNER_NAME = 'BLACK-HAT-911';

export default {
  name: 'owner',
  alias: ['creator', 'dev'],
  category: 'info',
  description: 'Show bot owner contact as vCard',
  usage: 'owner',
  react: '👑',
  
  async execute(sock, m) {
    try {
      const jid = m.chat;
      const ownerJid = OWNER_NUMBER.replace(/^\+/, '') + '@s.whatsapp.net';
      
      // Prepare vCard string
      const vcard =
        `BEGIN:VCARD
VERSION:3.0
FN:${OWNER_NAME}
TEL;type=CELL;type=VOICE;waid=${OWNER_NUMBER.replace(/\D/g, '')}:${OWNER_NUMBER}
END:VCARD`;
      
      await sock.sendMessage(jid, {
        contacts: {
          displayName: OWNER_NAME,
          contacts: [{ vcard }]
        },
        mentions: [ownerJid]
      }, { quoted: m });
      
    } catch (err) {
      console.error('[OWNER COMMAND ERROR]', err);
      await sock.sendMessage(m.chat, {
        text: '⚠️ Failed to send owner contact.'
      }, { quoted: m });
    }
  }
};