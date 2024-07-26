const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
  authStrategy: new LocalAuth()
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('message_create', message => {
  const user = message.from;

  const isGroup = message.getChat().isGroup;

  if(message.isStatus || isGroup) {
    console.log('group: ' + message.body); 
    return;
  } else {
    console.log('not group: ' + message.body);
  }
}); 

client.initialize();
