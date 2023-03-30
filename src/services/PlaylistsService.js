const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const AuthorizationError = require('../exceptions/AuthorizationError');

class PlaylistService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const { rows } = await this._pool.query(query);

    if (!rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: 'SELECT playlist.id, playlist.name, users.username FROM playlist INNER JOIN users ON playlist.owner = users.id WHERE playlist.owner = $1',
      values: [owner],
    };
    const { rows } = await this._pool.query(query);
    return rows;
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlist WHERE id = $1 RETURNING id',
      values: [id],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }

  async addSongToPlaylist(playlistId, { songId }) {
    const id = `playlistSong-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const { rows } = await this._pool.query(query);

    if (!rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan ke dalam playlist');
    }

    return rows[0].id;
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlist WHERE id = $1',
      values: [id],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const note = rows[0];

    if (note.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      // try {
      //   await this._collaborationService.verifyCollaborator(playlistId, userId);
      // } catch {
      //   throw error;
      // }
    }
  }

  async getSongInPlaylist(id) {
    const queryPlaylist = {
      text: 'SELECT playlist.id, playlist.name, users.username FROM playlist INNER JOIN users ON playlist.owner = users.id WHERE playlist.id = $1',
      values: [id],
    };
    const resultPlaylist = await this._pool.query(queryPlaylist);

    if (!resultPlaylist.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    const querySong = {
      text: 'SELECT song.id, song.title, song.performer FROM song INNER JOIN playlist_songs ON song.id = playlist_songs.song_id WHERE playlist_songs.playlist_id = $1',
      values: [id],
    };
    const resultSong = await this._pool.query(querySong);
    const playlist = resultPlaylist.rows[0];
    playlist.songs = resultSong.rows;

    return playlist;
  }

  async deleteSongInPlaylist(id, { songId }) {
    console.log(`id = ${id} songID=${songId}`);
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [id, songId],
    };

    const { rows } = await this._pool.query(query);
    console.log(`rows ${rows[0]}`);

    if (!rows.length) {
      throw new InvariantError('Lagu gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = PlaylistService;
