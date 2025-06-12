import CollaborationsHandler from '../api/collaborations.js';
import collaborationsRoute from '../routes/collaborations.js';

const collaborationsPlugin = {
  name: 'collaborations',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const collaborationsHandler = new CollaborationsHandler(service, validator);
    server.route(collaborationsRoute(collaborationsHandler));
  },
};

export default collaborationsPlugin;
