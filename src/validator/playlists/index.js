const { PlaylistPayloadSchema, PlaylistSongPayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const PlaylistsPayloadSchema = {
  validatePlaylistPayload: (payload) => {
    const playlistValidationResult = PlaylistPayloadSchema.validate(payload);

    if (playlistValidationResult.error) {
      throw new InvariantError(playlistValidationResult.error.message);
    }
  },
  validatePlaylistSongPayload: (payload) => {
    const playlistSongValidationResult = PlaylistSongPayloadSchema.validate(payload);

    if (playlistSongValidationResult.error) {
      throw new InvariantError(playlistSongValidationResult.error.message);
    }
  },
};

module.exports = PlaylistsPayloadSchema;
