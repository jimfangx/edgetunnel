import { serve, serveTls } from 'https://deno.land/std@0.170.0/http/server.ts';

const handler = async (req: Request): Promise<Response> => {
  const upgrade = req.headers.get('upgrade') || '';
  if (upgrade.toLowerCase() != 'websocket') {
    return new Response(`200 hello`, {
      status: 200,
      headers: {
        'content-type': 'text/html; charset=utf-8',
      },
    });
  }
  const { socket, response } = Deno.upgradeWebSocket(req, {});
  socket.addEventListener('open', () => {});

  socket.addEventListener('message', async (e) => {
    if ((e.data as string).startsWith('https://')) {
      let totoal = 0;
      let count = 0;
      // const response = await fetch('https://zizi.press:8888/20m');
      const remoteSocket = await Deno.connect({
        port: 443,
        hostname: e.data,
      });
      const response = await fetch(e.data);

      const body = response.body;
      for await (let chunk of body!) {
        count++;
        console.log(
          `${(totoal += chunk.length)}, count: ${count.toString()}, ${
            chunk.length
          }`
        );
        socket.send(count.toString());
        socket.send(chunk);
      }
      socket.send('done');
    } else {
      socket.send('not 20m');
    }
  });

  return response;
};

// serve(handler, { port: 8081, hostname: '0.0.0.0' });

serveTls(handler, {
  port: 8081,
  hostname: '0.0.0.0',
  certFile: '/root/config/cert/cert.pem',
  keyFile: '/root/config/cert/key.pem',
});
