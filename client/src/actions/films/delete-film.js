import * as api from '../api';
import * as C from '../../constants/films';
import {getFilm} from './get-film';
import {deleteLink} from '../links/delete-link';

function deleteInProgress() {
  return {
    type: C.FILM_DELETE
  };
}

function deleteSuccess(filmId) {
  return {
    type: C.FILM_DELETE_SUCCESS,
    payload: filmId
  };
}

function deleteError(error) {
  return {
    type: C.FILM_DELETE_ERROR,
    payload: error
  };
}

export function deleteFilm(_id) {
  return dispatch => {
    let film;
    const filter = {simple: {_id}};
    return dispatch(getFilm(filter))
      .then(_film => {
        film = _film;
        if (!film) {
          return dispatch(deleteError('No film to delete'));
        }
        dispatch(deleteInProgress());
        return api.deleteRessource('films', film.id);
      })
      .then(() => {
        if (!film.downloadLinks || !film.downloadLinks.length) {
          return Promise.resolve();
        }
        const linksId = film.downloadLinks.map(link => {
          return link.id;
        });
        if (!linksId || !linksId.length) {
          return Promise.resolve();
        }
        const linksPromise = [];
        linksId.forEach(linkId => {
          const promise = dispatch(deleteLink(linkId));
          linksPromise.push(promise);
        });
        return Promise.all(linksPromise);
      })
      .then(() => {
        dispatch(deleteSuccess(_id));
        return 'DELETED';
      })
      .catch(err => {
        dispatch(deleteError(err));
        return null;
      });
  };
}
