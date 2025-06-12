import Hapi from '@hapi/hapi';
import Inert from '@hapi/inert';
import Jwt from '@hapi/jwt';
import 'dotenv/config.js';

import plugins from './plugins/index.js';

import config from './utils/config.js';
import { ClientError } from './utils/index.js';

const init = async () => {
  const server = Hapi.server({
    host: config.app.host,
    port: config.app.port,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([{ plugin: Jwt }, { plugin: Inert }]);

  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: config.jwt.accessTokenKey,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: config.jwt.accessTokenAge,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register(plugins);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      // ClientError
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      // HapiError
      if (!response.isServer) {
        return h.continue;
      }

      // ServerError
      const newResponse = h.response({
        status: 'error',
        message: 'Sorry, there was an internal server error',
      });
      newResponse.code(500);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();
