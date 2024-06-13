import React, { Component } from "react";
import { Card } from 'antd';

class MoviesListItem extends Component {
    render() {
        const { title, posterPath } = this.props;
        return (
            <Card
                hoverable
                cover={<img alt={`${title} poster`} src={`https://image.tmdb.org/t/p/w500${posterPath}`} />}
            >
                <Card.Meta title={title} />
            </Card>
        );
    }
}

export default MoviesListItem;
