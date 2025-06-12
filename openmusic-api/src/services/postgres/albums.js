import { nanoid } from 'nanoid';
import { Pool } from 'pg';

import { InvariantError, NotFoundError } from '../../utils/index.js';

export default class AlbumsService {
  constructor() {
    this.pool = new Pool();
  }

  async getAlbums({ name, year } = {}) {
    let query = 'SELECT * FROM albums';
    const values = [];
    const conditions = [];

    if (name) {
      values.push(`%${name}%`);
      conditions.push(`name ILIKE $${values.length}`);
    }
    if (year) {
      values.push(year);
      conditions.push(`year = $${values.length}`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }
    query += ' ORDER BY created_at DESC';

    const results = await this.pool.query(query, values);
    if (!results.rows.length) {
      return [];
    }
    return results.rows.map((row) => ({
      id: row.id,
      name: row.name,
      year: row.year,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  async getAlbum(albumId) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [albumId],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album not found');
    }

    const album = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      year: row.year,
      coverUrl: row.cover_url,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }))[0];

    const songsQuery = {
      text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
      values: [albumId],
    };

    const songsResult = await this.pool.query(songsQuery);

    album.songs = songsResult.rows.map((song) => ({
      id: song.id,
      title: song.title,
      performer: song.performer,
    }));

    return album;
  }

  async postAlbum({ name, year }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, name, year, createdAt, updatedAt],
    };

    const result = await this.pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Failed to create album. Please try again.');
    }

    return result.rows[0].id;
  }

  async putAlbum(albumId, { name, year }) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
      values: [name, year, updatedAt, albumId],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(
        'The album you are trying to update was not found.'
      );
    }

    return result.rows[0].id;
  }

  async deleteAlbum(albumId) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [albumId],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(
        'The album you are trying to delete was not found.'
      );
    }

    return result.rows[0].id;
  }

  async uploadAlbumCover(albumId, coverUrl) {
    const query = {
      text: 'UPDATE albums SET cover_url = $1 WHERE id = $2 RETURNING id',
      values: [coverUrl, albumId],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(
        'The album you are trying to update with cover image was not found.'
      );
    }
  }

  async getAlbumLikes(albumId) {
    const query = {
      text: 'SELECT users.id, users.username FROM user_album_likes JOIN users ON user_album_likes.user_id = users.id WHERE user_album_likes.album_id = $1',
      values: [albumId],
    };

    const result = await this.pool.query(query);

    return result.rows.map((row) => ({
      id: row.id,
      username: row.username,
    }));
  }

  async postAlbumLike(userId, albumId) {
    const albumCheck = await this.pool.query(
      'SELECT id FROM albums WHERE id = $1',
      [albumId]
    );

    if (!albumCheck.rows.length) {
      throw new NotFoundError('Album not found');
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

    return result.rows[0].id;
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

    return result.rows[0].id;
  }
}
