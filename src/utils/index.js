/* eslint-disable camelcase */
const mapDBToModel = ({
  id,
  name,
  year,
  title,
  genre,
  performer,
  duration,
  album_id,
  cover_url,
}) => ({
  id,
  name,
  year,
  title,
  genre,
  performer,
  duration,
  albumId: album_id,
  coverUrl: cover_url,
});

module.exports = { mapDBToModel };
