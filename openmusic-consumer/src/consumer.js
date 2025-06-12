import 'dotenv/config.js';
import amqp from 'amqplib';
import PlaylistsService from './services/postgres/playlists.js';
import MailService from './services/nodemailer/index.js';
import ListenerService from './services/rabbitmq/listener.js';
import config from './utils/config.js';

const init = async () => {
  const service = new PlaylistsService();
  const mail = new MailService();
  const listener = new ListenerService(service, mail);

  const connection = await amqp.connect(config.rabbitMq.server);
  const channel = await connection.createChannel();

  await channel.assertQueue('export:playlist', {
    durable: true,
  });

  channel.consume('export:playlist', listener.listen, { noAck: true });

  console.log('RabbitMQ consumer is running');
};

init();
