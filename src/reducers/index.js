import { combineReducers } from 'redux';

const initialState = {
  loaderStatus: {
    show: false,
    type: null,
  },
  modalStatus: {
    show: false,
    type: null,
  },
  currentMatch: 0,
  searchResults: null,
};


const loaderStatus = (state = initialState.loaderStatus, action) => {
  switch (action.type) {
    case 'LOADER_UPDATE':
      return {
        show: action?.data?.show || false,
        type: action?.data?.type || 'GLOBAL',
      };
    case 'LOADER_CLEAR':
    case 'CLEAR_ALL':
      return initialState.loaderStatus;
    default:
      return state;
  }
};

const modalStatus = (state = initialState.modalStatus, action) => {
  console.log('action => ', action);
  switch (action.type) {
    case 'OPEN_MODAL':
      return {
        show: true,
        type: action?.data?.type || 'global',
      };
    case 'CLOSE_MODAL':
    case 'CLEAR_ALL':
      return initialState.modalStatus;
    default:
      return state;
  }
};


const existingMetadata = (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_EXISTING_METADATA':
      return action?.data.existingMetadata;
    case 'CLEAR_EXISTING_METADATAL':
    case 'CLEAR_ALL':
      return initialState.existingMetadata;
    default:
      return state;
  }
};

const currentMatch = (state = initialState.currentMatch, action) => {
  switch (action.type) {
    case 'UPDATE_CURRENT_MATCH':
      return action?.data.match;
    case 'CLEAR_CURRENT_MATCH':
    case 'CLEAR_ALL':
      return initialState.currentMatch;
    default:
      return state;
  }
};

const searchResults = (state = null, action) => {
  switch (action.type) {
    case 'UPDATE_SEARCH_RESULTS':
      return {
        type: action?.data?.type,
        results: action?.data?.results,
      };
    case 'CLEAR_SEARCH_RESULTS':
    case 'CLEAR_ALL':
      return initialState.searchResults;
    default:
      return state;
  }
};

const formData = (state = {}, action) => {
  switch (action.type) {
    case 'SET_FORM_DATA':
      return { ...state, ...(action?.data || {}) };
    case 'CLEAR_SEARCH_RESULTS':
    case 'CLEAR_ALL':
      return {};
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  loaderStatus,
  modalStatus,
  existingMetadata,
  currentMatch,
  searchResults,
  formData,
});

export default rootReducer;
