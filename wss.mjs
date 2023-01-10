import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8081 });

wss.on('connection', function connection(ws) {
  ws.on('message', async function message(data) {
    if (data.toString().startsWith('https://')) {
      let totoal = 0;
      let count = 0;
      // const response = await fetch('https://zizi.press:8888/20m');
      const response = await fetch(data.toString());

      const body = response.body;
      for await (let chunk of body) {
        count++;
        console.log(
          `${(totoal += chunk.length)}, count: ${count.toString()}, ${
            chunk.length
          },  bufferedAmount ${ws.bufferedAmount} `
        );

        ws.send(count.toString());
        ws.send(chunk);
      }
      ws.send('done');
    } else {
      ws.send('not 20m');
    }
  });

  ws.send('something');
});
