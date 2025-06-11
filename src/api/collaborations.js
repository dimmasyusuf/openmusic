import autoBind from 'auto-bind';

export default class CollaborationsHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;

    autoBind(this);
  }

  async postCollaborationHandler(request, h) {
    this.validator.validateCollaborationPayload(request.payload);
    const { playlistId, userId } = request.payload;
    const owner = request.auth.credentials.id;

    const collaborationId = await this.service.postCollaboration(
      playlistId,
      userId,
      owner
    );

    const response = h.response({
      status: 'success',
      message: 'Collaboration created successfully',
      data: {
        collaborationId,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCollaborationHandler(request) {
    this.validator.validateCollaborationPayload(request.payload);
    const { playlistId, userId } = request.payload;
    const owner = request.auth.credentials.id;
    await this.service.deleteCollaboration(playlistId, userId, owner);

    return {
      status: 'success',
      message: 'Collaboration deleted successfully',
      data: {
        playlistId,
        userId,
      },
    };
  }
}
