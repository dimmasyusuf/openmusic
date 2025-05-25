import SongsHandler from '../api/songs.js';
import songRoutes from '../routes/songs.js';

const songsPlugin = {
  name: 'songs',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const songsHandler = new SongsHandler(service, validator);
    server.route(songRoutes(songsHandler));
  },
};

export default songsPlugin;
