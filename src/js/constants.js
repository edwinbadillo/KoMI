export const anilistQuery = `
query ($id: Int, $page: Int, $perPage: Int, $search: String, $type: MediaType) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      media(id: $id, search: $search, type: $type) {
        id
        title {
          romaji
          english
          native
        }
        type
        description
        status
        averageScore
        meanScore
        startDate {
          year
          month
          day
        }
        endDate {
          year
          month
          day
        }
        chapters
        volumes
        countryOfOrigin
        isLicensed
        source
        coverImage {
          extraLarge
          large
          medium
          color
        }
        genres
        synonyms
        siteUrl
        tags {
            name
        }
        staff(page: $page) {
          edges {
            role
            node {
              name {
                full
              }
          }
        }
      }
    }
  }
}
`;
