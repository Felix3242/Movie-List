import MovieCard from "../components/MovieCard";
import { useState, useEffect } from "react";
import { searchMovies, getPopularMovies } from "../services/api";
import "../css/Home.css";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load popular movies on mount
  useEffect(() => {
    const loadPopularMovies = async () => {
      try {
        const popularMovies = await getPopularMovies();
        setMovies(popularMovies);
      } catch (err) {
        setError("Failed to load movies...");
      } finally {
        setLoading(false);
      }
    };
    loadPopularMovies();
  }, []);

  // Dynamic search as user types (debounced)
  useEffect(() => {
    if (!searchQuery.trim()) {
      // If search is empty, show popular movies again
      setLoading(true);
      getPopularMovies()
        .then(setMovies)
        .catch(() => setError("Failed to load movies..."))
        .finally(() => setLoading(false));
      return;
    }

    const delayDebounce = setTimeout(() => {
      setLoading(true);
      searchMovies(searchQuery)
        .then(setMovies)
        .catch(() => setError("Failed to search movies..."))
        .finally(() => setLoading(false));
    }, 400); // 400ms debounce

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  return (
    <div className="home">
      <form className="search-form" onSubmit={e => e.preventDefault()}>
        <input
          type="text"
          placeholder="Search for movies..."
          className="search-input"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="search-button" disabled>
          Search
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="movies-grid">
          {movies.map((movie) => (
            <MovieCard movie={movie} key={movie.id} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;