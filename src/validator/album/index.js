const { AlbumPayloadSchema, CoverHeadersSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const AlbumsPayloadSchema = {
  validateAlbumPayload: (payload) => {
    const albumValidationResult = AlbumPayloadSchema.validate(payload);

    if (albumValidationResult.error) {
      throw new InvariantError(albumValidationResult.error.message);
    }
  },
  validateCoverPayload: (payload) => {
    const playlistSongValidationResult = CoverHeadersSchema.validate(payload);

    if (playlistSongValidationResult.error) {
      throw new InvariantError(playlistSongValidationResult.error.message);
    }
  },
};

module.exports = AlbumsPayloadSchema;
