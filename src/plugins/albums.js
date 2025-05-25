import AlbumsHandler from '../api/albums.js';
import albumRoutes from '../routes/albums.js';

const albumsPlugin = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const albumsHandler = new AlbumsHandler(service, validator);
    server.route(albumRoutes(albumsHandler));
  },
};

export default albumsPlugin;
