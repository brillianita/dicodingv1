const { AlbumPayloadSchema } = require('./albumSchema');
const InvariantError = require('../../exceptions/InvariantError');

const AlbumsPayloadSchema = {
  validateAlbumPayload: (payload) => {
    const albumValidationResult = AlbumPayloadSchema.validate(payload);

    if (albumValidationResult.error) {
      throw new InvariantError(albumValidationResult.error.message);
    }
  },
};

module.exports = AlbumsPayloadSchema;
