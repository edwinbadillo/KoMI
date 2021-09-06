import xss from 'xss';
import he from 'he';
import * as CONSTANTS from './constants';

export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return '';
};

const match = (pattern, item) => {
  const regex = new RegExp(`.*${pattern}.*`, 'i');
  return regex.test(item);
};

export const getText = (text) => {
  let result = text.replace(/<br>/gi, '\n');
  result = he.unescape(result);
  result = xss(result, {
    whiteList: [], // empty, means filter out all tags
    stripIgnoreTag: true, // filter out all HTML not in the whitelist
    stripIgnoreTagBody: ['script'], // the script tag is a special case, we need to filter out its content
  });
  return result;
};

export const getSeriesMatch = (search, list) => {
  let series;
  for (let i = 0, len = list.length; i < len; i += 1) {
    const item = list[i];

    // Check titles & If found in titles then return
    if (
      match(search, item.title.english)
      || match(search, item.title.romaji)
      || match(search, item.title.native)
    ) {
      series = item;
      break;
    }
    // Check synonyms
    for (let y = 0, synLen = item.synonyms.length; y < synLen; y += 1) {
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
    // console.log('never found');
    [series] = list;
  }
  return series;
};

const getStatus = (input = '') => {
  let status = input;
  switch (input.toUpperCase()) {
    case 'FINISHED': // AL & Kitsu
      status = 'ENDED';
      break;
    case 'RELEASING': // AL
    case 'CURRENT': // Kitsu
      status = 'ONGOING';
      break;
    case 'ABANDONED':
      // Not supported by AL & Kitsu
      status = 'ABANDONED';
      break;
    case 'HIATUS':
      // Not supported by AL & Kitsu
      status = 'HIATUS';
      break;
    default:
      status = 'ONGOING'; // Kitsu has some weird status values, seems like it's a text field from their side.
      break;
  }
  return status;
};

const getKitsuAgeRating = (input) => {
  let ageRating = input;

  if (ageRating) {
    switch (input.toUpperCase()) {
      case 'G':
        ageRating = 0;
        break;
      case 'PG':
      case 'PG-13':
        ageRating = 13;
        break;
      case 'R':
        ageRating = 18;
        break;
      default:
        ageRating = undefined;
        break;
    }
  }
  return ageRating;
};

export const getDefaultValues = (data) => {
  const { selectedSeries = {}, existingMetadata = {} } = (data || {});
  let tags = existingMetadata.tags || [];
  let {
    publisher, language, status, genres, ageRating, summary,
  } = existingMetadata;

  if (!window.komga.enforceLocks) {
    // Tags Logic
    if (!(existingMetadata.tagsLock && window.komga.enforceLocks)) {
      tags = [...new Set([...(existingMetadata.tags || []), ...(selectedSeries.tags || [])])];
    }

    // Genres Logic
    if (!(existingMetadata.genresLock && window.komga.enforceLocks)) {
      genres = [...new Set([...(existingMetadata.genres || []), ...(selectedSeries.genres || [])])];
    }

    // Status Logic
    if (!(existingMetadata.statusLock && window.komga.enforceLocks)) {
      status = getStatus(selectedSeries.status || existingMetadata.status || '');
    }

    // ageRating Logic
    if (!(existingMetadata.ageRatingLock && window.komga.enforceLocks)) {
      ageRating = selectedSeries?.ageRating || '';
    }

    // publisher Logic
    if (!(existingMetadata.publisherLock && window.komga.enforceLocks)) {
      publisher = selectedSeries?.publisher || existingMetadata.publisher || '';
    }

    // language Logic
    if (!(existingMetadata.languageLock && window.komga.enforceLocks)) {
      language = window.komga.defaultLanguage || '';
    }

    if (!(existingMetadata.summaryLock && window.komga.enforceLocks)) {
      summary = selectedSeries.description || selectedSeries.summary || existingMetadata.summary || '';
    }
  }

  const defaultValues = {
    title: existingMetadata.title,
    sortTitle: existingMetadata.titleSort,
    summary: getText(summary),
    status,
    publisher,
    genres,
    tags,
    language,
    ageRating,
  };
  return defaultValues;
};

export const mapAnilistSearch = (alList) => alList.map((series) => ({
  ...series,
  tags: (series?.tags || []).map((tag) => tag?.name),
  source: CONSTANTS.AL,
}));

export const mapKitsuSearch = (kitsuList) => kitsuList.map((series) => ({
  id: series.id,
  title: {
    romaji: series?.attributes?.titles?.en_jp,
    english: series?.attributes?.titles?.en || series?.attributes?.titles?.en_us,
    native: series?.attributes?.titles?.ja_jp,
  },
  description: series?.attributes?.description || series?.attributes?.synopsis,
  status: series?.attributes?.status,
  coverImage: {
    extraLarge: series?.attributes?.posterImage?.original,
    large: series?.attributes?.posterImage?.large,
    medium: series?.attributes?.posterImage?.medium,
    small: series?.attributes?.posterImage?.small,
  },
  genres: [],
  synonyms: [...(series?.attributes?.abbreviatedTitles || []), ...[series?.attributes?.canonicalTitle || '']],
  tags: [],
  ageRating: getKitsuAgeRating(series?.attributes?.ageRating),
  publisher: undefined,
  source: CONSTANTS.KITSU,
  siteUrl: xss(`https://kitsu.io/manga/${series?.attributes?.slug || series?.id || ''}`, {
    whiteList: [], // empty, means filter out all tags
    stripIgnoreTag: true, // filter out all HTML not in the whitelist
    stripIgnoreTagBody: ['script'], // the script tag is a special case, we need to filter out its content
  }),
}));

export const mapGoogleSearch = (googleList) => googleList.map((series) => ({
  id: series.id,
  title: {
    english: series?.volumeInfo?.title,
  },
  description: series?.volumeInfo?.description,
  coverImage: {
    medium: series?.volumeInfo?.imageLinks?.thumbnail,
    small: series?.volumeInfo?.imageLinks?.smallThumbnail,
  },
  genres: [],
  synonyms: [],
  tags: [],
  ageRating: series?.volumeInfo?.maturityRating === 'MATURE' ? 18 : undefined,
  publisher: series?.volumeInfo?.publisher,
  source: CONSTANTS.GOOGLE,
  siteUrl: xss(series?.volumeInfo?.canonicalVolumeLink, {
    whiteList: [], // empty, means filter out all tags
    stripIgnoreTag: true, // filter out all HTML not in the whitelist
    stripIgnoreTagBody: ['script'], // the script tag is a special case, we need to filter out its content
  }),
}));

export const getSeriesId = () => {
  const pathNameArray = window.location.pathname.split('/') || [''];
  let seriesId = pathNameArray.pop();
  if (seriesId === '') {
    seriesId = pathNameArray.pop();
  }
  return seriesId;
};