import React from 'react';
import './App.css';
import MoviesList from '../MoviesList';
import { Spin, Alert } from 'antd'; // Импортируем Spin и Alert из antd

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      loading: true,
      error: null, // Добавляем состояние для ошибок
      online: navigator.onLine, // Добавляем состояние для отслеживания сети
    };
  }

  componentDidMount() {
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);

    this.fetchMovies();
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
  }

  handleOnline = () => {
    this.setState({ online: true, error: null }, this.fetchMovies);
  };

  handleOffline = () => {
    this.setState({ online: false, error: 'No internet connection', loading: false });
  };

  fetchMovies = () => {
    if (!navigator.onLine) {
      this.setState({
        error: 'No internet connection',
        loading: false,
      });
      return;
    }

    this.setState({ loading: true, error: null });

    this.props.filmBase
      .then((data) => {
        this.setState({
          movies: data,
          loading: false,
          error: null, // Сбрасываем ошибку, если данные успешно загружены
        });
      })
      .catch((error) => {
        this.setState({
          error: error.message || 'Network error',
          loading: false,
        });
      });
  };

  render() {
    const { loading, error, movies } = this.state;

    if (loading) {
      return <Spin size="large" style={{ display: 'block', margin: 'auto' }} />;
    }

    return (
      <div className="container">
        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 20 }}
          />
        )}
        <MoviesList movies={movies} />
      </div>
    );
  }
}

export default App;