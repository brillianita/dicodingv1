const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const { mapDBToModel } = require('../utils');
const NotFoundError = require('../exceptions/NotFoundError');

class AlbumService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = nanoid(16);

    const query = {
      text: 'INSERT INTO album VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };

    const { rows } = await this._pool.query(query);

    if (!rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return rows[0].id;
  }

  async getAlbum() {
    const { rows } = await this._pool.query('SELECT * FROM album');
    return rows;
  }

  async getAlbumById(id) {
    const queryAlbum = {
      text: 'SELECT id, name, year, cover_url AS coverUrl FROM album WHERE id = $1',
      values: [id],
    };
    const resultAlbum = await this._pool.query(queryAlbum);

    if (!resultAlbum.rowCount) {
      throw new NotFoundError('Album tidak ditemukan');
    }
    const querySong = {
      text: 'SELECT id, title, performer FROM song WHERE album_id = $1',
      values: [id],
    };
    const resultSong = await this._pool.query(querySong);
    const album = resultAlbum.rows[0];
    album.songs = resultSong.rows.map(mapDBToModel);

    return album;
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE album SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM album WHERE id = $1 RETURNING id',
      values: [id],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }

  async editCoverUrl(id, url) {
    const query = {
      text: 'UPDATE album SET cover_url = $1 WHERE id = $2 RETURNING id',
      values: [url, id],
    };
    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError('Gagal mengunggah cover album. Id tidak ditemukan');
    }
  }

  async addLikeAlbum(albumId, userId) {
    const id = `like - ${nanoid(16)}`;

    const qLikeCheck = {
      text: 'SELECT album_id, user_id FROM user_album_likes WHERE album_id = $1 AND user_id = $2',
      values: [albumId, userId],
    };
    const rLikeCheck = await this._pool.query(qLikeCheck);
    if (rLikeCheck.rows[0]) {
      throw new InvariantError('Gagal menyukai album.');
    }
    const qAddLike = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    };

    const rAddLike = await this._pool.query(qAddLike);

    if (!rAddLike.rows[0].id) {
      throw new InvariantError('Gagal menyukai album');
    }

    return rAddLike.rows[0].id;
  }

  async deleteLikeAlbum(albumId, userId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE album_id = $1 AND user_id = $2 RETURNING id',
      values: [albumId, userId],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }

  async getLikeAlbum(albumId) {
    const query = {
      text: 'SELECT album_id FROM user_album_likes WHERE album_id = $1',
      values: [albumId],
    };

    const { rowCount } = await this._pool.query(query);
    return rowCount;
  }
}

module.exports = AlbumService;
