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
      type: CONSTANTS.SEARCH,
    }));

    yield call(apis.updateMetadata, data); // API Call
    yield put(actions.closeModal());
    // window.location.reload();
  } catch (error) {
    console.error(error);
  }
}

function* getKitsuGenres(series) {
  const genreResults = yield apis.getKitsuGenres(series.id);
  const genres = [];
  const tags = [];

  genreResults?.data?.data.forEach((item) => {
    // genre?.attributes?.name
    if (window.komga?.ignoreGenreList) {
      genres.push(item?.attributes?.name);
    } else if (window.komga?.genres?.length > 0) {
      if (window.komga?.genres?.find(
        (komgaGenre) => (komgaGenre.toLowerCase() === item?.attributes?.name?.toLowerCase()),
      )) {
        genres.push(item?.attributes?.name);
      } else {
        tags.push(item?.attributes?.name);
      }
    } else {
      tags.push(item?.attributes?.name);
    }
  });
  return { genres, tags };
}

function* getMALInfo(series) {
  try {
    const response = yield apis.getMALInfo(series.id);

    if (response?.status !== 200 || (!response?.data)) {
      return {};
    }

    const seriesInfo = response?.data;
    const additionalData = {
      title: {
        romaji: undefined,
        english: seriesInfo?.title_english?.title,
        native: seriesInfo?.title_japanese,
      },
      description: seriesInfo?.synopsis,
      status: helpers.getStatus(seriesInfo?.status),
      genres: [],
      synonyms: seriesInfo?.title_synonyms || [],
      tags: [],
    };

    const addToGenres = (list) => {
      if (!(list?.length > 0)) {
        return;
      }

      list.forEach((item) => {
        // genre?.attributes?.name
        if (window.komga?.ignoreGenreList) {
          additionalData.genres.push(item?.name);
        } else if (window.komga?.genres?.length > 0) {
          if (window.komga?.genres?.find(
            (komgaGenre) => (komgaGenre.toLowerCase() === item?.name?.toLowerCase()),
          )) {
            additionalData.genres.push(item?.name);
          } else {
            additionalData.tags.push(item?.name);
          }
        } else {
          additionalData.tags.push(item?.name);
        }
      });
    };

    // Genres
    addToGenres(seriesInfo?.genres);
    addToGenres(seriesInfo?.explicit_genres);
    addToGenres(seriesInfo?.demographics);
    addToGenres(seriesInfo?.themes);
    return additionalData;
  } catch (error) {
    return {};
  }
}

function* updateSelectedSeries(action) {
  let additionalData = {};
  if (!action?.noLoader) {
    yield put(actions.updateLoaderStatus({
      show: true,
      type: CONSTANTS.SEARCH,
    }));
  }
  switch (action?.series?.source) {
    case CONSTANTS.KITSU:
      additionalData = yield call(getKitsuGenres, action?.series);
      break;
    case CONSTANTS.MAL:
      additionalData = yield call(getMALInfo, action?.series);
      break;
    default:
      break;
  }

  const selectedSeries = { ...action?.series, ...additionalData };
  const metadaForm = yield select(selectors.selectMetadataForm);

  let { existingMetadata } = action;
  if (!existingMetadata) {
    existingMetadata = yield select(selectors.selectExistingMetadata);
  }

  yield put(actions.updateSelectedSeriesReducer(selectedSeries));

  metadaForm?.reset(helpers.getDefaultValues({
    selectedSeries,
    existingMetadata,
  }));

  if (!action?.noLoader) {
    yield put(actions.updateLoaderStatus({
      show: false,
      type: CONSTANTS.SEARCH,
    }));
  }
}

function* anilistSearch({ title }) {
  // Search series in Anilist
  try {
    const [anilistResponse, komgaResponse] = yield Promise.all([
      apis.searchAnlist(title),
      apis.getExistingMetadata(),
    ]);

    let list;
    let seriesMedia;
    if (anilistResponse.status === 200) {
      list = helpers.mapAnilistSearch(anilistResponse?.data?.data?.Page?.media);
      seriesMedia = helpers.getSeriesMatch(title, list);
      if (seriesMedia) {
        seriesMedia.fetchDate = new Date().toLocaleString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      }
    }

    yield put(actions.updateSearchResults(list));
    yield put(actions.updateExistingMetadata(komgaResponse.data.metadata));
    yield call(updateSelectedSeries, {
      series: seriesMedia,
      existingMetadata: komgaResponse.data.metadata,
      noLoader: true,
    });
    yield put(actions.openModal(CONSTANTS.AL));
  } catch (error) {
    console.error(error);
  }
}

function* kituSearch({ title }) {
  // Search series in Anilist
  try {
    const [kitsuResponse, komgaResponse] = yield Promise.all([
      apis.searchKitsu(title),
      apis.getExistingMetadata(),
    ]);

    let list;
    let seriesMedia;
    if (kitsuResponse.status === 200) {
      list = helpers.mapKitsuSearch(kitsuResponse?.data?.data);
      seriesMedia = helpers.getSeriesMatch(title, list);
      if (seriesMedia) {
        seriesMedia.fetchDate = new Date().toLocaleString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      }
    }

    yield put(actions.updateSearchResults(list));
    yield put(actions.updateExistingMetadata(komgaResponse.data.metadata));
    yield call(updateSelectedSeries, {
      series: seriesMedia,
      existingMetadata: komgaResponse.data.metadata,
      noLoader: true,
    });
    yield put(actions.openModal(CONSTANTS.KITSU));
  } catch (error) {
    console.error(error);
  }
}

function* malSearch({ title }) {
  // Search series in My Anime List
  try {
    const [malResponse, komgaResponse] = yield Promise.all([
      apis.searchMAL(title),
      apis.getExistingMetadata(),
    ]);

    let list;
    let seriesMedia;
    if (malResponse.status === 200) {
      list = helpers.mapMALSearch(malResponse?.data?.results);

      seriesMedia = helpers.getSeriesMatch(title, list);
      if (seriesMedia) {
        seriesMedia.fetchDate = new Date().toLocaleString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      }
    }

    yield put(actions.updateSearchResults(list));
    yield put(actions.updateExistingMetadata(komgaResponse.data.metadata));
    yield call(updateSelectedSeries, {
      series: seriesMedia,
      existingMetadata: komgaResponse.data.metadata,
      noLoader: true,
    });
    yield put(actions.openModal(CONSTANTS.MAL));
  } catch (error) {
    console.error(error);
  }
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
      type: action.data.initial ? action.data.type : CONSTANTS.SEARCH,
    }));

    const data = { title };
    switch (action.data.type) {
      case CONSTANTS.AL:
        yield call(anilistSearch, data);
        break;
      case CONSTANTS.KITSU:
        yield call(kituSearch, data);
        break;
      case CONSTANTS.MAL:
        yield call(malSearch, data);
        break;
      case CONSTANTS.MU:
        yield call(mangaUpdatesSearch, data);
        break;
      case CONSTANTS.MANGADEX:
        yield call(mangadexSearch, data);
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
  yield takeLatest('UPDATE_SELECTED_SERIES_ACTION', updateSelectedSeries);
}

// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield all([call(actionWatcher)]);
}
