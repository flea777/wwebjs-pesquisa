const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');
const messages = require('./messages');

const baseUrl = 'http://localhost:8080/message';

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

  const isGroup = false;
  
  if(message.from.includes('g.us')) {
    isGroup = true;
  }

  const body = message.body;
  const user = message.from;
  const userReplaced = user.replace("@c.us", "");
  
  if(message.isStatus || isGroup) {
    // console.log('group: ' + body); 
    return;
  } else {
    console.log(userReplaced);
    console.log('===============');
    console.log('USUÁRIO ' + user);
    console.log('MENSAGEM: ' + body);
    console.log('===============');
  }
  
  
  let getResponseData;
  
  const getUrl = `${baseUrl}/${userReplaced}`;
  console.log(getUrl);

  axios.get(getUrl)
    .then((response) => {
      getResponseData = response.data.status;
      console.log(getResponseData);
    })
    .catch((error) => console.log('erro')); 

  
  if (getResponseData === 'NULL') {
    return;
  } else if(getResponseData === 'ASK_NAME') {
    axios.post(baseUrl, {
      username: userReplaced,
      body: body
    })
    .then((response) => {
      console.log(response.data.status);
      client.sendMessage(user, messages.start);
      client.sendMessage(user, messages.askData);
      client.sendMessage(user, messages.askName);
      return;
    })
    .catch((error) => console.log('error'));
  } else if(getResponseData === 'ASK_CPF' || getResponseData === 'ASK_CPF' || getResponseData === 'ASK_EMAIL' || getResponseData === 'ASK_VOTE'
    || getResponseData === 'DONE') {
      axios.put(baseUrl, {
        username: userReplaced,
        body: body
      })
      .then( (response) => {
        console.log(response.data.status);
        if (data === 'ASK_CPF') {
          client.sendMessage(user, messages.askCpf);
          return;
        } else if (data === 'ASK_EMAIL') {
          client.sendMessage(user, messages.askEmail);
          return;
        } else if (data === 'ASK_VOTE') {
          client.sendMessage(user, messages.askVote);
          return;
        } else if (data === 'DONE') {
          client.sendMessage(user, messages.done);
          return;
        }
        }
      )
      .catch((error) => console.log('error'));
    }
 
}); 

client.initialize();
