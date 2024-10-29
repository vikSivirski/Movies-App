import React from "react";
import { Tabs, Spin, Alert, Input, Pagination } from "antd";
import debounce from "lodash/debounce";

import { SessionContext } from "../../context/SessionContext";
import "./App.css";
import MoviesList from "../MoviesList";

const { TabPane } = Tabs;

class App extends React.Component {
  static contextType = SessionContext;

  constructor(props) {
    super(props);
    const error = localStorage.getItem("error");
    this.state = {
      movies: [],
      ratedMovies: [],
      loading: true,
      error: error ? error : null,
      online: navigator.onLine,
      searchQuery: "",
      currentPage: 1,
      totalResults: 0,
    };

    this.handleSearch = debounce(this.handleSearch, 300);
  }

  componentDidMount() {
    window.addEventListener("online", this.handleOnline);
    window.addEventListener("offline", this.handleOffline);

    if (this.state.online) {
      this.fetchMovies();
    } else {
      this.setState({ loading: false });
    }
  }

  componentWillUnmount() {
    window.removeEventListener("online", this.handleOnline);
    window.removeEventListener("offline", this.handleOffline);
  }

  handleOnline = () => {
    this.setState({ online: true, error: null }, this.fetchMovies);
    localStorage.removeItem("error");
  };

  handleOffline = () => {
    const error = "No internet connection";
    this.setState({ online: false, error, loading: false });
    localStorage.setItem("error", error);
  };

  fetchMovies = (query = "", page = 1) => {
    this.setState({ loading: true, error: null });

    const endpoint = query
      ? `https://api.themoviedb.org/3/search/movie?api_key=8490441a780d696323472e0a8e97e0ca&query=${query}&page=${page}`
      : `https://api.themoviedb.org/3/discover/movie?api_key=8490441a780d696323472e0a8e97e0ca&page=${page}`;

    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        if (data.results) {
          const { guestSessionId } = this.context;

          fetch(
            `https://api.themoviedb.org/3/guest_session/${guestSessionId}/rated/movies?api_key=8490441a780d696323472e0a8e97e0ca`,
          )
            .then((res) => res.json())
            .then((ratedData) => {
              const ratedMovies = ratedData.results || [];

              const moviesWithRatings = data.results.map((movie) => {
                const ratedMovie = ratedMovies.find((rm) => rm.id === movie.id);
                return {
                  ...movie,
                  userRating: ratedMovie ? ratedMovie.rating : 0,
                };
              });

              this.setState({
                movies: moviesWithRatings,
                loading: false,
                error: null,
                totalResults: data.total_results,
                currentPage: page,
              });
            })
            .catch((error) => {
              console.error("Error fetching rated movies:", error);
              this.setState({
                loading: false,
                error: "Error fetching rated movies",
              });
            });
        } else {
          this.setState({
            movies: [],
            loading: false,
            error: "No results found",
            totalResults: 0,
            currentPage: page,
          });
        }
      })
      .catch((error) => {
        const errorMessage = error.message || "Network error";
        this.setState({
          error: errorMessage,
          loading: false,
        });
        localStorage.setItem("error", errorMessage);
      });
  };

  fetchRatedMovies = () => {
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
            error: "No rated movies found",
          });
        }
      })
      .catch((error) => {
        const errorMessage = error.message || "Network error";
        this.setState({
          error: errorMessage,
          loading: false,
        });
      });
  };

  handleSearchInput = (event) => {
    const query = event.target.value;
    this.setState({ searchQuery: query });
    this.handleSearch(query);
  };

  handleSearch = (query) => {
    this.fetchMovies(query, 1);
  };

  handlePageChange = (page) => {
    const { searchQuery } = this.state;
    this.fetchMovies(searchQuery, page);
  };

  render() {
    const { loading, error, movies, ratedMovies, totalResults, currentPage } =
      this.state;

    return (
      <div className="container">
        <Tabs
          defaultActiveKey="search"
          onChange={(key) => key === "rated" && this.fetchRatedMovies()}
          className="centered-tabs"
        >
          <TabPane tab="Search" key="search">
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
                <MoviesList movies={movies} />
                <Pagination
                  current={currentPage}
                  total={totalResults}
                  pageSize={20}
                  onChange={this.handlePageChange}
                  style={{ marginTop: 20, textAlign: "center" }}
                />
              </>
            )}
          </TabPane>
          <TabPane tab="Rated" key="rated">
            {" "}
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
