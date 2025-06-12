import path from 'path';
import { fileURLToPath } from 'url';

import albumsPlugin from './albums.js';
import authenticationsPlugin from './authentications.js';
import collaborationsPlugin from './collaborations.js';
import exportsPlugin from './exports.js';
import likesPlugin from './likes.js';
import playlistsPlugin from './playlists.js';
import songsPlugin from './songs.js';
import uploadsPlugin from './uploads.js';
import usersPlugin from './users.js';

import AlbumsService from '../services/postgres/albums.js';
import AuthenticationsService from '../services/postgres/authentications.js';
import CollaborationsService from '../services/postgres/collaborations.js';
import LikesService from '../services/postgres/likes.js';
import PlaylistsService from '../services/postgres/playlists.js';
import SongsService from '../services/postgres/songs.js';
import UsersService from '../services/postgres/users.js';
import ProducerService from '../services/rabbitmq/producer.js';
import CacheService from '../services/redis/index.js';
import StorageService from '../services/storage/index.js';

import TokenManager from '../utils/token.js';

import AlbumsValidator from '../validators/albums.js';
import AuthenticationsValidator from '../validators/authentications.js';
import CollaborationsValidator from '../validators/collaborations.js';
import ExportsValidator from '../validators/exports.js';
import PlaylistsValidator from '../validators/playlists.js';
import SongsValidator from '../validators/songs.js';
import UploadsValidator from '../validators/uploads.js';
import UsersValidator from '../validators/users.js';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const plugins = [
  {
    plugin: albumsPlugin,
    options: {
      service: new AlbumsService(),
      validator: AlbumsValidator,
      cache: CacheService,
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
    plugin: exportsPlugin,
    options: {
      producer: ProducerService,
      service: new PlaylistsService(),
      validator: ExportsValidator,
    },
  },
  {
    plugin: likesPlugin,
    options: {
      service: new LikesService(AlbumsService, new CacheService()),
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
    plugin: uploadsPlugin,
    options: {
      storage: new StorageService(
        path.resolve(dirname, '../uploads/file/images')
      ),
      service: new AlbumsService(),
      validator: UploadsValidator,
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
