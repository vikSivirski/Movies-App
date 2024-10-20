import React, { Component } from "react";
import { Card, Row, Col, Rate } from 'antd';
import 'antd/dist/antd';
import { format, isValid, parseISO } from 'date-fns'; 
import MovieGenres from "../MovieGenres";
import RatingCircle from "../RatingCircle/RatingCircle";
import { SessionContext } from '../../context/SessionContext';

import './MoviesListItem.css';

class MoviesListItem extends Component {
    static contextType = SessionContext;

    constructor(props) {
        super(props);
        this.state = {
            rating: this.props.userRating || 0, // Начальное значение рейтинга
            genres: [],
        };
    }

    componentDidMount() {
        this.fetchMovieGenres();
    }

    fetchMovieGenres = async () => {
        const { movieId } = this.props;
        const apiKey = '8490441a780d696323472e0a8e97e0ca';

        try {
            const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`);
            const data = await response.json();
            if (data.genres) {
                this.setState({ genres: data.genres }); // Сохраняем жанры в состоянии
            }
        } catch (error) {
            console.error('Error fetching movie genres:', error);
        }
    };

    handleRateChange = (value) => {
        const { movieId } = this.props;
        const { guestSessionId } = this.context;

        this.setState({ rating: value });

        // Делаем запрос к TMDB для сохранения рейтинга
        fetch(`https://api.themoviedb.org/3/movie/${movieId}/rating?api_key=8490441a780d696323472e0a8e97e0ca&guest_session_id=${guestSessionId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ value }), // Рейтинг в теле запроса
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                console.log('Rating submitted successfully:', data);
            } else {
                console.error('Error submitting rating:', data);
            }
        })
        .catch((error) => {
            console.error('Error during rating submission:', error);
        });
    };

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
        
        let formattedDate = 'Unknown release date';
        const date = parseISO(releaseDate);
        if (isValid(date)) {
            formattedDate = format(date, 'dd MMM yyyy');
        }

        const { rating, genres } = this.state;

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
                    <Col span={16} style={{ paddingLeft: 20, paddingTop: 10 }}>
                        <h2 className="film-title">{title}</h2>
                        <p className="release-date">{formattedDate}</p>
                        <MovieGenres genres={genres} />
                        <p className="description">{truncatedDescription}</p>
                        <Rate 
                            value={rating} 
                            onChange={this.handleRateChange} 
                            count={10}
                            style={{ marginTop: 10 }} 
                        />
                    </Col>
                </Row>
                <RatingCircle rating={rating} />
            </Card>
        );
    }
}

export default MoviesListItem;
