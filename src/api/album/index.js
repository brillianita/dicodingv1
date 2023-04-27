const AlbumHandler = require('./handler');
const albumRoutes = require('./routes');

module.exports = {
  name: 'albumApp',
  version: '1.0.0',
  register: async (server, { albumService, storageService, validator }) => {
    const albumHandler = new AlbumHandler(albumService, storageService, validator);
    server.route(albumRoutes(albumHandler));
  },
};
