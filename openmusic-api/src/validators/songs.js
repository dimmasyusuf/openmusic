import Joi from 'joi';

import { InvariantError } from '../utils/index.js';

const SongPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().integer().required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number().integer().optional().allow(null),
  albumId: Joi.string().optional().allow(null),
});

const SongQuerySchema = Joi.object({
  title: Joi.string().optional().allow(''),
  year: Joi.number().integer().optional().allow(null),
  performer: Joi.string().optional().allow(''),
  genre: Joi.string().optional().allow(''),
  albumId: Joi.string().optional().allow(''),
});

const SongsValidator = {
  validateSongPayload: (payload) => {
    const validationResult = SongPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateSongQuery: (query) => {
    const validationResult = SongQuerySchema.validate(query);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default SongsValidator;
