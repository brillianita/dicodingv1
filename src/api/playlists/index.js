const PlaylistHandler = require('./handler');
const playlistRoutes = require('./routes');

module.exports = {
  name: 'playlistApp',
  version: '1.0.0',
  register: async (server, { playlistService, songService, validator }) => {
    const playlistHandler = new PlaylistHandler(playlistService, songService, validator);
    server.route(playlistRoutes(playlistHandler));
  },
};
