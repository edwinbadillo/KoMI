import { all, call, put, takeLatest, select } from 'redux-saga/effects'
import { updateLoaderStatus, closeModal } from '../actions';
import * as CONSTANTS from '../constants';
import * as apis from '../apis';
import * as selectors from '../selectors';

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
        summaryLock: window.komga.newLockValue
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
    yield put(updateLoaderStatus({
      show: true,
      type: CONSTANTS.GLOBAL,
    }));

    yield call(apis.updateMetadata, data); //API Call
    yield put(closeModal())
    window.location.reload();
  } catch (error) {
    console.log(error);
  }
}

function* search(action) {

  try {
    const titleElement = document.querySelector('.v-main__wrap .v-toolbar__content .v-toolbar__title span')
    const title = action?.data?.title || (titleElement && titleElement.innerText) || '';// a.innerText

    console.log('Search =>', title)

    // Show Loader
    yield put(updateLoaderStatus({
      show: true,
      type: action.data.title ? action.data.type : CONSTANTS.GLOBAL,
    }));

    if (action.data.type === CONSTANTS.ANILIST) {
      yield call(anilistSearch, title)
    } else if (action.data.type === CONSTANTS.MAL) {
      yield call(malSearch, title)
    }

    // Hide Loader
    yield put(updateLoaderStatus({
      show: false,
      type: action?.data?.type,
    }));

  } catch (error) {

  }
}

function* anilistSearch() {

}

function* malSearch() {

}

export function* actionWatcher() {
  yield takeLatest('SEARCH', search);
  yield takeLatest('UPDATE_METADATA', updateMetadata);
}

// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield all([call(actionWatcher)]);
}
