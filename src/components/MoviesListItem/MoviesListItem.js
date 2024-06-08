import React, {Component} from "react";

class MoviesListItem extends Component {
    render() {
      const { title, posterPath } = this.props;
      return (
        <li>
          <img 
            src={`https://image.tmdb.org/t/p/w500${posterPath}`} 
            alt={`${title} poster`} 
            style={{ width: '100px', marginRight: '10px' }}
          />
          {title}
        </li>
      );
    }
}

export default MoviesListItem;