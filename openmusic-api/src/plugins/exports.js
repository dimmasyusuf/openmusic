import ExportsHandler from '../api/exports.js';
import exportsRoute from '../routes/exports.js';

const exportsPlugin = {
  name: 'exports',
  version: '1.0.0',
  register: async (server, { producer, service, validator }) => {
    const exportsHandler = new ExportsHandler(producer, service, validator);
    server.route(exportsRoute(exportsHandler));
  },
};

export default exportsPlugin;
