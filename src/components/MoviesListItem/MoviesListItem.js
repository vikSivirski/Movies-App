import React, { Component } from "react";
import { Card, Row, Col, } from 'antd';
import 'antd/dist/antd';
import { format } from 'date-fns'; 
import MovieGenres from "../MovieGenres";

import './MoviesListItem.css'

class MoviesListItem extends Component {
    truncateText = (text, maxLength) => {
        if (text.length <= maxLength) return text;
        const truncatedText = text.substring(0, maxLength);
        const lastSpaceIndex = truncatedText.lastIndexOf(' ');
        if (lastSpaceIndex === -1) return truncatedText + '...';
        return truncatedText.substring(0, lastSpaceIndex) + '...';
    };

    render() {
        const { title, posterPath, description, releaseDate } = this.props;
        const truncatedDescription = this.truncateText(description, 200);
        const formattedDate = format(new Date(releaseDate), 'dd MMM yyyy'); 

        return (
            <Card
            hoverable
            className="card-container"
            style={{ marginBottom: 20, borderRadius: 0 }}
            bodyStyle={{ padding: 0 }} 
        >
                <Row>
                    <Col span={8}>
                        <img 
                            alt={`${title} poster`} 
                            src={`https://image.tmdb.org/t/p/w500${posterPath}`} 
                            style={{ width: '100%', borderRadius: 0 }}
                        />
                    </Col>
                    <Col span={16} style={{ paddingLeft: 20, paddingTop: 10}}>
                        <h2 className="film-title">{title}</h2>
                        <p className="release-date">{formattedDate}</p>
                        <MovieGenres/>
                        <p className="description">{truncatedDescription}</p>
                    </Col>
                </Row>
            </Card>
        );
    }
}

export default MoviesListItem;
