const BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = '15ec8264c78254430edd86ddaec3a447'

export default class SearchEngine {
  constructor() {
    this.genreList = null
    this.trendingMovies = {}
    this.initialize()
  }

  async initialize() {
    if (!this.guestToken) {
      await this.getGuestToken()
    }
    if (!this.genreList) {
      await this.getGenreList()
    }
  }

  async getGuestToken() {
    const url = `${BASE_URL}/authentication/guest_session/new`
    const queryParams = new URLSearchParams({ api_key: API_KEY })
    const result = await fetch(`${url}?${queryParams}`)
    if (!result.ok) {
      throw new Error(`Failed to get guest token:status ${result.status}`)
    }
    const body = await result.json()
    return body.guest_session_id
  }

  async getGenreList() {
    const url = `${BASE_URL}/genre/movie/list`
    const queryParams = new URLSearchParams({ api_key: API_KEY, language: 'en-US' })
    const result = await fetch(`${url}?${queryParams}`)
    if (!result.ok) {
      throw new Error(`Failed to get genre list:status ${result.status}`)
    }
    const body = await result.json()
    this.genreList = body.genres
    return this.genreList
  }

  async getResource(page) {
    const url = `${BASE_URL}/trending/movie/week`
    const queryParams = new URLSearchParams({ api_key: API_KEY, page, sort_by: 'created_at.desc' })
    const result = await fetch(`${url}?${queryParams}`)
    if (!result.ok) {
      throw new Error(`Failed to get trending movies:status ${result.status}`)
    }
    const body = await result.json()
    // console.log(body)
    return { elements: body.results, maxPage: body.total_pages }
  }

  async getFilmBySearching(value, page) {
    const url = `${BASE_URL}/search/movie`
    const queryParams = new URLSearchParams({
      api_key: API_KEY,
      language: 'en-US',
      include_adult: false,
      query: value,
      page,
    })
    const result = await fetch(`${url}?${queryParams}`)
    if (!result.ok) {
      throw new Error(`Failed to search movies:status ${result.status}`)
    }
    const body = await result.json()
    // console.log(body)
    return { elements: body.results, maxPage: body.total_pages }
  }

  async rateMovie(stars, movieId, guestToken) {
    const pathParams = { movieId }
    const queryParams = new URLSearchParams({ api_key: API_KEY, guest_session_id: guestToken })
    const url = `${BASE_URL}/movie/${pathParams.movieId}/rating?${queryParams}`
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ value: stars }),
    })
    if (!resp.ok) {
      throw new Error(`Failed to rate movie:status ${resp.status}`)
    }
    // const respStatusObj = await resp.json()
    // console.log({ movieId, ...respStatusObj })
  }

  async getRatedMovies(page, guestToken) {
    const pathParams = { guestToken }
    const queryParams = new URLSearchParams({
      api_key: API_KEY,
      language: 'en-US',
      sort_by: 'created_at.asc',
      page,
    })
    const url = `${BASE_URL}/guest_session/${pathParams.guestToken}/rated/movies?${queryParams}`
    const result = await fetch(url)
    if (!result.ok) {
      throw new Error(`Failed to get rated movies:status ${result.status}`)
    }
    const { results, total_pages } = await result.json()
    return { results, totalPagesRanked: total_pages }
  }
}
