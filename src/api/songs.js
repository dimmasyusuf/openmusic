import autoBind from 'auto-bind';

export default class SongsHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;

    autoBind(this);
  }

  async getSongsHandler(request) {
    this.validator.validateSongQuery(request.query);
    const {
      title, year, performer, genre, albumId,
    } = request.query;

    if (title || year || performer || genre || albumId) {
      const songs = await this.service.getSongs({
        title,
        year,
        performer,
        genre,
        albumId,
      });

      return {
        status: 'success',
        message: 'Songs retrieved successfully',
        data: {
          songs,
        },
      };
    }

    const songs = await this.service.getSongs();

    return {
      status: 'success',
      message: 'Songs retrieved successfully',
      data: {
        songs,
      },
    };
  }

  async getSongHandler(request) {
    const { id } = request.params;
    const song = await this.service.getSong(id);

    return {
      status: 'success',
      message: 'Song retrieved successfully',
      data: {
        song,
      },
    };
  }

  async postSongHandler(request, h) {
    this.validator.validateSongPayload(request.payload);
    const {
      title, year, genre, performer, duration, albumId,
    } = request.payload;

    const songId = await this.service.postSong({
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    });

    const response = h.response({
      status: 'success',
      message: 'Song created successfully',
      data: {
        songId,
      },
    });
    response.code(201);
    return response;
  }

  async putSongHandler(request) {
    this.validator.validateSongPayload(request.payload);
    const { id } = request.params;
    const {
      title, year, genre, performer, duration, albumId,
    } = request.payload;

    await this.service.putSong(id, {
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    });

    return {
      status: 'success',
      message: 'Song updated successfully',
      data: {
        id,
      },
    };
  }

  async deleteSongHandler(request) {
    const { id } = request.params;

    await this.service.deleteSong(id);

    return {
      status: 'success',
      message: 'Song deleted successfully',
      data: {
        id,
      },
    };
  }
}
