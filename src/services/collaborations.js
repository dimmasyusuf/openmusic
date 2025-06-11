import { Pool } from 'pg';
import { nanoid } from 'nanoid';

import {
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  InvariantError,
} from '../utils/index.js';

export default class CollaborationsService {
  constructor() {
    this.pool = new Pool();
  }

  async verifyOwner(playlistId, owner) {
    if (!owner) {
      throw new AuthenticationError('Owner is required to perform this action');
    }
    const playlistResult = await this.pool.query(
      'SELECT owner FROM playlists WHERE id = $1',
      [playlistId]
    );
    if (!playlistResult.rows.length) {
      throw new NotFoundError('Playlist not found');
    }
    if (playlistResult.rows[0].owner !== owner) {
      throw new AuthorizationError(
        'You are not authorized to perform this action for this playlist'
      );
    }
  }

  async postCollaboration(playlistId, userId, owner) {
    await this.verifyOwner(playlistId, owner);

    const isUserExists = await this.pool.query(
      'SELECT id FROM users WHERE id = $1',
      [userId]
    );
    if (!isUserExists.rows.length) {
      throw new NotFoundError('User not found');
    }

    const id = `collab-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO collaborations (id, playlist_id, user_id) VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, userId],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Failed to add collaborator. Please try again.');
    }

    return result.rows[0].id;
  }

  async deleteCollaboration(playlistId, userId, owner) {
    await this.verifyOwner(playlistId, owner);

    const isCollaborationExists = await this.pool.query(
      'SELECT 1 FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      [playlistId, userId]
    );

    if (!isCollaborationExists.rows.length) {
      throw new NotFoundError(
        'The collaboration you are trying to remove was not found.'
      );
    }

    const query = {
      text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };

    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new Error('Collaboration could not be deleted');
    }
  }
}
