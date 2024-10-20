import React, { Component } from 'react';
import { Tag } from 'antd';
import 'antd/dist/antd';
import './MovieGenres.css';

class MovieGenres extends Component {
  render() {
    const { genres } = this.props; // Получаем жанры из пропсов

    return (
      <div className="genres-container">
        {genres.map((genre) => (
          <Tag key={genre.id} className="genre-tag">
            {genre.name} {/* Используем название жанра */}
          </Tag>
        ))}
      </div>
    );
  }
}

export default MovieGenres;