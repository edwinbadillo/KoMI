import axios from 'axios';
import { anilistQuery } from '../constants';
import { getSeriesId } from '../helpers';

const komgaApiUrl = `${window.location.origin}/api/v1`;

export const updateMetadata = (data) => axios({
  method: 'patch',
  url: `${komgaApiUrl}/series/${getSeriesId()}/metadata`,
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
  url: `${komgaApiUrl}/series/${getSeriesId()}`,
}));

export const searchKitsu = (search) => (axios({
  method: 'get',
  url: `https://kitsu.io/api/edge/manga?filter[text]=${search}&page[limit]=10`,
}));

export const getKitsuGenres = (id) => (axios({
  method: 'get',
  url: `https://kitsu.io/api/edge/manga/${id}/genres`,
}));
