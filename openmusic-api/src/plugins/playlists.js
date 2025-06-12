import PlaylistsHandler from '../api/playlists.js';
import playlistsRoute from '../routes/playlists.js';

const playlistsPlugin = {
  name: 'playlists',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const playlistsHandler = new PlaylistsHandler(service, validator);
    server.route(playlistsRoute(playlistsHandler));
  },
};

export default playlistsPlugin;
