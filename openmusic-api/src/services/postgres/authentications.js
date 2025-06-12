import { Pool } from 'pg';

import { InvariantError } from '../../utils/index.js';

export default class AuthenticationsService {
  constructor() {
    this.pool = new Pool();
  }

  async createRefreshToken(token) {
    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [token],
    };

    await this.pool.query(query);
  }

  async verifyRefreshToken(token) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError(
        'Failed to authenticate. Please check your credentials and try again.'
      );
    }
  }

  async deleteRefreshToken(token) {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    };

    await this.pool.query(query);
  }
}
