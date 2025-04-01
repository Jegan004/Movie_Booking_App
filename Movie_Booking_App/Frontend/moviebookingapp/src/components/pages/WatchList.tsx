import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import {
  WatchlistContainer,
  MovieGrid,
  MovieCard,
  MovieImage,
  MovieOverlay,
  MovieTitle,
  MovieGenre,
  ButtonsContainer,
  ActionButton,
  EmptyMessage,
  Title,
} from "../styles/WatchListstyles";

interface GenreModel {
  Name: string;
}

export interface MovieModel {
  MovieId: string;
  MovieTitle: string;
  MovieImage: string;
  Genres: GenreModel[];
}

const WatchlistPage: React.FC = () => {
  const [watchlistMovies, setWatchlistMovies] = useState<MovieModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const navigate = useNavigate();
  const location =useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const userData = JSON.parse(atob(token.split(".")[1]));
        setIsLoggedIn(true);
        // localStorage.setItem("userId", userData.userId);
        setUserId(userData.userId);
        fetchWatchlist(userData.userId);
      } catch (error) {
        console.error("Invalid token format:", error);
      }
    }
  }, []);

  const fetchWatchlist = async (userId) => {
    
    if (userId.length<1) return;

    try {
      const response = await axios.get(`http://localhost:5233/api/watchlist/${userId}`);
      if (response.data && Array.isArray(response.data)) {
        setWatchlistMovies(response.data);
      } else {
        console.error("Unexpected response structure", response.data);
        setError("Invalid watchlist data.");
      }
    } catch (error) {
      console.error("Failed to load watchlist", error);
      setError("Failed to load watchlist.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWatchlist = async (movieId: string) => {
    
    if (userId.length<1 || !movieId) {
      alert("Missing user or movie information.");
      return;
    }

    try {
      await axios.delete(`http://localhost:5233/api/watchlist/${userId}/${movieId}`);
      setWatchlistMovies((prev) => prev.filter((movie) => movie.MovieId !== movieId));
    } catch (error: any) {
      console.error("Failed to remove from watchlist:", error);
      alert(`Failed to remove movie. Error: ${error.message}`);
    }
  };



  const handleBookNow = (movie: MovieModel) => {
    if (!isLoggedIn) {
      alert("Please log in to book a movie.");
      navigate("/login");
      return;
    }
    
    navigate("/booking", { 
      state: { 
        movie: {
          Id: movie.MovieId,
          Title: movie.MovieTitle,         
          ImageUrl: movie.MovieImage,   
          Genres: movie.Genres,       
        }
      } 
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <WatchlistContainer>
      <Title>Your Watchlist</Title>
      {watchlistMovies.length > 0 ? (
        <MovieGrid>
          {watchlistMovies.map((movie) => (
            <MovieCard key={movie.MovieId}>
              <MovieImage
                src={`data:image/jpeg;base64,${movie.MovieImage}`}
                alt={movie.MovieTitle}
              />
              <MovieOverlay>
                <MovieTitle>{movie.MovieTitle}</MovieTitle>
                <MovieGenre>{movie.Genres?.map((genre) => genre.Name).join(", ")}</MovieGenre>
                <ButtonsContainer>
                  <ActionButton onClick={() => handleBookNow(movie)}>Book Now</ActionButton>
                  <ActionButton onClick={() => handleRemoveFromWatchlist(movie.MovieId)}>Remove</ActionButton>
                </ButtonsContainer>
              </MovieOverlay>
            </MovieCard>
          ))}
        </MovieGrid>
      ) : (
        <EmptyMessage>No movies in your watchlist.</EmptyMessage>
      )}
    </WatchlistContainer>
  );
};

export default WatchlistPage;
