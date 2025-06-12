import UploadsHandler from '../api/uploads.js';
import uploadsRoute from '../routes/uploads.js';

const uploadsPlugin = {
  name: 'uploads',
  version: '1.0.0',
  register: async (server, { storage, service, validator }) => {
    const uploadsHandler = new UploadsHandler(storage, service, validator);
    server.route(uploadsRoute(uploadsHandler));
  },
};

export default uploadsPlugin;
