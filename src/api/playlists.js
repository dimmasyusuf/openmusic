import autoBind from 'auto-bind';

export default class PlaylistsHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;

    autoBind(this);
  }

  async getPlaylistsHandler(request) {
    const owner = request.auth.credentials.id;
    const playlists = await this.service.getPlaylists(owner);

    return {
      status: 'success',
      message: 'Playlists retrieved successfully',
      data: {
        playlists,
      },
    };
  }

  async getPlaylistSongsHandler(request) {
    const { id } = request.params;
    const owner = request.auth.credentials.id;

    const playlist = await this.service.getPlaylistSongs(id, owner);

    return {
      status: 'success',
      message: 'Playlist Songs retrieved successfully',
      data: {
        playlist,
      },
    };
  }

  async getPlaylistActivitiesHandler(request) {
    const { id: playlistId } = request.params;
    const owner = request.auth.credentials.id;
    const activities = await this.service.getPlaylistActivities(
      playlistId,
      owner
    );

    return {
      status: 'success',
      message: 'Playlist Activities retrieved successfully',
      data: {
        playlistId,
        activities,
      },
    };
  }

  async postPlaylistHandler(request, h) {
    this.validator.validatePlaylistPayload(request.payload);
    const { name } = request.payload;
    const owner = request.auth.credentials.id;

    const playlistId = await this.service.postPlaylist({ name, owner });

    const response = h.response({
      status: 'success',
      message: 'Playlist created successfully',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async postPlaylistSongsHandler(request, h) {
    this.validator.validatePlaylistSongsPayload(request.payload);
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const owner = request.auth.credentials.id;

    await this.service.postPlaylistSong(playlistId, songId, owner);

    const response = h.response({
      status: 'success',
      message: 'Song added to playlist successfully',
      data: {
        playlistId,
        songId,
      },
    });
    response.code(201);
    return response;
  }

  async deletePlaylistHandler(request) {
    const { id: playlistId } = request.params;
    const owner = request.auth.credentials.id;
    await this.service.deletePlaylist(playlistId, owner);

    return {
      status: 'success',
      message: 'Playlist deleted successfully',
      data: {
        playlistId,
      },
    };
  }

  async deletePlaylistSongHandler(request) {
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const owner = request.auth.credentials.id;

    await this.service.deletePlaylistSong(playlistId, songId, owner);

    return {
      status: 'success',
      message: 'Song removed from playlist successfully',
      data: {
        playlistId,
        songId,
      },
    };
  }
}
