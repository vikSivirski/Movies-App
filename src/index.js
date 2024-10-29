import React from "react";
import ReactDOM from "react-dom/client";

import App from "./components/App/App";
import SessionProvider from "./context/SessionContext";
import "antd/lib/style/index";

import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

class MovieService {
  _apiBase =
    "https://api.themoviedb.org/3/discover/movie?api_key=8490441a780d696323472e0a8e97e0ca";

  async getResource() {
    const res = await fetch(this._apiBase);
    const body = await res.json();
    return body;
  }

  async getAllMovies() {
    const res = await this.getResource();
    return res.results;
  }
}

const movie = new MovieService();

const filmBase = movie.getAllMovies().then((res) => {
  console.log(res);
  return res;
});

root.render(
  <React.StrictMode>
    <SessionProvider>
      <App filmBase={filmBase} />
    </SessionProvider>
  </React.StrictMode>,
);
