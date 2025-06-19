// events/ready.js

export default async function ready(sock) {
  try {
    const botNumber = sock.user?.id?.split(':')[0];
    console.log(`🤖 LUFFY V1 is online!`);
    console.log(`Bot Number: +${botNumber}`);
    
    // Optional: send a "bot is online" message to the owner
    // Uncomment and set ownerJid to your owner's WhatsApp jid if needed
    
    // const ownerJid = '254780931677@s.whatsapp.net';
    // await sock.sendMessage(ownerJid, { text: '✅ LUFFY V1 Bot is now online!' });
    
  } catch (err) {
    console.error('⚠️ Error in ready event:', err);
  }
}