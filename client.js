
const WebSocket = require( 'ws')

const ws = new WebSocket('ws://127.0.0.1:4000', {
  perMessageDeflate: false
});

ws.on('open', function open() {
    ws.send('something');
});

ws.on('message', function message(data) {
    console.log('received: %s', data.toString('utf8'));
});