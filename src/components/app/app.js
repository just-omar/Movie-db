import React from 'react'
import { Spin, Pagination, Tabs, Alert } from 'antd'

import CardList from '../card-list/card-list'
import SearchEngine from '../../services/searchEngine'
import SearchForm from '../search-form/search-form'
import { Provider } from '../../context/context'

import './app.css'

export default class App extends React.Component {
  searchEngine = new SearchEngine()

  state = {
    elements: [],
    elementsRanked: [],
    page: 1,
    pageRanked: 1,
    totalPages: 50,
    totalPagesRanked: 10,
    isLoading: true,
    error: false,
    errorMessage: '',
    value: '',
    genresList: [],
    guestToken: '',
  }

  componentDidMount() {
    try {
      this.updateElementsDefault(1)
      this.searchEngine.getGuestToken().then((res) => {
        // console.log(res)
        this.setState({ guestToken: res })
      })

      this.searchEngine.getGenreList().then((res) => {
        this.setState({
          genresList: res,
        })
      })
    } catch (err) {
      this.setState({ error: true, errorMessage: err.message })
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    try {
      if (prevState.value !== this.state.value) {
        this.updateElementsBySearch(this.state.value, 1)
        this.setState({
          page: 1,
        })
      }
      if (prevState.page !== this.state.page && this.state.value !== '') {
        this.updateElementsBySearch(this.state.value, this.state.page)
      }
      if (prevState.page !== this.state.page && this.state.value.length === 0) {
        this.updateElementsDefault(this.state.page)
      }
      if (prevState.value !== this.state.value && this.state.value.length === 0) {
        this.updateElementsDefault(1)
        this.setState({ page: 1 })
      }
      if (prevState.pageRanked !== this.state.pageRanked) {
        this.getRankedList()
      }
    } catch (err) {
      this.setState({ error: true, errorMessage: err.message })
    }
  }

  async updateElementsBySearch(value, page) {
    try {
      await this.searchEngine.getFilmBySearching(value, page).then((res) => {
        this.setState({ elements: res.elements, isLoading: false, totalPages: res.maxPage })
      })
    } catch (err) {
      this.setState({ error: true, errorMessage: err.message })
    }
  }

  async updateElementsDefault(page) {
    try {
      const res = await this.searchEngine.getResource(page)
      this.setState({ elements: res.elements, isLoading: false, totalPages: res.maxPage })
    } catch (err) {
      this.setState({ error: true, errorMessage: err.message })
    }
  }

  handleClose = () => {
    this.setState({ error: false })
  }
  onInputChange = (e) => {
    this.setState({
      value: e.target.value,
    })
  }

  onChangingPage(e) {
    this.setState({
      page: e,
    })
  }

  onChangingPageRanked(e) {
    this.setState({
      pageRanked: e,
    })
  }

  getRankedList = async () => {
    try {
      const { pageRanked, guestToken } = this.state
      const res = await this.searchEngine.getRatedMovies(pageRanked, guestToken)
      // console.log(res)
      this.setState({ elementsRanked: res.results, totalPagesRanked: res.totalPagesRanked * 10 })
    } catch (err) {
      this.setState({ error: true, errorMessage: err.message })
    }
  }

  render() {
    const loadedPage = this.state.isLoading ? (
      <Spin size="large" tip="loading..." className="spin">
        <div />
      </Spin>
    ) : (
      <React.Fragment>
        <SearchForm value={this.state.value} onInputChange={this.onInputChange} />
        <CardList data={this.state.elements} />
        <Pagination
          className="pagination"
          defaultCurrent={1}
          total={this.state.totalPages}
          current={this.state.page}
          onChange={(e) => this.onChangingPage(e)}
        />
      </React.Fragment>
    )

    let tabsElements = [
      {
        key: 1,
        label: 'Search',
        children: loadedPage,
      },
      {
        key: 2,
        label: 'Rated',
        children: (
          <React.Fragment>
            <CardList data={this.state.elementsRanked} />
            <Pagination
              className="pagination"
              defaultCurrent={1}
              total={this.state.totalPagesRanked}
              current={this.state.pageRanked}
              onChange={(e) => this.onChangingPageRanked(e)}
            />
          </React.Fragment>
        ),
      },
    ]

    return (
      <div className="app">
        <div className="container">
          {!this.state.error ? (
            <Provider value={{ genresList: this.state.genresList, guestToken: this.state.guestToken }}>
              <Tabs
                defaultActiveKey="1"
                items={tabsElements}
                onChange={async (e) => {
                  if (e == 2) {
                    await this.getRankedList()
                  }
                }}
                className="tabs"
                destroyInactiveTabPane={true}
              />
            </Provider>
          ) : (
            <Alert message={this.state.errorMessage} type="error" closable afterClose={this.handleClose} />
          )}
        </div>
      </div>
    )
  }
}
