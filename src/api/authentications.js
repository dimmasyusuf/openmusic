import autoBind from 'auto-bind';

export default class AuthenticationsHandler {
  constructor(authentications, users, token, validator) {
    this.authentications = authentications;
    this.users = users;
    this.token = token;
    this.validator = validator;

    autoBind(this);
  }

  async verifyAccessTokenHandler(request) {
    this.validator.validateAuthenticationPayload(request.payload);
    const { accessToken } = request.payload;

    await this.authentications.verifyRefreshToken(accessToken);

    return {
      status: 'success',
      message: 'Access token is valid',
    };
  }

  async verifyAuthenticationHandler(request) {
    this.validator.validateAuthenticationPayload(request.payload);
    const { accessToken } = request.payload;

    await this.authentications.verifyRefreshToken(accessToken);

    return {
      status: 'success',
      message: 'Access token is valid',
    };
  }

  async postAuthenticationHandler(request, h) {
    this.validator.validateAuthenticationPayload(request.payload);

    const { username, password } = request.payload;
    const id = await this.users.verifyUserCredential(username, password);

    const accessToken = this.token.generateAccessToken({ id });
    const refreshToken = this.token.generateRefreshToken({ id });

    await this.authentications.createRefreshToken(refreshToken);

    const response = h.response({
      status: 'success',
      message: 'Authentication created successfully',
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);
    return response;
  }

  async putAuthenticationHandler(request, h) {
    this.validator.validateRefreshTokenPayload(request.payload);
    const { refreshToken } = request.payload;
    await this.authentications.verifyRefreshToken(refreshToken);
    const { id } = this.token.verifyRefreshToken(refreshToken);
    const accessToken = await this.token.generateAccessToken({ id });

    const response = h.response({
      status: 'success',
      message: 'Access Token refreshed successfully',
      data: {
        accessToken,
      },
    });
    response.code(200);
    return response;
  }

  async deleteAuthenticationHandler(request) {
    this.validator.validateRefreshTokenPayload(request.payload);
    const { refreshToken } = request.payload;
    await this.authentications.verifyRefreshToken(refreshToken);
    await this.authentications.deleteRefreshToken(refreshToken);

    return {
      status: 'success',
      message: 'Refresh Token deleted successfully',
    };
  }
}
