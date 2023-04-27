const autoBind = require('auto-bind');

class AlbumHandler {
  constructor(albumService, storageService, validator) {
    this._albumService = albumService;
    this._storageService = storageService;
    this._validator = validator;
    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);

    const albumId = await this._albumService.addAlbum(request.payload);

    const response = h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumHandler() {
    const album = await this._albumService.getAlbum();
    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  async getAlbumByIdHandler(request, h) {
    const { id } = request.params;
    const album = await this._albumService.getAlbumById(id);

    const response = h.response({
      status: 'success',
      data: {
        album,
      },
    });
    response.code(200);
    return response;
  }

  async putAlbumByIdHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);

    const { id } = request.params;

    await this._albumService.editAlbumById(id, request.payload);

    const response = h.response({
      status: 'success',
      message: 'Album berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  async deleteAlbumByIdHandler(request, h) {
    const { id } = request.params;
    await this._albumService.deleteAlbumById(id);

    const response = h.response({
      status: 'success',
      message: 'Album berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  async postUploadCoverHandler(request, h) {
    const { id } = request.params;
    const { cover } = request.payload;
    await this._validator.validateCoverPayload(cover.hapi.headers);
    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const url = `http://${process.env.HOST}:${process.env.PORT}/file/album/${filename}`;
    await this._albumService.editCoverUrl(id, url);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);
    return response;
  }
}

module.exports = AlbumHandler;
