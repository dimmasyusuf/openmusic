import nodemailer from 'nodemailer';

import config from '../../utils/config.js';

export default class MailSender {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.password,
      },
    });
  }

  sendEmail(targetEmail, content) {
    const message = {
      from: 'no-reply@openmusic.com',
      to: targetEmail,
      subject: 'Exported Playlist',
      text: 'This is the exported playlist you requested.',
      attachments: [
        {
          filename: 'playlist.json',
          content,
        },
      ],
    };

    return this.transporter.sendMail(message);
  }
}
