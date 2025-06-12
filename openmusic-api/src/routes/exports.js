const exportsRoute = (handler) => [
  {
    method: 'POST',
    path: '/export/playlists/{id}',
    handler: (request, h) => handler.postExportPlaylistHandler(request, h),
    options: {
      auth: 'openmusic_jwt',
    },
  },
];

export default exportsRoute;
