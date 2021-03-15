const dotenv = require('dotenv');
const amqp = require('amqplib/callback_api');

dotenv.config();

function listen(callback){
    amqp.connect(process.env.RABBITMQ_URI, (err, connection) => {
        if (err) return callback(err);
        connection.createChannel((err, channel) => {
            if (err) return callback(err);
            channel.assertQueue(process.env.RABBITMQ_QUEUE, { durable: false });
            channel.consume(process.env.RABBITMQ_QUEUE, (msg) => callback(null, msg.content.toString()), { noAck: true });
        });
    });
}


console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", process.env.RABBITMQ_QUEUE);
listen((err, msg) => {
    if(err){
        console.error(err);
        process.exit();
    }else{
        console.log(` [x] Received ${msg}`);

    }
});