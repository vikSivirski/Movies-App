import React, { Component } from "react";
import MoviesListItem from "../MoviesListItem/MoviesListItem";
import { List } from "antd"; // Импортируем List из antd

class MoviesList extends Component {
    render() {
        const { movies } = this.props;
        return (
            <List
                grid={{ gutter: 16, column: 4 }}
                dataSource={movies}
                renderItem={movie => (
                    <List.Item>
                        <MoviesListItem
                            key={movie.id}
                            title={movie.title}
                            posterPath={movie.poster_path}
                            description={movie.overview}
                        />
                    </List.Item>
                )}
            />
        );
    }
}

export default MoviesList;
