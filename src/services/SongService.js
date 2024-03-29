const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const { mapDBToModel } = require('../utils');
const NotFoundError = require('../exceptions/NotFoundError');

class SongService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({
    title,
    year,
    genre,
    performer,
    duration,
    albumId,
  }) {
    const id = `song-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO song VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, genre, performer, duration, albumId],
    };

    const { rows } = await this._pool.query(query);

    if (!rows[0].id) {
      throw new InvariantError('Song gagal ditambahkan');
    }

    return rows[0].id;
  }

  async getSong({ title, performer }) {
    let result;
    if (title && performer) {
      result = await this._pool.query(`SELECT id, title, performer FROM song WHERE LOWER(title) LIKE '%${title.toLowerCase()}%' AND LOWER(performer) LIKE '%${performer.toLowerCase()}%'`);
    } else if (title && !performer) {
      result = await this._pool.query(`SELECT id, title, performer FROM song WHERE LOWER(title) LIKE '%${title.toLowerCase()}%'`);
    } else if (!title && performer) {
      result = await this._pool.query(`SELECT id, title, performer FROM song WHERE LOWER(performer) LIKE '%${performer.toLowerCase()}%'`);
    } else {
      result = await this._pool.query('SELECT id, title, performer FROM song');
    }
    return result.rows;
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM song WHERE id = $1',
      values: [id],
    };
    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError('Song tidak ditemukan');
    }

    return rows.map(mapDBToModel)[0];
  }

  async editSongById(id, {
    title,
    year,
    genre,
    performer,
    duration,
    albumId,
  }) {
    const query = {
      text: 'UPDATE song SET title = $1 , year = $2, genre = $3, performer = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, id],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError('Gagal memperbarui song. Id tidak ditemukan');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM song WHERE id = $1 RETURNING id',
      values: [id],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError('Song gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = SongService;
