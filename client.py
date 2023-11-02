import socketio

# 创建 Socket.IO 客户端
sio = socketio.Client()

# 连接到服务器
sio.connect('http://localhost:3000')

# 当连接建立时的事件处理函数
@sio.on('connect')
def on_connect():
    print('已连接到服务器')

# 当收到广播消息时的事件处理函数
@sio.on('broadcast_message')
def on_broadcast_message(data):
    print(f'收到广播消息：{data}')

# 当收到特定消息时的事件处理函数
@sio.on('consumed_message')
def on_consumed_message(data):
    print(f'消费特定消息：{data}')

# 发送消息到服务端
def send_message(message):
    sio.emit('message', message)

# 发送特定消息到服务端
def send_special_message(message):
    sio.emit('special_message', message)

# 查询特定消息
def query_special_messages():
    sio.emit('query_special_messages')

# 消费特定消息
def consume_special_messages():
    sio.emit('consume_special_messages')

if __name__ == '__main__':
    while True:
        # 从用户输入获取消息
        message = input('请输入消息: ')
        
        if message == 'quit':
            break

        # 发送消息到服务端
        send_message(message)
        
        # 发送特定消息到服务端
        send_special_message(message)

        # 查询特定消息
        # query_special_messages()

        # 消费特定消息
        consume_special_messages()
        consume_special_messages()

# 断开连接
sio.disconnect()
