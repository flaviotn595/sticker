import { create } from '@open-wa/wa-automate';

import msgHandler from './handler/message'

const serverOption = {
  headless: true,
  qrRefreshS: 20,
  qrTimeout: 0,
  authTimeout: 0,
  autoRefresh: true,
  killProcessOnBrowserClose: true,
  cacheEnabled: false,
  chromiumArgs: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--aggressive-cache-discard',
    '--disable-cache',
    '--disable-application-cache',
    '--disable-offline-load-stale-cache',
    '--disk-cache-size=0'
  ],
};

const opsys = process.platform;
if (opsys === 'win32' || opsys === 'win64') {
  serverOption.executablePath =
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
} else if (opsys === 'linux') {
  serverOption.browserRevision = '737027';
} else if (opsys === 'darwin') {
  serverOption.executablePath =
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
}

const startServer = async () => {
  create('Imperial', serverOption)
    .then((client) => {
      console.log('[CATSTICKER] Servidor Iniciado!');
      // Force it to keep the current session
      client.onStateChanged((state) => {
        console.log('[ESTADO]', state);
        if (state === 'CONFLICT') client.forceRefocus();
      });
      // listening on message
      client.onMessage((message) => {
        msgHandler(client, message);
      });

      client.onAddedToGroup(group => client.sendText(group.id, privateMessages.onJoinedGroup));

    })
    .catch((err) => {
      console.error(err);
    });
};



startServer();

