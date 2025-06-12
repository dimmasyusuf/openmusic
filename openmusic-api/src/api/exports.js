import autoBind from 'auto-bind';

export default class ExportsHandler {
  constructor(producer, service, validator) {
    this.producer = producer;
    this.service = service;
    this.validator = validator;

    autoBind(this);
  }

  async postExportPlaylistHandler(request, h) {
    this.validator.validateExportPlaylistPayload(request.payload);
    const { id: playlistId } = request.params;
    const { targetEmail } = request.payload;
    const userId = request.auth.credentials.id;

    await this.service.verifyPlaylistOwner(playlistId, userId);

    const message = {
      playlistId,
      targetEmail,
    };

    await this.producer.sendMessage('export:playlist', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Playlist exported is in progress',
    });
    response.code(201);
    return response;
  }
}
