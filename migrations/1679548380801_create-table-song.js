exports.up = (pgm) => {
  pgm.createTable('song', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    title: {
      type: 'VARCHAR',
      notNull: true,
    },
    year: {
      type: 'INTEGER',
      notNull: true,
    },
    genre: {
      type: 'VARCHAR',
      notNull: true,
    },
    performer: {
      type: 'VARCHAR',
      notNull: true,
    },
    duration: {
      type: 'INTEGER',
      notNull: false,
    },
    album_id: {
      type: 'VARCHAR',
      notNull: false,
    },
  });
  pgm.addConstraint(
    'song',
    'fk_song.album_id_album.id',
    'FOREIGN KEY(album_id) REFERENCES album(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropTable('song');
};
