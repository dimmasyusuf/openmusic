import { Pool } from 'pg';

export default class PlaylistsService {
  constructor() {
    this.pool = new Pool();
  }

  async getPlaylistSongs(playlistId) {
    const playlistQuery = {
      text: `SELECT playlists.id, playlists.name
             FROM playlists
             WHERE playlists.id = $1`,
      values: [playlistId],
    };
    const playlistResult = await this.pool.query(playlistQuery);
    const playlist = playlistResult.rows[0];

    const songsQuery = {
      text: `SELECT songs.id, songs.title, songs.performer
             FROM playlist_songs
             JOIN songs ON playlist_songs.song_id = songs.id
             WHERE playlist_songs.playlist_id = $1`,
      values: [playlistId],
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
      songs,
    };
  }
}
