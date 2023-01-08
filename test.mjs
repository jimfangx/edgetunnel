import { ReadableStream, TransformStream } from 'stream/web';

try {
  // const { readable, writable } = new TransformStream();

  // const defaultWriter = writable.getWriter();

  // defaultWriter.write('1111');
  let i = 0;
  const readableStream = new ReadableStream({
    start(control) {
      const timers = setInterval(() => {
        control.enqueue(i++);

        if (i === 7) {
          setTimeout(() => {
            control.close();
          }, 100);

          // clearInterval(timers);
          // console.log('----readableStream --locked---', readableStream.locked);
        }
      }, 100);
    },
    pull(control) {
      // control.enqueue('11');
      // undefined.length;
      // control.close();
      //   control.error('error');
      //   undefined.length;
    },
    cancel(reason) {
      console.log('----readableStream cancel-----', reason);
      console.log('----readableStream --locked---', readableStream.locked);
      // console.log(
      //   '----readableStream --locked---',
      //   readableStream.getReader().closed
      // );
    },
  });

  setTimeout(() => {
    // readableStream.cancel('xxxxxxxxxxxxxxx');
    // defaultWriter.close();
    // console.log('cancel');
    // setTimeout(() => {
    //   readable.console.log('locked', readable.locked);
    // }, 1000);
  }, 1000);

  await readableStream.pipeTo(
    new WritableStream({
      write(chunk, controller) {
        if (i === 7) {
          controller.error('WritableStream has error when 7');
        }
        console.log(chunk);
      },
      close() {
        console.log('close------WritableStream');
      },
    })
  );

  console.log('end--------');

  //   for await (const iterator of readableStream) {
  //     console.log(iterator);
  //   }
} catch (error) {
  console.log('-catch--end---', error);
}
