import axios from 'axios';

export const updateMetadata = (data) => {
  return axios({
    method: 'patch',
    url: `${window.location.origin}/api/v1${window.location.pathname}/metadata`,
    // url: 'https://run.mocky.io/v3/f304e0dd-e722-4a81-a031-26d899586972',
    data,
  })
};
