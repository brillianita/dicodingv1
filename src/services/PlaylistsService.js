const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const AuthorizationError = require('../exceptions/AuthorizationError');

class PlaylistService {
  constructor(collaborationService) {
    this._pool = new Pool();
    this._collaborationService = collaborationService;
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
      text: 'SELECT playlist.id, playlist.name, users.username FROM playlist LEFT JOIN collaborations ON collaborations.playlist_id = playlist.id INNER JOIN users ON playlist.owner = users.id WHERE playlist.owner = $1 OR collaborations.user_id = $1',
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

    const playlist = rows[0];

    if (playlist.owner !== owner) {
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
      try {
        await this._collaborationService.verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
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
    console.log('ini test');
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [id, songId],
    };
    const { rows } = await this._pool.query(query);
    console.log('ini dataa', rows);
    if (!rows.length) {
      throw new InvariantError('Lagu gagal dihapus. Id tidak ditemukan');
    }
  }

  async addActivityToPlaylist(playlistId, songId, owner, action) {
    const id = `playlist_activity-${nanoid(16)}`;
    const time = new Date();
    const query = {
      text: 'INSERT INTO playlist_activity VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, action, time, playlistId, owner, songId],
    };

    const { rows } = await this._pool.query(query);

    if (!rows[0].id) {
      throw new InvariantError('Aktivitas gagal ditambahkan');
    }

    return rows[0].id;
  }

  async getActivityInPlaylist(id) {
    const query = {
      text: 'SELECT users.username, song.title, playlist_activity.action, playlist_activity.time FROM playlist_activity INNER JOIN users ON playlist_activity.user_id = users.id INNER JOIN song ON playlist_activity.song_id = song.id WHERE playlist_activity.playlist_id = $1',
      values: [id],
    };

    const { rows } = await this._pool.query(query);
    console.log('ini', rows);

    if (!rows) {
      throw new NotFoundError('Aktivitas tidak ditemukan');
    }

    return rows;
  }
}

module.exports = PlaylistService;
