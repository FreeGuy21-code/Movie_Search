import React, { useState, useEffect } from "react";
import "./index.css";

const API_KEY = "a6f36113"; 

const App = () => {
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("");
  const [genre, setGenre] = useState("");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.body.className = theme; 
  }, [theme]);
//
  useEffect(() => {
    if (search.length > 2) fetchMovies();
  }, [search, year, genre]);

  const fetchMovies = async () => {
    let url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${search}`;
    if (year) url += `&y=${year}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.Search) {
      let filtered = data.Search;

      if (genre) {
        filtered = await Promise.all(
          filtered.map(async (movie) => {
            const detailRes = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`);
            const detail = await detailRes.json();
            return detail.Genre.includes(genre) ? movie : null;
          })
        );
        filtered = filtered.filter(Boolean);
      }

      setMovies(filtered);
    } else {
      setMovies([]);
    }
  };
//
  const fetchMovieDetails = async (id) => {
    const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`);
    const data = await res.json();
    setSelectedMovie(data);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };
//
  return (
    <div className="app">
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === "light" ? "🌙 Dark" : "☀️ Light"}
      </button>

      <h1 className="title">🎬 Movie Explorer</h1>

      <div className="filter-container">
        <input
          type="text"
          placeholder="Enter movie name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="number"
          placeholder="Year (e.g., 2021)"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <select value={genre} onChange={(e) => setGenre(e.target.value)}>
          <option value="">All Genres</option>
          <option value="Action">Action</option>
          <option value="Comedy">Comedy</option>
          <option value="Drama">Drama</option>
          <option value="Horror">Horror</option>
          <option value="Sci-Fi">Sci-Fi</option>
        </select>
      </div>
//
      <div className="movie-grid">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.imdbID} className="movie-card" onClick={() => fetchMovieDetails(movie.imdbID)}>
              <img src={movie.Poster} alt={movie.Title} />
              <h3>{movie.Title} ({movie.Year})</h3>
            </div>
          ))
        ) : (
          <p>No movies found.</p>
        )}
      </div>

      {selectedMovie && (
        <div className="movie-popup">
          <div className="popup-content">
            <span className="close-btn" onClick={() => setSelectedMovie(null)}>✖</span>
            <h2>{selectedMovie.Title} ({selectedMovie.Year})</h2>
            <img src={selectedMovie.Poster} alt={selectedMovie.Title} />
            <p><strong>⭐ Rating:</strong> {selectedMovie.imdbRating}</p>
            <p><strong>🎭 Genre:</strong> {selectedMovie.Genre}</p>
            <p><strong>📖 Plot:</strong> {selectedMovie.Plot}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
