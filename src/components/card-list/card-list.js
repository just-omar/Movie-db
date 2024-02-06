import React from 'react'

import CardMovie from '../card/card'
import './card-list.css'
import { Consumer } from '../context/context'
import SearchEngine from '../../services/searchEngine'

export default class CardList extends React.Component {
  searchEngine = new SearchEngine()

  render() {
    const { data } = this.props
    const { rateMovie } = this.searchEngine // Destructuring rateMovie from searchEngine

    return (
      <Consumer>
        {(value) => (
          <div className="card-list">
            {data.map((el) => (
              <CardMovie
                key={el.id}
                name={el.title}
                description={el.overview}
                dateOfCreation={el.release_date}
                imageAddress={el.poster_path}
                genreIds={el.genre_ids}
                genresList={value}
                rating={el.vote_average}
                movieId={el.id}
                ratingStars={el.rating}
                rateMovie={rateMovie}
              />
            ))}
          </div>
        )}
      </Consumer>
    )
  }
}
