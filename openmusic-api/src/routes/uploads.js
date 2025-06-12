import path from 'path';
import { fileURLToPath } from 'url';

const fileName = fileURLToPath(import.meta.url);
const dirname = path.dirname(fileName);

const uploadsRoute = (handler) => [
  {
    method: 'POST',
    path: '/albums/{id}/covers',
    handler: (request, h) => handler.uploadAlbumCoverHandler(request, h),
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 512000, // 500 KB
      },
    },
  },
  {
    method: 'GET',
    path: '/uploads/file/images/{param*}',
    handler: {
      directory: {
        path: path.resolve(dirname, '../uploads/file/images'),
      },
    },
  },
];

export default uploadsRoute;
