import React from 'react';
import './RatingCircle.css'; // Стиль для окружности

const RatingCircle = ({ rating }) => {
    const getBorderColor = (rating) => {
        if (rating < 3) return '#E90000';
        if (rating < 5) return '#E97E00';
        if (rating < 7) return '#E9D100';
        return '#66E900';
    };

	const borderColor = getBorderColor(rating);

	return (
		<div className="rating-circle" style={{ borderColor }}>
			<span className="rating-value">{rating.toFixed(1)}</span>
		</div>
	);
};

export default RatingCircle;