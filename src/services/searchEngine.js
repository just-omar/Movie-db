export default class SearchEngine {
  async getGuestToken() {
    const result = await fetch(
      'https://api.themoviedb.org/3/authentication/guest_session/new?api_key=4b39966e6c929bc1ba764404e6b2b3b1'
    )
    const body = await result.json()
    const { guest_session_id } = body
    await localStorage.setItem('guestToken', guest_session_id)
  }

  async rateMovie(stars, movieId) {
    await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/rating?api_key=4b39966e6c929bc1ba764404e6b2b3b1&guest_session_id=${localStorage.getItem(
        'guestToken'
      )}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({ value: stars }),
      }
    )
  }

  async getRatedMovies(page) {
    const result = await fetch(
      `https://api.themoviedb.org/3/guest_session/${localStorage.getItem(
        'guestToken'
      )}/rated/movies?api_key=4b39966e6c929bc1ba764404e6b2b3b1&language=en-US&sort_by=created_at.asc&page=${page}`
    )
    const { results, total_pages } = await result.json()
    return { results: results, totalPagesRanked: total_pages }
  }

  async getResource(page) {
    const result = await fetch(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=4b39966e6c929bc1ba764404e6b2b3b1&page=${page}`
    )
    const body = await result.json()
    return { elements: body.results, maxPage: body.total_pages }
  }
  async getGenreList() {
    const result = await fetch(
      'https://api.themoviedb.org/3/genre/movie/list?api_key=4b39966e6c929bc1ba764404e6b2b3b1&language=en-US'
    )
    const body = await result.json()
    return body.genres
  }

  async getFilmBySearching(value, page) {
    const result = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=4b39966e6c929bc1ba764404e6b2b3b1&language=en-US&page=1&include_adult=false&query=${value}&page=${page}`
    )
    const body = await result.json()
    return { elements: body.results, maxPage: body.total_pages }
  }
}
