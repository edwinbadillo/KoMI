import { createSelector } from 'reselect';

export const selectLoaderStatus = (state) => state.loaderStatus;
export const selectModalStatus = (state) => state.modalStatus;
export const selectExistingMetadata = (state) => state.existingMetadata;
export const selectSelectedSeries = (state) => state.selectedSeries;
export const selectSearchResults = (state) => state.searchResults;
export const selectFormData = (state) => state.formData;

export const selectMetadataForm = createSelector(
  selectFormData,
  (formData) => formData?.metadata,
);

export const selectMetadataFormValues = createSelector(
  selectMetadataForm,
  (metadata) => metadata?.getValues(),
);
