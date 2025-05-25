import Joi from 'joi';

import { InvariantError } from '../utils/index.js';

const AlbumPayloadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().integer().required(),
});

const AlbumQuerySchema = Joi.object({
  name: Joi.string().optional().allow(''),
  year: Joi.number().integer().optional().allow(null),
});

const AlbumsValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = AlbumPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateAlbumQuery: (query) => {
    const validationResult = AlbumQuerySchema.validate(query);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default AlbumsValidator;
