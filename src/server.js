const Hapi = require('@hapi/hapi');
const albumApp = require('./api/album');
const songApp = require('./api/songs');
const AlbumService = require('./services/AlbumService');
const SongService = require('./services/SongService');
const AlbumsPayloadSchema = require('./validator/album');
const SongsPayloadSchema = require('./validator/songs');
const ClientError = require('./exceptions/ClientError');
require('dotenv').config();

const init = async () => {
  const albumService = new AlbumService();
  const songService = new SongService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
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
      return newResponse;
    }
    // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return h.continue || h;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
