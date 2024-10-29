import React, { Component } from "react";
import { List } from "antd";

import MoviesListItem from "../MoviesListItem/MoviesListItem";

class MoviesList extends Component {
  render() {
    const { movies } = this.props;
    return (
      <List
        grid={{ gutter: 16, column: 2 }}
        dataSource={movies}
        renderItem={(movie) => (
          <List.Item>
            <MoviesListItem
              key={movie.id}
              movieId={movie.id}
              title={movie.title}
              posterPath={movie.poster_path}
              description={movie.overview}
              releaseDate={movie.release_date}
              userRating={movie.userRating}
            />
          </List.Item>
        )}
      />
    );
  }
}

export default MoviesList;
