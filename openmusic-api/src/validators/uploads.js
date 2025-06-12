import Joi from 'joi';

import { InvariantError } from '../utils/index.js';

const UploadAlbumImageHeaderSchema = Joi.object({
  'content-type': Joi.string()
    .valid(
      'image/apng',
      'image/avif',
      'image/gif',
      'image/jpeg',
      'image/png',
      'image/svg+xml',
      'image/webp'
    )
    .required(),
}).unknown();

const UploadsValidator = {
  validateUploadAlbumImageHeader: (headers) => {
    const validationResult = UploadAlbumImageHeaderSchema.validate(headers);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default UploadsValidator;
