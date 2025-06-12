import Jwt from '@hapi/jwt';

import config from './config.js';
import { InvariantError } from './index.js';

const TokenManager = {
  generateAccessToken: (payload) =>
    Jwt.token.generate(payload, config.jwt.accessTokenKey),
  generateRefreshToken: (payload) =>
    Jwt.token.generate(payload, config.jwt.refreshTokenKey),
  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = Jwt.token.decode(refreshToken);
      Jwt.token.verifySignature(artifacts, config.jwt.refreshTokenKey);
      const { payload } = artifacts.decoded;
      return payload;
    } catch (error) {
      throw new InvariantError('Refresh token is not valid');
    }
  },
};

export default TokenManager;
