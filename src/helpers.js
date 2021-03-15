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
      status = getStatus(selectedSeries.status || existingMetadata.status);
    }

    // ageRating Logic
    if (!(existingMetadata.ageRatingLock && window.komga.enforceLocks)) {
      ageRating = selectedSeries?.ageRating;
    }

    // publisher Logic
    if (!(existingMetadata.publisherLock && window.komga.enforceLocks)) {
      publisher = selectedSeries?.publisher || existingMetadata.publisher;
    }

    // language Logic
    if (!(existingMetadata.languageLock && window.komga.enforceLocks)) {
      language = window.komga.defaultLanguage;
    }

    if (!(existingMetadata.summaryLock && window.komga.enforceLocks)) {
      summary = selectedSeries.description || selectedSeries.summary || existingMetadata.summary;
      if (summary) {
        // TODO: Sanitize input
        summary = summary.replace(/<br>/gi, '\n');
        summary = summary.replace(/<b>|<\/b>|<i>|<\/i>/gi, '');
      }
    }
  }

  const defaultValues = {
    title: existingMetadata.title,
    sortTitle: existingMetadata.titleSort,
    summary,
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
  ageRating: series?.attributes?.ageRating,
  publisher: undefined,
  source: CONSTANTS.KITSU,
}));
