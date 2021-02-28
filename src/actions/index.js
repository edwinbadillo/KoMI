export const search = (data) => ({ type: 'SEARCH', data });
export const updateMetadata = (data) => ({ type: 'UPDATE_METADATA', data });

export const updateLoaderStatus = (data) => ({ type: 'LOADER_UPDATE', data });

export const openModal = (type) => ({ type: 'OPEN_MODAL', data: { type } });
export const closeModal = () => ({ type: 'CLOSE_MODAL' });
export const setFormData = (data) => ({ type: 'SET_FORM_DATA', data });

export const updateSearchResults = (data) => ({ type: 'UPDATE_SEARCH_RESULTS', data });
export const updateExistingMetadata = (data) => ({ type: 'UPDATE_EXISTING_METADATA', data });

export const updateSelectedSeries = (data) => ({ type: 'UPDATE_SELECTED_SERIES', data });
