import axios from 'axios';
import { anilistQuery } from '../constants';

const isDevServer = process?.env?.NODE_ENV === 'development';

const komgaApiUrl = `${window.location.origin}/api/v1`;

const komgaDevUrls = {
  metaData: 'https://run.mocky.io/v3/f304e0dd-e722-4a81-a031-26d899586972',
};

export const updateMetadata = (data) => axios({
  method: 'patch',
  url: isDevServer ? komgaDevUrls.metaData : `${komgaApiUrl}${window.location.pathname}/metadata`,
  data,
});

export const searchAnlist = (search) => (
  axios({
    method: 'post',
    url: 'https://graphql.anilist.co',
    data: {
      query: anilistQuery,
      variables: {
        search,
        page: 1,
        perPage: 30,
        type: 'MANGA',
      },
    },
  })
);

export const getExistingMetadata = () => (axios({
  method: 'get',
  url: isDevServer ? komgaDevUrls.metaData : `${komgaApiUrl}${window.location.pathname}`,
}));

export const searchKitsu = (search) => (axios({
  method: 'get',
  url: `https://kitsu.io/api/edge/manga?filter[text]=${search}&page[limit]=10`,
}));

export const getKitsuGenres = (id) => (axios({
  method: 'get',
  url: `https://kitsu.io/api/edge/manga/${id}/genres`,
}));
