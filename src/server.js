import Hapi from '@hapi/hapi';
import 'dotenv/config.js';

import albumsPlugin from './plugins/albums.js';
import songsPlugin from './plugins/songs.js';

import AlbumsService from './services/albums.js';
import SongsService from './services/songs.js';

import { ClientError } from './utils/index.js';

import AlbumsValidator from './validators/albums.js';
import SongsValidator from './validators/songs.js';

const init = async () => {
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: albumsPlugin,
      options: {
        service: new AlbumsService(),
        validator: AlbumsValidator,
      },
    },
    {
      plugin: songsPlugin,
      options: {
        service: new SongsService(),
        validator: SongsValidator,
      },
    },
  ]);

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
