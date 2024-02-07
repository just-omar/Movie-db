import { Card, Rate, Spin } from 'antd'
import { format } from 'date-fns'
import React from 'react'

import './card.css'
import './media-card.css'
import Genres from '../genres/genres'

export default class CardMovie extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      starsCount: 0,
      isImageLoaded: false,
    }
    this.titleRef = React.createRef()
  }

  truncateText = (text, len = 130) => {
    if (text.length > len) {
      const lastSpaceIndex = text.lastIndexOf(' ', len)
      if (lastSpaceIndex === -1) {
        text = text.slice(0, len)
      } else {
        text = text.slice(0, lastSpaceIndex)
      }
      text = text.replace(/[.,\/#!$%\^&\*;:{}=\-_~()]/g, '')
      const lastWordIndex = text.lastIndexOf(' ')

      if (/[.,\/#!$%\^&\*;:{}=\-_~()]/.test(text.slice(-1))) {
        text = text.slice(0, lastWordIndex)
      }

      return text + '...'
    } else {
      return text
    }
  }

  translateDateToFormat(dateOfCreation) {
    if (typeof dateOfCreation === 'string' && dateOfCreation !== '') {
      const res = format(new Date(dateOfCreation), 'MMMM dd, yyyy')
      return res
    } else {
      return 'unknown'
    }
  }

  onLoadedImage = () => {
    this.setState({ isImageLoaded: true })
  }

  render() {
    const {
      name,
      description,
      dateOfCreation,
      imageAddress,
      genreIds,
      genresList,
      rating,
      movieId,
      ratingStars,
      rateMovie,
      guestToken,
    } = this.props
    let classNamesRating = 'rating'
    if (rating < 3) {
      classNamesRating += ' red-border'
    } else if (rating >= 3 && rating < 5) {
      classNamesRating += ' orange-border'
    } else if (rating >= 5 && rating < 7) {
      classNamesRating += ' yellow-border'
    } else if (rating >= 7) {
      classNamesRating += ' green-border'
    }
    let classNameSpin
    if (this.state.isImageLoaded) {
      classNameSpin = 'hidden'
    } else {
      classNameSpin = 'spin'
    }
    return (
      <Card className="movie-card">
        <div className="image-container">
          <Spin className={classNameSpin} />
          <img
            src={imageAddress ? `https://image.tmdb.org/t/p/w500${imageAddress}` : 'assets/errorImg.jpg'}
            alt="#"
            className="movie-poster"
            onLoad={this.onLoadedImage}
          />
        </div>

        <div className="card-info">
          <div className="title-container">
            <p className="title" ref={this.titleRef}>
              {name}
            </p>
            <div className={classNamesRating}>{rating.toFixed(1)}</div>
          </div>
          <p className="date-of-creation">{this.translateDateToFormat(dateOfCreation)}</p>
          <Genres genreIds={genreIds} genresList={genresList} />
          <p className="description">{this.truncateText(description)}</p>
          <Rate
            onChange={(value) => {
              this.setState({ starsCount: value })
              rateMovie(value, movieId, guestToken)
              // this.searchEngine.rateMovie(value, movieId)
            }}
            style={{ fontSize: 17 }}
            count={10}
            className="rate"
            value={this.state.starsCount || ratingStars}
            allowHalf={true}
            // allowClear
          />
        </div>
      </Card>
    )
  }
}
