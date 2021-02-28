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

export const getAnilistSeriesMatch = (search, list) => {
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

export const getDefaultValues = (data) => {
  const { selectedSeries = {}, existingMetadata = {} } = (data || {});
  let tags;
  let genres;
  let status;

  // Tags Logic
  if (existingMetadata.tagsLock && window.komga.enforceLocks) {
    tags = existingMetadata.tags || [];
  } else {
    const aniListTags = (selectedSeries.tags || []).map((tagObj) => tagObj.name);
    tags = [...new Set([...(existingMetadata.tags || []), ...(aniListTags || [])])];
  }

  // Genres Logic
  if (existingMetadata.genresLock && window.komga.enforceLocks) {
    genres = existingMetadata.genres;
  } else {
    genres = [...new Set([...(existingMetadata.genres || []), ...(selectedSeries.genres || [])])];
  }

  // Status Logic
  if (existingMetadata.statusLock && window.komga.enforceLocks) {
    status = existingMetadata.status;
  } else {
    // Map Anilist
    switch (selectedSeries.status) {
      case 'FINISHED':
        status = 'ENDED';
        break;
      case 'RELEASING':
        status = 'ONGOING';
        break;
      case 'ABANDONED': // Anilist does not handle this.
        status = 'ABANDONED';
        break;
      case 'HIATUS': // Anilist does not handle this.
        status = 'HIATUS';
        break;
      default:
        status = existingMetadata.status;
        break;
    }
  }

  // Not gonna do a full decode, do not trust anilist
  // and don't care that much to do a full implementation for little gain
  // TODO: Sanitize input
  let summary = existingMetadata.summaryLock && window.komga.enforceLocks
    ? existingMetadata.summary : selectedSeries.description || existingMetadata.summary;
  if (summary) {
    summary = summary.replace(/<br>/gi, '\n');
    summary = summary.replace(/<b>|<\/b>|<i>|<\/i>/gi, '');
  }

  const defaultValues = {
    title: existingMetadata.title,
    sortTitle: existingMetadata.titleSort,
    summary,
    status,
    publisher: existingMetadata.publisherLock && window.komga.enforceLocks
      ? existingMetadata.publisher : selectedSeries.publisher || existingMetadata.publisher,
    genres,
    tags,
    language: existingMetadata.languageLock && window.komga.enforceLocks
      ? existingMetadata.language : window.komga.defaultLanguage || existingMetadata.language,
    ageRating: existingMetadata.ageRating,
  };
  return defaultValues;
};

export const mapKitsuSearch = (kitsuList) => kitsuList.map((series) => ({
  id: series.id,
  title: {
    romaji: series?.attributes?.titles?.en_jp,
    english: series?.attributes?.titles?.en || series?.attributes?.titles?.en_us,
    native: series?.attributes?.titles?.ja_jp,
  },
  type: 'MANGA',
  description:series?.attributes?.description || series?.attributes?.synopsis,
  status: 'CANCELLED', // Map it
  // averageScore: 62,
  // meanScore: 65,
  // startDate: { year: 2013, month: 5, day: 9 },
  // endDate: { year: 2019, month: 7, day: 9 },
  // chapters: 36,
  // volumes: 7,
  // countryOfOrigin: 'JP',
  // isLicensed: true,
  // source: null,
  coverImage: {
    extraLarge: 'https://s4.anilist.co/file/anilistcdn/media/manga/cover/large/bx81315-FI88avN4NI9c.jpg',
    large: 'https://s4.anilist.co/file/anilistcdn/media/manga/cover/medium/bx81315-FI88avN4NI9c.jpg',
    medium: 'https://s4.anilist.co/file/anilistcdn/media/manga/cover/small/bx81315-FI88avN4NI9c.jpg',
  },
  genres: ['Action', 'Adventure', 'Comedy', 'Ecchi', 'Fantasy', 'Mecha'], // make call
  synonyms: ['Twelve Beast'], // generate this.
  // siteUrl: 'https://anilist.co/manga/81315',
  tags: [{ name: 'Shounen' }, { name: 'Monster Girl' }, { name: 'Isekai' }, { name: 'War' }, { name: 'Harem' }, { name: 'Centaur' }, { name: 'Mermaid' }], //no tagus, maybe create checklist?
  // staff: { edges: [{ role: 'Story & Art', node: { name: { full: 'Takemaru Inui' } } }] },
}));
