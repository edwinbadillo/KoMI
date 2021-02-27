export const search = (data) => ({ type: 'SEARCH', data });
export const updateMetadata = (data) => ({ type: 'UPDATE_METADATA', data });

export const updateLoaderStatus = (data) => ({ type: 'LOADER_UPDATE', data });

export const openModal = (type) => ({ type: 'OPEN_MODAL', data: { type } })
export const closeModal = (type) => ({ type: 'CLOSE_MODAL' })
export const setFormData = (data) => ({ type: 'SET_FORM_DATA', data })