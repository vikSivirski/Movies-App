import React, { Component } from "react";
import { Card, Row, Col, } from 'antd';
import 'antd/dist/antd';

class MoviesListItem extends Component {
    render() {
        const { title, posterPath, description } = this.props;
        return (
            <Card
            hoverable
            style={{ marginBottom: 20, borderRadius: 0 }} // Убираем border-radius у карточки
            bodyStyle={{ padding: 0 }} // Убираем внутренние отступы у карточки
        >
                <Row>
                    <Col span={8}>
                        <img 
                            alt={`${title} poster`} 
                            src={`https://image.tmdb.org/t/p/w500${posterPath}`} 
                            style={{ width: '100%', borderRadius: 0 }}
                        />
                    </Col>
                    <Col span={16} style={{ paddingLeft: 20 }}>
                        <h2>{title}</h2>
                        <p>{description}</p>
                    </Col>
                </Row>
            </Card>
        );
    }
}

export default MoviesListItem;
