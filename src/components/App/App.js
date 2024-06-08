import React from 'react';
import './App.css';

import MoviesList from '../MoviesList';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      loading: true,
    };
  }

  componentDidMount() {
    this.props.filmBase.then((data) => {
      this.setState({
        movies: data,
        loading: false,
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        <h1>Movies</h1>
        <MoviesList movies={this.state.movies} />
      </div>
    );
  }
}

export default App;
