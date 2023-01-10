import { serve, serveTls } from 'https://deno.land/std@0.170.0/http/server.ts';
import * as uuid from 'https://jspm.dev/uuid';
import * as lodash from 'https://jspm.dev/lodash-es';
import { serveClient } from './deno/client.ts';
import { processSocket } from '../../../libs/vless-js/src/lib/vless-js.ts';

const userID = Deno.env.get('UUID') || '';
let isVaildUser = uuid.validate(userID);
if (!isVaildUser) {
  console.log('not set valid UUID');
}

const handler = async (req: Request): Promise<Response> => {
  const upgrade = req.headers.get('upgrade') || '';
  if (upgrade.toLowerCase() != 'websocket') {
    return await serveClient(req, userID);
  }
  const { socket, response } = Deno.upgradeWebSocket(req, {});
  socket.addEventListener('open', () => {});

  socket.addEventListener('message', async (e) => {
    if (e.data === '20m') {
      let totoal = 0;
      const response = await fetch('https://zizi.press:8888/20m');
      const body = response.body;
      for await (let chunk of body!) {
        console.log((totoal += chunk.length));
        socket.send(chunk);
      }
      socket.send('done');
    } else {
      socket.send('not 20m');
    }
  });

  return response;
};

globalThis.addEventListener('beforeunload', (e) => {
  console.log('About to exit...');
});

globalThis.addEventListener('unload', (e) => {
  console.log('Exiting');
});
// serve(handler, { port: 8081, hostname: '0.0.0.0' });

serveTls(handler, {
  port: 8081,
  hostname: '0.0.0.0',
  certFile: '/root/config/cert/cert.pem',
  keyFile: '/root/config/cert/key.pem',
});
