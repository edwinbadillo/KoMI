import {
  all, call, put, takeLatest, select,
} from 'redux-saga/effects';
import * as actions from '../actions';

import * as CONSTANTS from '../constants';
import * as apis from '../apis';
import * as selectors from '../selectors';
import * as helpers from '../helpers';

function* updateMetadata() {
  try {
    const existingMetadata = yield select(selectors.selectExistingMetadata);
    const formData = yield select(selectors.selectMetadataFormValues);
    let data = {
      ...formData,
      statusLock: existingMetadata.statusLock,
      readingDirectionLock: existingMetadata.readingDirectionLock,
      ageRatingLock: existingMetadata.ageRatingLock,
      publisherLock: existingMetadata.publisherLock,
      languageLock: existingMetadata.languageLock,
      genresLock: existingMetadata.genresLock,
      tagsLock: existingMetadata.tagsLock,
      titleLock: existingMetadata.titleLock,
      titleSortLock: existingMetadata.titleSortLock,
      summaryLock: existingMetadata.summaryLock,
    };

    if (!window.komga.keepExistingLocksOnUpdate) {
      const lockData = {
        statusLock: window.komga.newLockValue,
        readingDirectionLock: window.komga.newLockValue,
        ageRatingLock: window.komga.newLockValue,
        publisherLock: window.komga.newLockValue,
        languageLock: window.komga.newLockValue,
        genresLock: window.komga.newLockValue,
        tagsLock: window.komga.newLockValue,
        titleLock: window.komga.newLockValue,
        titleSortLock: window.komga.newLockValue,
        summaryLock: window.komga.newLockValue,
      };

      if (typeof data.genres === 'string') {
        data.genres = data.genres.split(',');
      }

      if (typeof data.tags === 'string') {
        data.tags = data.tags.split(',');
      }

      data = { ...data, ...lockData };
    }

    // Set Loader
    yield put(actions.updateLoaderStatus({
      show: true,
      type: CONSTANTS.GLOBAL,
    }));

    yield call(apis.updateMetadata, data); // API Call
    yield put(actions.closeModal());
    window.location.reload();
  } catch (error) {
    console.error(error);
  }
}

function* anilistSearch({ title, update }) {
  // Search series in Anilist
  try {
    const titleElement = document.querySelector('.v-main__wrap .v-toolbar__content .v-toolbar__title span');
    const searchTitle = title || (titleElement && titleElement.innerText) || '';// a.innerText

    const [anilistResponse, komgaResponse] = yield Promise.all([
      apis.searchAnlist(searchTitle),
      apis.getExistingMetadata(),
    ]);

    let list;
    let seriesMedia;
    if (anilistResponse.status === 200) {
      list = anilistResponse?.data?.data?.Page?.media;
      seriesMedia = helpers.getAnilistSeriesMatch(searchTitle, list);
      if (seriesMedia) {
        seriesMedia.fetchDate = new Date().toLocaleString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      }
    }

    yield put(actions.openModal(CONSTANTS.AL));
    yield put(actions.updateSearchResults(list));
    yield put(actions.updateExistingMetadata(komgaResponse.data.metadata));
    yield put(actions.updateSelectedSeries(seriesMedia));
    if (update) {
      const metadaForm = yield select(selectors.selectMetadataForm);
      metadaForm.reset(helpers.getDefaultValues({
        selectedSeries: seriesMedia,
        existingMetadata: komgaResponse.data.metadata,
      }));
    }

    //   // Finish and return
    //   cb({
    //     search,
    //     list,
    //     closest: seriesMedia,
    //     existingMetadata: komgaResponse.data.metadata,
    //   }, update);

    //   // use/access the results
    // })).catch((error) => {
    //   console.log(error);
    //   // Failure
    //   if (cb) {
    //     cb(null);
    //   }
    // });
  } catch (error) {
    console.error(error);
  }
}

function* kituSearch({ title, update }) {
  // Search series in Anilist
  try {
    const titleElement = document.querySelector('.v-main__wrap .v-toolbar__content .v-toolbar__title span');
    const searchTitle = title || (titleElement && titleElement.innerText) || '';// a.innerText

    const [kitsuResponse, komgaResponse] = yield Promise.all([
      apis.searchKitsu(searchTitle),
      apis.getExistingMetadata(),
    ]);

    let list;
    let seriesMedia;
    console.log(kitsuResponse);
    return;
    // eslint-disable-next-line no-unreachable
    if (kitsuResponse.status === 200) {
      list = helpers.mapKitsuSearch(kitsuResponse?.data?.data);
      seriesMedia = helpers.getAnilistSeriesMatch(searchTitle, list);
      if (seriesMedia) {
        seriesMedia.fetchDate = new Date().toLocaleString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      }
    }

    yield put(actions.openModal(CONSTANTS.AL));
    yield put(actions.updateSearchResults(list));
    yield put(actions.updateExistingMetadata(komgaResponse.data.metadata));
    yield put(actions.updateSelectedSeries(seriesMedia));
    if (update) {
      const metadaForm = yield select(selectors.selectMetadataForm);
      metadaForm.reset(helpers.getDefaultValues({
        selectedSeries: seriesMedia,
        existingMetadata: komgaResponse.data.metadata,
      }));
    }
  } catch (error) {
    console.error(error);
  }
}

function* malSearch() {
  // Search series in My Anime List
}

function* mangaUpdatesSearch() {
  // Search series in Manga Updates
}

function* mangadexSearch() {
  // Search series in Mangadex
}

function* search(action) {
  try {
    const titleElement = document.querySelector('.v-main__wrap .v-toolbar__content .v-toolbar__title span');
    const title = action?.data?.title || (titleElement && titleElement.innerText) || '';// a.innerText

    // Show Loader
    yield put(actions.updateLoaderStatus({
      show: true,
      type: action.data.title ? action.data.type : CONSTANTS.GLOBAL,
    }));

    switch (action.data.type) {
      case CONSTANTS.AL:
        yield call(anilistSearch, { title });
        break;
      case CONSTANTS.KITSU:
        yield call(kituSearch, { title });
        break;
      case CONSTANTS.MAL:
        yield call(malSearch, { title });
        break;
      case CONSTANTS.MU:
        yield call(mangaUpdatesSearch, { title });
        break;
      case CONSTANTS.MANGADEX:
        yield call(mangadexSearch, { title });
        break;

      default:
        break;
    }

    // Hide Loader
    yield put(actions.updateLoaderStatus({
      show: false,
      type: action?.data?.type,
    }));
  } catch (error) {
    console.error(error);
  }
}

export function* actionWatcher() {
  yield takeLatest('SEARCH', search);
  yield takeLatest('UPDATE_METADATA', updateMetadata);
}

// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield all([call(actionWatcher)]);
}
