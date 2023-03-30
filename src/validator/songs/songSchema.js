const Joi = require('joi');

const SongPayloadSchema = Joi.object({
  year: Joi.number().required(),
  title: Joi.string().required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number().optional(),
  albumId: Joi.string().optional(),
});

module.exports = { SongPayloadSchema };
