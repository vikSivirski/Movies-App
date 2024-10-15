import React from 'react';
import { SessionContext } from '../../context/SessionContext';
import './App.css';
import MoviesList from '../MoviesList';
import { Tabs, Spin, Alert, Input, Pagination } from 'antd'; // Импортируем необходимые компоненты из antd
import debounce from 'lodash/debounce';

const { TabPane } = Tabs;

class App extends React.Component {
  static contextType = SessionContext;

  constructor(props) {
    super(props);
    const error = localStorage.getItem('error');
    this.state = {
      movies: [],
      ratedMovies: [],
      loading: true,
      error: error ? error : null,
      online: navigator.onLine,
      searchQuery: '', // Добавляем состояние для строки поиска
      currentPage: 1, // Добавляем состояние для текущей страницы
      totalResults: 0, // Добавляем состояние для общего количества результатов
    };

    this.handleSearch = debounce(this.handleSearch, 300); // Используем debounce для метода handleSearch
  }

  componentDidMount() {
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);

    if (this.state.online) {
      this.fetchMovies();
    } else {
      this.setState({ loading: false });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
  }

  handleOnline = () => {
    this.setState({ online: true, error: null }, this.fetchMovies);
    localStorage.removeItem('error');
  };

  handleOffline = () => {
    const error = 'No internet connection';
    this.setState({ online: false, error, loading: false });
    localStorage.setItem('error', error);
  };

  fetchMovies = (query = '', page = 1) => {
    this.setState({ loading: true, error: null });

    const endpoint = query
      ? `https://api.themoviedb.org/3/search/movie?api_key=8490441a780d696323472e0a8e97e0ca&query=${query}&page=${page}`
      : `https://api.themoviedb.org/3/discover/movie?api_key=8490441a780d696323472e0a8e97e0ca&page=${page}`;

    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        if (data.results) {
          this.setState({
            movies: data.results,
            loading: false,
            error: null,
            totalResults: data.total_results,
            currentPage: page,
          });
        } else {
          this.setState({
            movies: [],
            loading: false,
            error: 'No results found',
            totalResults: 0,
            currentPage: page,
          });
        }
      })
      .catch((error) => {
        const errorMessage = error.message || 'Network error';
        this.setState({
          error: errorMessage,
          loading: false,
        });
        localStorage.setItem('error', errorMessage);
      });
  };

  fetchRatedMovies = () => { // Добавлено: Метод для получения оцененных фильмов
    const { guestSessionId } = this.context;

    this.setState({ loading: true, error: null });

    const endpoint = `https://api.themoviedb.org/3/guest_session/${guestSessionId}/rated/movies?api_key=8490441a780d696323472e0a8e97e0ca`;

    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        if (data.results) {
          const ratedMoviesWithRatings = data.results.map((movie) => ({
            ...movie,
            userRating: movie.rating,
          }));

          this.setState({
            ratedMovies: ratedMoviesWithRatings,
            loading: false,
            error: null,
          });
        } else {
          this.setState({
            ratedMovies: [],
            loading: false,
            error: 'No rated movies found',
          });
        }
      })
      .catch((error) => {
        const errorMessage = error.message || 'Network error';
        this.setState({
          error: errorMessage,
          loading: false,
        });
      });
  };

  handleSearchInput = (event) => {
    const query = event.target.value;
    this.setState({ searchQuery: query });
    this.handleSearch(query); // Вызываем debounce функцию
  };

  handleSearch = (query) => {
    this.fetchMovies(query, 1);
  };

  handlePageChange = (page) => {
    const { searchQuery } = this.state;
    this.fetchMovies(searchQuery, page);
  };

  render() {
    const { loading, error, movies, ratedMovies, totalResults, currentPage } = this.state;
    const { guestSessionId } = this.context;

    return (
      <div className='container'>
        <p>Guest Session ID: {guestSessionId}</p>
        <Tabs
          defaultActiveKey="search"
          onChange={(key) => key === 'rated' && this.fetchRatedMovies()} // Добавлено: При переключении на вкладку Rated загружаем оцененные фильмы
        >
          <TabPane tab="Search" key="search"> {/* Добавлено: Вкладка Search */}
            <Input
              placeholder="Search for a movie..."
              onChange={this.handleSearchInput}
              style={{ marginBottom: 20 }}
            />
            {error && (
              <Alert
                message="Error"
                description={error}
                type="error"
                showIcon
                style={{ marginBottom: 20 }}
              />
            )}
            {loading ? (
              <div className="loading-container">
                <Spin size="large" />
              </div>
            ) : (
              <>
                <MoviesList 
                  movies={movies}
                />
                <Pagination
                  current={currentPage}
                  total={totalResults}
                  pageSize={20}
                  onChange={this.handlePageChange}
                  style={{ marginTop: 20, textAlign: 'center' }}
                />
              </>
            )}
          </TabPane>
          <TabPane tab="Rated" key="rated"> {/* Добавлено: Вкладка Rated */}
            {loading ? (
              <div className="loading-container">
                <Spin size="large" />
              </div>
            ) : (
              <>
                <MoviesList movies={ratedMovies} />
              </>
            )}
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

App.contextType = SessionContext;

export default App;
