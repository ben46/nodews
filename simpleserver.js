const { WebSocketServer,WebSocket } = require("ws")

const wss = new WebSocketServer({ port: 4000 });
console.log('start server at 4000');

wss.on('connection', function connection(ws) {
    console.log("one client connected!")
    ws.on('message', function message(data, isBinary) {

        var _t1 = (new Date()).getTime();
        console.log(_t1);
        console.log(data.toString('utf8'))

        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data, { binary: isBinary });
            }
        });
    });
});