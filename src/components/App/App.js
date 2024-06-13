import React from 'react';
import './App.css';
import MoviesList from '../MoviesList';
import { Spin } from 'antd'; // Импортируем Spin для загрузки

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
      return <Spin size="large" style={{ display: 'block', margin: 'auto' }} />; // Используем Spin вместо простого текста
    }

    return (
      <div style={{ padding: 20 }}>
        <h1>Movies</h1>
        <MoviesList movies={this.state.movies} />
      </div>
    );
  }
}

export default App;