import autoBind from 'auto-bind';

export default class UsersHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;

    autoBind(this);
  }

  async postUserHandler(request, h) {
    this.validator.validateUserPayload(request.payload);
    const { username, password, fullname } = request.payload;

    const userId = await this.service.postUser({
      username,
      password,
      fullname,
    });

    const response = h.response({
      status: 'success',
      message: 'User created successfully',
      data: {
        userId,
      },
    });
    response.code(201);
    return response;
  }
}
