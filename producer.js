const dotenv = require('dotenv');
const amqp = require('amqplib/callback_api');

dotenv.config();

function send(message, callback) {
    amqp.connect(process.env.RABBITMQ_URI, (err, connection) => {
        if (err) return callback(err);
        connection.createChannel((err, channel) => {
            if (err) return callback(err);
            channel.assertQueue(process.env.RABBITMQ_QUEUE, { durable: false });
            channel.sendToQueue(process.env.RABBITMQ_QUEUE, Buffer.from(message));
            setTimeout(callback);
        });
    });
}


let message = 'Prueba';

send(message, (err) => {
    if(err){
        console.error(err.message);
    }else{
        console.log(`[x] Sent ${message}`);
    }
    process.exit();
});