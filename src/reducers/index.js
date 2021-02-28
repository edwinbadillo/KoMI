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
  selectedSeries: 0,
  searchResults: [],
  existingMetadata: {},
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
      return action?.data;
    case 'CLEAR_EXISTING_METADATA':
    case 'CLEAR_ALL':
      return initialState.existingMetadata;
    default:
      return state;
  }
};

const selectedSeries = (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_SELECTED_SERIES':
      return action?.data;
    case 'CLEAR_SELECTED_SERIES':
    case 'CLEAR_ALL':
      return initialState.selectedSeries;
    default:
      return state;
  }
};

const searchResults = (state = [], action) => {
  switch (action.type) {
    case 'UPDATE_SEARCH_RESULTS':
      return action?.data;
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
};

const rootReducer = combineReducers({
  loaderStatus,
  modalStatus,
  existingMetadata,
  selectedSeries,
  searchResults,
  formData,
});

export default rootReducer;
