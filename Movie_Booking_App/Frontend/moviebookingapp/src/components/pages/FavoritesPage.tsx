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

const FavoritesPage: React.FC = () => {
  const [favoritesMovies, setFavoritesMovies] = useState<MovieModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  // const navigate = useNavigate();
  // const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token != null) {
      try {
        const userData = JSON.parse(atob(token.split(".")[1]));
        setIsLoggedIn(true);
        setUserId(userData.userId);        
        fetchFavorites(userData.userId);
      } catch (error) {
        console.error("Invalid token format:", error);
      }
    }
    else {
      console.log("error");
      
    }
  }, []);

  const fetchFavorites = async (userId) => {
    if (userId.length<1) return;

    try {
      const response = await axios.get(`http://localhost:5233/api/favorites/${userId}`);
      if (response.data && Array.isArray(response.data)) {
        //console.log("200 from getfavs");
        
        setFavoritesMovies(response.data);
        setLoading(false);
      } else {
        console.error("Unexpected response structure", response.data);
        setError("Invalid favorites data.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Failed to load favorites", error);
      setError("Failed to load favorites.");
    } finally {
     // console.log("finally block");
      setLoading(false);
    }
  };
  const handleRemoveFromFavorites = async (movieId: string) => {

    if (userId.length< 1 || !movieId) {
      alert("Missing user or movie information.");
      return;
    }

    try {
      await axios.delete(`http://localhost:5233/api/favorites/${userId}/${movieId}`);
      setFavoritesMovies((prev) => prev.filter((movie) => movie.MovieId !== movieId));
    } catch (error: any) {
      console.error("Failed to remove from favorites:", error);
      alert(`Failed to remove movie. Error: ${error.message}`);
    }
  };

  if (error) return <div>{error}</div>;

  //console.log(favoritesMovies);
  

  return (
    <>
    {
      loading ? <div>Loading...</div> :
      <WatchlistContainer>
      <Title>Your Favorite Movies</Title>
      {favoritesMovies.length > 0 ? (
        <MovieGrid>
          {favoritesMovies.map((movie) => (
            <MovieCard key={movie.MovieId}>
              <MovieImage
                src={`data:image/jpeg;base64,${movie.MovieImage}`}
                alt={movie.MovieTitle}
              />
              <MovieOverlay>
                <MovieTitle>{movie.MovieTitle}</MovieTitle>
                <MovieGenre>{movie.Genres?.map((genre) => genre.Name).join(", ")}</MovieGenre>
                <ButtonsContainer>
                  <ActionButton onClick={() => handleRemoveFromFavorites(movie.MovieId)}>Remove from Favorites</ActionButton>
                </ButtonsContainer>
              </MovieOverlay>
            </MovieCard>
          ))}
        </MovieGrid>
      ) : (
        <EmptyMessage>No movies in your favorites.</EmptyMessage>
      )}
    </WatchlistContainer>
    }
    </>
  );
};

export default FavoritesPage;
