import autoBind from 'auto-bind';

export default class AlbumsHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;

    autoBind(this);
  }

  async getAlbumsHandler(request) {
    this.validator.validateAlbumQuery(request.query);
    const { name, year } = request.query;

    if (name || year) {
      const albums = await this.service.getAlbums({ name, year });
      return {
        status: 'success',
        message: 'Albums retrieved successfully',
        data: {
          albums,
        },
      };
    }

    const albums = await this.service.getAlbums();

    return {
      status: 'success',
      message: 'Albums retrieved successfully',
      data: {
        albums,
      },
    };
  }

  async getAlbumHandler(request) {
    const { id: albumId } = request.params;
    const album = await this.service.getAlbum(albumId);

    return {
      status: 'success',
      message: 'Album retrieved successfully',
      data: {
        album,
      },
    };
  }

  async postAlbumHandler(request, h) {
    this.validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;

    const albumId = await this.service.postAlbum({ name, year });

    const response = h.response({
      status: 'success',
      message: 'Album created successfully',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async putAlbumHandler(request) {
    this.validator.validateAlbumPayload(request.payload);
    const { id: albumId } = request.params;
    const { name, year } = request.payload;

    await this.service.putAlbum(albumId, { name, year });

    return {
      status: 'success',
      message: 'Album updated successfully',
      data: {
        albumId,
      },
    };
  }

  async deleteAlbumHandler(request) {
    const { id: albumId } = request.params;

    await this.service.deleteAlbum(albumId);

    return {
      status: 'success',
      message: 'Album deleted successfully',
      data: {
        albumId,
      },
    };
  }
}
