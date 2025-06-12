import { nanoid } from 'nanoid';
import { Pool } from 'pg';

import { InvariantError, NotFoundError } from '../../utils/index.js';

export default class LikesService {
  constructor(service, cache) {
    this.pool = new Pool();
    this.service = service;
    this.cache = cache;
  }

  async getAlbumLikes(albumId) {
    const albumCheck = await this.pool.query(
      'SELECT id FROM albums WHERE id = $1',
      [albumId]
    );

    if (!albumCheck.rows.length) {
      throw new NotFoundError('Album not found');
    }

    try {
      const result = await this.cache.get(`likes:${albumId}`);

      return {
        likes: JSON.parse(result),
        cache: true,
      };
    } catch (error) {
      const query = {
        text: 'SELECT COUNT(*) FROM user_album_likes WHERE album_id = $1',
        values: [albumId],
      };

      const result = await this.pool.query(query);
      const likes = parseInt(result.rows[0].count, 10);

      await this.cache.set(
        `likes:${albumId}`,
        JSON.stringify(likes),
        1800 // 30 Minutes
      );

      return {
        likes,
        cache: false,
      };
    }
  }

  async postAlbumLike(userId, albumId) {
    const albumCheck = await this.pool.query(
      'SELECT id FROM albums WHERE id = $1',
      [albumId]
    );

    if (!albumCheck.rows.length) {
      throw new NotFoundError('Album not found');
    }

    const likeCheck = await this.pool.query(
      'SELECT id FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      [userId, albumId]
    );
    if (likeCheck.rows.length > 0) {
      throw new InvariantError('You have already liked this album.');
    }

    const id = `like-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Failed to like the album. Please try again.');
    }

    await this.cache.delete(`likes:${albumId}`);
  }

  async deleteAlbumLike(userId, albumId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
      values: [userId, albumId],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(
        'The album like you are trying to remove was not found.'
      );
    }

    await this.cache.delete(`likes:${albumId}`);
  }
}
