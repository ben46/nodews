const http = require('http');
const server = http.createServer();
const io = require('socket.io')(server);
// 引入 redis 模块
const redis = require('redis');

// 创建 redisClient 对象
const redisClient = redis.createClient({
    host: 'localhost', // Redis 服务器的地址
    port: 6379 // Redis 服务器的端口
});

// 配置 Redis 适配器
const socketioRedis = require('socket.io-redis');
io.adapter(socketioRedis({ host: 'localhost', port: 6379 }));

async function consumeMessage(socket) {
    redisClient.lpop('special_messages', async (err, message) => {
        if (err) {
            console.error('消费特定消息失败：', err);
            return;
        }

        // 所有消息都已经消费完毕
        if (message === null) return;

        // 发送消息给客户端
        socket.emit('consumed_message', message);

        // 递归调用以处理下一条消息
        await consumeMessage(socket);
    });
}

// 第一个频道：转发广播所有消息
io.on('connection', (socket) => {
    socket.on('message', (message) => {
        console.log(`on message${message}`);
        // 广播消息到所有连接的客户端
        io.emit('broadcast_message', message);
    });

    socket.on('special_message', (message) => {
        console.log(`special message ${message}`);
        // 存储消息到 Redis（这里存储到名为 "special_messages" 的 Redis 列表）
        redisClient.lpush('special_messages', message, (err, reply) => {
            if (err) console.error('保存特定消息到 Redis 失败：', err);
        });
    });

    // 查询 Redis 中的特定消息
    socket.on('query_special_messages', () => {
        redisClient.lrange('special_messages', 0, -1, (err, messages) => {
            console.log(`query_special_messages ${messages}`);
            if (err) console.error('查询特定消息失败：', err);
            else socket.emit('special_messages', messages);     // 将消息发送给客户端
        });
    });

    // 消费 Redis 中的特定消息
    socket.on('consume_special_messages', async () => {
        // 开始消费消息
        await consumeMessage(socket);
    });

});

server.listen(3000);
console.log("server started");
