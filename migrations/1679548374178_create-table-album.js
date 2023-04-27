exports.up = (pgm) => {
  pgm.createTable('album', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    name: {
      type: 'VARCHAR',
      notNull: true,
    },
    year: {
      type: 'INTEGER',
      notNull: true,
    },
    cover_url: {
      type: 'VARCHAR',
      notNull: false,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('album');
};
