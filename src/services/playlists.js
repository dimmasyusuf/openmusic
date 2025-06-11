import { nanoid } from 'nanoid';
import { Pool } from 'pg';

import {
  AuthorizationError,
  InvariantError,
  NotFoundError,
} from '../utils/index.js';

export default class PlaylistsService {
  constructor() {
    this.pool = new Pool();
  }

  async verifyOwnerOrCollaborator(playlistId, userId) {
    const playlistResult = await this.pool.query(
      'SELECT owner FROM playlists WHERE id = $1',
      [playlistId]
    );
    if (!playlistResult.rows.length) {
      throw new AuthorizationError(
        'The playlist you are looking for does not exist.'
      );
    }
    const isOwner = playlistResult.rows[0].owner === userId;
    if (isOwner) return true;
    const isCollaborator = await this.pool.query(
      'SELECT 1 FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      [playlistId, userId]
    );
    if (!isCollaborator.rows.length) {
      throw new AuthorizationError(
        'You do not have permission to access this playlist.'
      );
    }
    return true;
  }

  async getPlaylists(userId) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username
             FROM playlists
             JOIN users ON playlists.owner = users.id
             LEFT JOIN collaborations ON playlists.id = collaborations.playlist_id
             WHERE playlists.owner = $1 OR collaborations.user_id = $1
             GROUP BY playlists.id, users.username`,
      values: [userId],
    };

    const results = await this.pool.query(query);

    if (!results.rows.length) {
      return [];
    }

    return results.rows.map((row) => ({
      id: row.id,
      name: row.name,
      username: row.username,
    }));
  }

  async getPlaylistSongs(id, owner) {
    const playlistExists = await this.pool.query(
      'SELECT id FROM playlists WHERE id = $1',
      [id]
    );

    if (!playlistExists.rows.length) {
      throw new NotFoundError(
        'The playlist you are looking for does not exist.'
      );
    }

    await this.verifyOwnerOrCollaborator(id, owner);
    const playlistQuery = {
      text: `SELECT playlists.id, playlists.name, users.username
             FROM playlists
             JOIN users ON playlists.owner = users.id
             WHERE playlists.id = $1`,
      values: [id],
    };
    const playlistResult = await this.pool.query(playlistQuery);
    const playlist = playlistResult.rows[0];

    const songsQuery = {
      text: `SELECT songs.id, songs.title, songs.performer
             FROM playlist_songs
             JOIN songs ON playlist_songs.song_id = songs.id
             WHERE playlist_songs.playlist_id = $1`,
      values: [id],
    };
    const songsResult = await this.pool.query(songsQuery);
    const songs = songsResult.rows.map((row) => ({
      id: row.id,
      title: row.title,
      performer: row.performer,
    }));

    return {
      id: playlist.id,
      name: playlist.name,
      username: playlist.username,
      songs,
    };
  }

  async getPlaylistActivities(playlistId, owner) {
    const playlistExists = await this.pool.query(
      'SELECT id FROM playlists WHERE id = $1',
      [playlistId]
    );

    if (!playlistExists.rows.length) {
      throw new NotFoundError(
        'The playlist you are looking for does not exist.'
      );
    }

    await this.verifyOwnerOrCollaborator(playlistId, owner);
    const query = {
      text: `SELECT users.username, songs.title, playlist_song_activities.action, playlist_song_activities.time
             FROM playlist_song_activities
             JOIN users ON playlist_song_activities.user_id = users.id
             JOIN songs ON playlist_song_activities.song_id = songs.id
             WHERE playlist_song_activities.playlist_id = $1
             ORDER BY playlist_song_activities.time ASC`,
      values: [playlistId],
    };

    const result = await this.pool.query(query);
    const activities = result.rows.map((row) => ({
      username: row.username,
      title: row.title,
      action: row.action,
      time: row.time.toISOString(),
    }));

    return activities;
  }

  async postPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists (id, name, owner) VALUES ($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Failed to create playlist. Please try again.');
    }

    return result.rows[0].id;
  }

  async postPlaylistSong(playlistId, songId, owner) {
    await this.verifyOwnerOrCollaborator(playlistId, owner);
    const songCheck = await this.pool.query(
      'SELECT id FROM songs WHERE id = $1',
      [songId]
    );
    if (!songCheck.rows.length) {
      throw new NotFoundError(
        'The song you are trying to add or remove was not found.'
      );
    }
    const id = `song-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlist_songs (id, playlist_id, song_id) VALUES ($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };
    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError(
        'Failed to add the song to the playlist. Please try again.'
      );
    }

    const activityId = `activity-${nanoid(16)}`;
    await this.pool.query(
      'INSERT INTO playlist_song_activities (id, playlist_id, song_id, user_id, action, time) VALUES ($1, $2, $3, $4, $5, $6)',
      [activityId, playlistId, songId, owner, 'add', new Date()]
    );

    return result.rows[0].id;
  }

  async deletePlaylist(id, owner) {
    const playlistResult = await this.pool.query(
      'SELECT owner FROM playlists WHERE id = $1',
      [id]
    );

    if (playlistResult.rows[0].owner !== owner) {
      throw new AuthorizationError(
        'Only the playlist owner can delete this playlist.'
      );
    }

    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(
        'The playlist you are looking for does not exist.'
      );
    }

    return result.rows[0].id;
  }

  async deletePlaylistSong(playlistId, songId, owner) {
    await this.verifyOwnerOrCollaborator(playlistId, owner);

    const songCheck = await this.pool.query(
      'SELECT id FROM songs WHERE id = $1',
      [songId]
    );

    if (!songCheck.rows.length) {
      throw new InvariantError(
        'The song you are trying to add or remove was not found.'
      );
    }

    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(
        'The song you are trying to remove is not in this playlist.'
      );
    }

    const activityId = `activity-${nanoid(16)}`;
    await this.pool.query(
      'INSERT INTO playlist_song_activities (id, playlist_id, song_id, user_id, action, time) VALUES ($1, $2, $3, $4, $5, $6)',
      [activityId, playlistId, songId, owner, 'delete', new Date()]
    );

    return result.rows[0].id;
  }
}
