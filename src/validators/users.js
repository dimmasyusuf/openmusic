import Joi from 'joi';

import { InvariantError } from '../utils/index.js';

const UserPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  fullname: Joi.string().required(),
});

const UserQuerySchema = Joi.object({
  username: Joi.string().optional().allow(''),
  fullname: Joi.string().optional().allow(''),
});

const UsersValidator = {
  validateUserPayload: (payload) => {
    const validationResult = UserPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateUserQuery: (query) => {
    const validationResult = UserQuerySchema.validate(query);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default UsersValidator;
