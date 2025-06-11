import UsersHandler from '../api/users.js';
import usersRoute from '../routes/users.js';

const usersPlugin = {
  name: 'users',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const usersHandler = new UsersHandler(service, validator);
    server.route(usersRoute(usersHandler));
  },
};

export default usersPlugin;
