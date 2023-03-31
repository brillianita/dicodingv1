exports.up = (pgm) => {
  pgm.createTable('playlist_songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    song_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });
  pgm.addConstraint(
    'playlist_songs',
    'fk_playlist_songs.playlist_id_playlist.id',
    'FOREIGN KEY(playlist_id) REFERENCES playlist(id) ON DELETE CASCADE',
  );
  pgm.addConstraint(
    'playlist_songs',
    'fk_playlist_songs.song_id_song.id',
    'FOREIGN KEY(song_id) REFERENCES song(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropTable('playlist_songs');
};
