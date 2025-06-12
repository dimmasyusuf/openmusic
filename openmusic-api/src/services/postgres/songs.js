import { nanoid } from 'nanoid';
import { Pool } from 'pg';

import { InvariantError, NotFoundError } from '../../utils/index.js';

export default class SongsService {
  constructor() {
    this.pool = new Pool();
  }

  async getSongs({ title, year, performer, genre, albumId } = {}) {
    let query = 'SELECT * FROM songs';
    const values = [];
    const conditions = [];

    if (title) {
      values.push(`%${title}%`);
      conditions.push(`title ILIKE $${values.length}`);
    }
    if (year) {
      values.push(year);
      conditions.push(`year = $${values.length}`);
    }
    if (performer) {
      values.push(`%${performer}%`);
      conditions.push(`performer ILIKE $${values.length}`);
    }
    if (genre) {
      values.push(`%${genre}%`);
      conditions.push(`genre ILIKE $${values.length}`);
    }
    if (albumId) {
      values.push(albumId);
      conditions.push(`album_id = $${values.length}`);
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
      title: row.title,
      performer: row.performer,
    }));
  }

  async getSong(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('The song you are looking for was not found.');
    }

    return result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      year: row.year,
      genre: row.genre,
      performer: row.performer,
      duration: row.duration,
      albumId: row.album_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }))[0];
  }

  async postSong({ title, year, genre, performer, duration, albumId }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
      values: [
        id,
        title,
        year,
        genre,
        performer,
        duration,
        albumId,
        createdAt,
        updatedAt,
      ],
    };

    const result = await this.pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Failed to create song. Please try again.');
    }

    return result.rows[0].id;
  }

  async putSong(id, { title, year, genre, performer, duration, albumId }) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6, updated_at = $7 WHERE id = $8 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, updatedAt, id],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(
        'The song you are trying to update was not found.'
      );
    }

    return result.rows[0].id;
  }

  async deleteSong(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(
        'The song you are trying to delete was not found.'
      );
    }

    return result.rows[0].id;
  }
}
