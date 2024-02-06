import React from 'react'
import { debounce } from 'lodash'

import './search-form.css'

export default class SearchForm extends React.Component {
  render() {
    return (
      <form
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
          }
        }}
      >
        <input
          placeholder="Type to search..."
          className="search-input"
          onChange={debounce(this.props.onInputChange, 400)}
        />
      </form>
    )
  }
}
