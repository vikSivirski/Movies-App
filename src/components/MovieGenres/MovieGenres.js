import React, { Component } from 'react';
import { Tag } from 'antd';
import 'antd/dist/antd';
import './MovieGenres.css';

class MovieGenres extends Component {
  render() {
    const genres = ['Action', 'Drama'];

    return (
      <div className="genres-container">
        {genres.map((genre, index) => (
          <Tag key={index} className="genre-tag">
            {genre}
          </Tag>
        ))}
      </div>
    );
  }
}

export default MovieGenres;