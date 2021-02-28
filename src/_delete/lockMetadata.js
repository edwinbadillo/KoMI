/* eslint-disable */
// import axios from 'axios';

// async function f() {
//   const items = document.querySelectorAll('.item-card a');

//   const data = {
//     statusLock: true, readingDirectionLock: true, ageRatingLock: true, publisherLock: true, languageLock: true, genresLock: true, tagsLock: true, language: 'en', titleLock: true, titleSortLock: true, summaryLock: true,
//   };

//   for (let i = 0, itemsLength = items.length; i < itemsLength; i++) {
//     const seriesId = items[i].href.replace(`${window.location.origin}/series/`, '');
//     const promise = axios({
//       method: 'patch',
//       url: `${window.location.origin}/api/v1/series/${seriesId}/metadata`,
//       // url: 'https://run.mocky.io/v3/f304e0dd-e722-4a81-a031-26d899586972',
//       data,
//     });
//     await promise;
//   }
// }
// export default f;
