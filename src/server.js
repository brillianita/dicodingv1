const Hapi = require('@hapi/hapi');
const ClientError = require('./exceptions/ClientError');

// users
const users = require('./api/users');
const UsersService = require('./services/UsersService');
const UsersValidator = require('./validator/users');

// Album
const albumApp = require('./api/album');
const AlbumService = require('./services/AlbumService');
const AlbumsPayloadSchema = require('./validator/album');

// Song
const songApp = require('./api/songs');
const SongService = require('./services/SongService');
const SongsPayloadSchema = require('./validator/songs');
require('dotenv').config();

const init = async () => {
  const albumService = new AlbumService();
  const songService = new SongService();
  const usersService = new UsersService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // server.route(routes);

  await server.register([
    {
      plugin: albumApp,
      options: {
        service: albumService,
        validator: AlbumsPayloadSchema,
      },
    },
    {
      plugin: songApp,
      options: {
        service: songService,
        validator: SongsPayloadSchema,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;
    if (response instanceof Error) {
      // penanganan client error secara internal.
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        console.error(response);
        return newResponse;
      }
      // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
      if (!response.isServer) {
        return h.continue;
      }
      // penanganan server error sesuai kebutuhan
      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
      console.error(response);
      return newResponse;
    }
    // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return h.continue || h;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
