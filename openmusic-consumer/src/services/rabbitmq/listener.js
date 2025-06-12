import autoBind from 'auto-bind';

export default class ListenerService {
  constructor(service, mail) {
    this.service = service;
    this.mail = mail;

    autoBind(this);
  }

  async listen(message) {
    try {
      const { playlistId, targetEmail } = JSON.parse(
        message.content.toString()
      );

      const playlist = await this.service.getPlaylistSongs(playlistId);

      const result = await this.mail.sendEmail(
        targetEmail,
        JSON.stringify({ playlist })
      );
      console.log(result);
    } catch (error) {
      console.error('Error processing message:', error);
      throw error;
    }
  }
}
