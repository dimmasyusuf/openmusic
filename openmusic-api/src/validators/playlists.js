import Joi from 'joi';

import { InvariantError } from '../utils/index.js';

const PlaylistPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

const PlaylistSongsPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

const PlaylistsValidator = {
  validatePlaylistPayload: (payload) => {
    const validationResult = PlaylistPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePlaylistSongsPayload: (payload) => {
    const validationResult = PlaylistSongsPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default PlaylistsValidator;
