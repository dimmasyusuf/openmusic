import LikesHandler from '../api/likes.js';
import likesRoute from '../routes/likes.js';

const likesPlugin = {
  name: 'likes',
  version: '1.0.0',
  register: async (server, { service }) => {
    const likesHandler = new LikesHandler(service);
    server.route(likesRoute(likesHandler));
  },
};

export default likesPlugin;
