import axios from 'axios';
import {
  anilistQuery
} from './constants';
export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

const match = (pattern, item) => {
  const regex = new RegExp(`.*${pattern}.*`, 'i');
  return regex.test(item);
};

export const getSeries = (search, list) => {
  let series;
  for (let i = 0, len = list.length; i < len; i++) {
    const item = list[i];

    // Check titles & If found in titles then return
    if (
      match(search, item.title.english) ||
      match(search, item.title.romaji) ||
      match(search, item.title.native)
    ) {
      series = item;
      break;
    }
    // Check synonyms
    for (let y = 0, synLen = item.synonyms.length; y < synLen; y++) {
      const syn = item.synonyms[y];
      if (match(search, syn)) {
        series = item;
        break;
      }
    }
    // If broke out of synonyms and found it end
    if (series) {
      break;
    }
  }
  if (!series) {
    console.log('never found');
    [series] = list;
  }
  return series;
};

  export const fetchAnilistData = (search, cb, update) => {

    const anilistRequest = axios({
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
    });


    const komgaRequest = axios({
      method: 'get',
      url: `${window.location.origin}/api/v1${window.location.pathname}`,
      // url: 'https://run.mocky.io/v3/f304e0dd-e722-4a81-a031-26d899586972',
    });

    axios.all([anilistRequest, komgaRequest]).then(axios.spread((...responses) => {
      const [anilistResponse, komgaResponse] = responses;

      // Anilist Response
      console.log('Anilist Response', anilistResponse.data);
      console.log('Komga Response', komgaResponse.data)
      let list;
      let seriesMedia;
      if (anilistResponse.status === 200) {
        list = anilistResponse && anilistResponse.data && anilistResponse.data.data && anilistResponse.data.data.Page && anilistResponse.data.data.Page.media && anilistResponse.data.data.Page.media.length > 0 && anilistResponse.data.data.Page.media;
        seriesMedia = getSeries(search, list);
        if (seriesMedia) {
          seriesMedia.fetchDate = new Date().toLocaleString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });
        }
      } 
      
      // Finish and return
      cb({
        search,
        list,
        closest: seriesMedia,
        existingMetadata: komgaResponse.data.metadata,
      }, update);

      // use/access the results 
    })).catch((error) => {
      console.log(error);
      // Failure
      if (cb) {
        cb(null);
      }
    });
  }
