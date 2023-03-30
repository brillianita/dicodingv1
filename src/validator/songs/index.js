const { SongPayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const SongsPayloadSchema = {
  validateSongPayload: (payload) => {
    const songValidationResult = SongPayloadSchema.validate(payload);

    if (songValidationResult.error) {
      throw new InvariantError(songValidationResult.error.message);
    }
  },
};

module.exports = SongsPayloadSchema;
