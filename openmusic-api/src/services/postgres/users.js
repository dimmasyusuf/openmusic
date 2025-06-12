import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import { Pool } from 'pg';

import {
  AuthenticationError,
  InvariantError,
  NotFoundError,
} from '../../utils/index.js';

export default class UsersService {
  constructor() {
    this.pool = new Pool();
  }

  async postUser({ username, password, fullname }) {
    await this.verifyUsername(username);

    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashedPassword, fullname],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Failed to create user. Please try again.');
    }

    return result.rows[0].id;
  }

  async verifyUsername(username) {
    const query = {
      text: 'SELECT * FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this.pool.query(query);

    if (result.rows.length > 0) {
      throw new InvariantError('Error creating user, username already exists');
    }
  }

  async verifyUserCredential(username, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new AuthenticationError(
        'Credentials that you provided are incorrect'
      );
    }

    const { id, password: hashedPassword } = result.rows[0];

    const isPasswordValid = await bcrypt.compare(password, hashedPassword);

    if (!isPasswordValid) {
      throw new AuthenticationError(
        'Credentials that you provided are incorrect'
      );
    }

    return id;
  }

  async getUserById(userId) {
    const query = {
      text: 'SELECT id, username, fullname FROM users WHERE id = $1',
      values: [userId],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('The user you are looking for was not found.');
    }

    return result.rows[0];
  }

  async editUserById(userId, { username, password, fullname }) {
    const query = {
      text: 'UPDATE users SET username = $1, password = $2, fullname = $3 WHERE id = $4 RETURNING id',
      values: [username, password, fullname, userId],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(
        'The user you are trying to update was not found.'
      );
    }

    return result.rows[0].id;
  }

  async deleteUserById(userId) {
    const query = {
      text: 'DELETE FROM users WHERE id = $1 RETURNING id',
      values: [userId],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(
        'The user you are trying to delete was not found.'
      );
    }

    return result.rows[0].id;
  }
}
