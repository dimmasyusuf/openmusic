import autoBind from 'auto-bind';

import config from '../utils/config.js';

export default class UploadsHandler {
  constructor(storage, service, validator) {
    this.storage = storage;
    this.service = service;
    this.validator = validator;

    autoBind(this);
  }

  async uploadAlbumCoverHandler(request, h) {
    const { cover } = request.payload;
    const { id: albumId } = request.params;

    this.validator.validateUploadAlbumImageHeader(cover.hapi.headers);

    const fileName = await this.storage.writeFile(cover, cover.hapi);
    const fileUrl = `http://${config.app.host}:${config.app.port}/uploads/file/images/${fileName}`;

    await this.service.uploadAlbumCover(albumId, fileUrl);

    const response = h.response({
      status: 'success',
      message: 'Album cover uploaded successfully',
    });
    response.code(201);
    return response;
  }
}
