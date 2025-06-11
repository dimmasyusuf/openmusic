import AuthenticationsHandler from '../api/authentications.js';
import authenticationsRoute from '../routes/authentications.js';

const authenticationsPlugin = {
  name: 'authentications',
  version: '1.0.0',
  register: async (server, { authentications, users, token, validator }) => {
    const authenticationsHandler = new AuthenticationsHandler(
      authentications,
      users,
      token,
      validator
    );
    server.route(authenticationsRoute(authenticationsHandler));
  },
};

export default authenticationsPlugin;
