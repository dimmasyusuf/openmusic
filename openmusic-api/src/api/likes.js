import autoBind from 'auto-bind';

export default class LikesHandler {
  constructor(service) {
    this.service = service;

    autoBind(this);
  }

  async getAlbumLikesHandler(request, h) {
    const { id: albumId } = request.params;
    const { likes, cache } = await this.service.getAlbumLikes(albumId);

    const response = h.response({
      status: 'success',
      data: {
        likes,
      },
    });

    if (cache === true) {
      response.header('X-Data-Source', 'cache');
    } else {
      response.header('X-Data-Source', undefined);
    }

    return response;
  }

  async postAlbumLikeHandler(request, h) {
    const { id: albumId } = request.params;
    const userId = request.auth.credentials.id;

    await this.service.postAlbumLike(userId, albumId);
    const response = h.response({
      status: 'success',
      message: 'Album liked successfully',
    });
    response.code(201);
    return response;
  }

  async deleteAlbumLikeHandler(request) {
    const { id: albumId } = request.params;
    const userId = request.auth.credentials.id;
    await this.service.deleteAlbumLike(userId, albumId);
    return {
      status: 'success',
      message: 'Album like removed successfully',
    };
  }
}
