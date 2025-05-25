import { nanoid } from 'nanoid';
import { Pool } from 'pg';

import { InvariantError, NotFoundError } from '../utils/index.js';

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

  async getAlbum(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album not found');
    }

    const album = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      year: row.year,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }))[0];

    const songsQuery = {
      text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
      values: [id],
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
      throw new InvariantError('Album failed to be created');
    }

    return result.rows[0].id;
  }

  async putAlbum(id, { name, year }) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
      values: [name, year, updatedAt, id],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Error updating album. Id not found');
    }

    return result.rows[0].id;
  }

  async deleteAlbum(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album failed to be deleted. Id not found');
    }

    return result.rows[0].id;
  }
}
