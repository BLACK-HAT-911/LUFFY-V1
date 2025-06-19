// commands/channel.js

const CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbAxoHNF6sn7hhz2Ss24';

export default {
  name: 'channel',
  alias: ['whatsappchannel', 'wachannel'],
  category: 'info',
  description: 'Send the official WhatsApp channel link',
  usage: 'channel',
  react: '📢',

  async execute(sock, m) {
    try {
      const buttons = [
        {
          buttonId: 'channel',
          buttonText: { displayText: 'Join Channel' },
          type: 1
        }
      ];

      const buttonMessage = {
        text: `📢 *LUFFY V1* Official WhatsApp Channel\n\nClick below to join and stay updated!`,
        footer: CHANNEL_LINK,
        buttons,
        headerType: 1
      };

      await sock.sendMessage(m.chat, buttonMessage, { quoted: m });

    } catch (err) {
      console.error('[CHANNEL COMMAND ERROR]', err);
      await sock.sendMessage(m.chat, { text: '⚠️ Failed to send channel link.' }, { quoted: m });
    }
  }
};