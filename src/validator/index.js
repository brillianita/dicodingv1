const { AlbumPayloadSchema } = require('./albumSchema');
const { SongPayloadSchema } = require('./songSchema');
const InvariantError = require('../exceptions/InvariantError');

const MusicsPayloadSchema = {
  validateAlbumPayload: (payload) => {
    const albumValidationResult = AlbumPayloadSchema.validate(payload);

    if (albumValidationResult.error) {
      throw new InvariantError(albumValidationResult.error.message);
    }
  },
  validateSongPayload: (payload) => {
    const songValidationResult = SongPayloadSchema.validate(payload);

    if (songValidationResult.error) {
      throw new InvariantError(songValidationResult.error.message);
    }
  },
};

module.exports = MusicsPayloadSchema;
