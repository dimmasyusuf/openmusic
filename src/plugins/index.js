import albumsPlugin from './albums.js';
import authenticationsPlugin from './authentications.js';
import collaborationsPlugin from './collaborations.js';
import playlistsPlugin from './playlists.js';
import songsPlugin from './songs.js';
import usersPlugin from './users.js';

import AlbumsService from '../services/albums.js';
import AuthenticationsService from '../services/authentications.js';
import CollaborationsService from '../services/collaborations.js';
import PlaylistsService from '../services/playlists.js';
import SongsService from '../services/songs.js';
import UsersService from '../services/users.js';

import TokenManager from '../utils/token.js';

import AlbumsValidator from '../validators/albums.js';
import AuthenticationsValidator from '../validators/authentications.js';
import CollaborationsValidator from '../validators/collaborations.js';
import PlaylistsValidator from '../validators/playlists.js';
import SongsValidator from '../validators/songs.js';
import UsersValidator from '../validators/users.js';

const plugins = [
  {
    plugin: albumsPlugin,
    options: {
      service: new AlbumsService(),
      validator: AlbumsValidator,
    },
  },
  {
    plugin: authenticationsPlugin,
    options: {
      authentications: new AuthenticationsService(),
      users: new UsersService(),
      token: TokenManager,
      validator: AuthenticationsValidator,
    },
  },
  {
    plugin: collaborationsPlugin,
    options: {
      service: new CollaborationsService(),
      validator: CollaborationsValidator,
    },
  },
  {
    plugin: playlistsPlugin,
    options: {
      service: new PlaylistsService(),
      validator: PlaylistsValidator,
    },
  },
  {
    plugin: songsPlugin,
    options: {
      service: new SongsService(),
      validator: SongsValidator,
    },
  },
  {
    plugin: usersPlugin,
    options: {
      service: new UsersService(),
      validator: UsersValidator,
    },
  },
];

export default plugins;
