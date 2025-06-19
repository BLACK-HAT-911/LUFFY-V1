// commands/telegram.js

const TELEGRAM_LINK = 'https://t.me/lpg1_tech';

export default {
  name: 'telegram',
  alias: ['tg', 'programmingchannel'],
  category: 'info',
  description: 'Get the Telegram channel link to learn programming free',
  usage: 'telegram',
  react: '🚀',

  async execute(sock, m) {
    try {
      const buttons = [
        {
          buttonId: 'telegram',
          buttonText: { displayText: 'Join Now 🚀' },
          type: 1
        }
      ];

      const text = 
`🔥 *Unlock Your Programming Skills For FREE!* 🔥

Join the *LUFFY V1* recommended Telegram channel where you get top-quality programming tutorials, tips, and support — all at zero cost! 💻✨

Don't miss out — this is your launchpad to becoming a coding pro! 🚀`;

      const buttonMessage = {
        text,
        footer: TELEGRAM_LINK,
        buttons,
        headerType: 1
      };

      await sock.sendMessage(m.chat, buttonMessage, { quoted: m });

    } catch (err) {
      console.error('[TELEGRAM COMMAND ERROR]', err);
      await sock.sendMessage(m.chat, { text: '⚠️ Failed to send Telegram channel link.' }, { quoted: m });
    }
  }
};