import React, { Component } from "react";
import MoviesListItem from "../MoviesListItem";

class MoviesList extends Component {
    render() {
        const { movies } = this.props;
        return (
            <ul>
                {movies.map(({ id, title, poster_path }) => (
                    <MoviesListItem
                        key={id}
                        title={title}
                        posterPath={poster_path}
                    />
                ))}
            </ul>
        );
    }
}

export default MoviesList;