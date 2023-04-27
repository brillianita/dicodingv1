const exportRoutes = (handler) => [
  {
    method: 'POST',
    path: '/export/playlists/{playlistId}',
    handler: handler.postExportPlaylistHandler,
    options: {
      auth: 'musicsapp_jwt',
    },
  },
];

module.exports = exportRoutes;
