// commands/repo.js

const REPO_LINK = 'https://github.com/BLACK-HAT-911/LUFFY-V1';

export default {
  name: 'repo',
  alias: ['source', 'github'],
  category: 'info',
  description: 'Send the bot repository link',
  usage: 'repo',
  react: '📂',

  async execute(sock, m) {
    try {
      const buttons = [
        {
          buttonId: 'repo',
          buttonText: { displayText: 'Open Repo' },
          type: 1
        }
      ];

      const buttonMessage = {
        text: `📂 *LUFFY V1* GitHub Repository\n\nYou can check the full source code here:`,
        footer: REPO_LINK,
        buttons,
        headerType: 1
      };

      await sock.sendMessage(m.chat, buttonMessage, { quoted: m });

    } catch (err) {
      console.error('[REPO COMMAND ERROR]', err);
      await sock.sendMessage(m.chat, { text: '⚠️ Failed to send repo link.' }, { quoted: m });
    }
  }
};