exports.up = (pgm) => {
  pgm.createTable('playlist_activity', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    action: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    time: {
      type: 'TIMESTAMP',
      notNull: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    song_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });
  pgm.addConstraint(
    'playlist_activity',
    'fk_playlist_activity.playlist_id_playlist.id',
    'FOREIGN KEY(playlist_id) REFERENCES playlist(id) ON DELETE CASCADE',
  );
  pgm.addConstraint(
    'playlist_activity',
    'fk_playlist_activity.user_id_users.id',
    'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE',
  );
  pgm.addConstraint(
    'playlist_activity',
    'fk_playlist_activity.song_id_song.id',
    'FOREIGN KEY(song_id) REFERENCES song(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropTable('playlist_activity');
};
