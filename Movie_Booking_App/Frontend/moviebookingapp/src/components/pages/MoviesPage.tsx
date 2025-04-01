import React, { useEffect, useState } from "react";
import {
  MoviesContainer,
  MovieCard,
  MovieImage,
  MovieImage1,
  MovieInfo,
  MovieTitle,
  MovieGenre,
  Button,
  GenreButtonContainer,
  MovieDetailsModal,
  ModalOverlay,
  CloseButton,
  MovieDescription,
} from "../styles/Moviestyles";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import save from "../../assets/save.png";
import unsave from "../../assets/unsave.png";
import like from "../../assets/like.png";
import dislike from "../../assets/dislike.png";

interface GenreModel {
  Name: string;
}

interface MovieModel {
  Id: string;
  Title: string;
  ImageUrl: string;
  Genres: GenreModel[];
  Description: string;
  rating: string;
}

const MoviesPage: React.FC = () => {
  const [movies, setMovies] = useState<MovieModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<MovieModel | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string>("");
  const [watchlist, setWatchlist] = useState<Set<string>>(new Set());
  const [favourites, setFavourites] = useState<Set<string>>(new Set()); 

  const navigate = useNavigate();
  const Genres = ["All", "Action", "Drama", "Comedy", "Adventure", "Romantic"];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const userData = JSON.parse(atob(token.split(".")[1]));
        setIsLoggedIn(true);
        setUserRole(userData["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);
        localStorage.setItem("userId", userData.userId);
        fetchWatchlist();
        fetchFavourites(); 
      } catch (error) {
        console.error("Invalid token format:", error);
      }
    }
  }, []);

  useEffect(() => {
    fetchMovies(selectedGenre);
  }, [selectedGenre]);

  const fetchMovies = async (Genre: string) => {
    setLoading(true);
    setError(null);
    try {
      const url =
        Genre === "All"
          ? "http://localhost:5233/api/Movie"
          : `http://localhost:5233/api/Movie/genre?genre=${Genre}`;

      const response = await axios.get(url);
      setMovies(response.data);
    } catch (err) {
      setError("Failed to load movies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchWatchlist();
      fetchFavourites();
    }
  }, [movies, isLoggedIn]);
  const fetchWatchlist = async () => {
    if (isLoggedIn) {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const response = await axios.get(`http://localhost:5233/api/watchlist/${userId}`);
        if (response.data && Array.isArray(response.data)) {
          const movieIds = new Set(response.data.map((item: any) => item.MovieId));
          setWatchlist(movieIds);
        } else {
          console.error("Unexpected response structure", response.data);
        }
      } catch (error) {
        console.error("Failed to load watchlist", error);
      }
    }
  };

  const handleToggleWatchlist = async (movie: MovieModel) => {
    const userId = localStorage.getItem("userId");
  
    if (!userId) {
      alert("Please log in to manage your watchlist.");
      return;
    }
  
    if (!movie.Id) {
      alert("Invalid movie ID.");
      return;
    }
  
    const isInWatchlist = watchlist.has(movie.Id);
  
    try {
      if (isInWatchlist) {
        const response = await axios.delete(`http://localhost:5233/api/watchlist/${userId}/${movie.Id}`);
        if (response.status === 200) {
          setWatchlist((prev) => {
            const newWatchlist = new Set(prev);
            newWatchlist.delete(movie.Id);
            return newWatchlist;
          });
        }
      } else {
       // console.log("Adding to Watchlist:", { userId, MovieId: movie.Id });
  
        const requestBody = {
          UserId: userId,
          MovieId: movie.Id,
          MovieTitle: movie.Title,
          Genres: movie.Genres.map((genre) => ({
            Name: genre.Name, 
            CreatedAt: new Date().toISOString(), 
          })),
          MovieImage: movie.ImageUrl
        };
  
        const response = await axios.post(`http://localhost:5233/api/watchlist/${userId}`, requestBody);
  
        if (response.status === 200) {
          setWatchlist((prev) => new Set([...prev, movie.Id]));
        }
      }
    } catch (error: any) {
      console.error("Failed to update watchlist:", error);
      alert(`Failed to update watchlist. Error: ${error.message}`);
    }
  };

  const fetchFavourites = async () => {
    if (isLoggedIn) {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const response = await axios.get(`http://localhost:5233/api/favorites/${userId}`);
        if (response.data && Array.isArray(response.data)) {
          const movieIds = new Set(response.data.map((item: any) => item.MovieId));
          setFavourites(movieIds); 
        } else {
          console.error("Unexpected response structure", response.data);
        }
      } catch (error) {
        console.error("Failed to load favourites", error);
      }
    }
  };

  const handleToggleFavourite = async (movie: MovieModel) => {
    const userId = localStorage.getItem("userId");
  
    if (!userId) {
      alert("Please log in to manage your favourites.");
      return;
    }
  
    if (!movie.Id) {
      alert("Invalid movie ID.");
      return;
    }
  
    const isInFavourites = favourites.has(movie.Id);
  
    try {
      if (isInFavourites) {
        const response = await axios.delete(`http://localhost:5233/api/favorites/${userId}/${movie.Id}`);
        if (response.status === 200) {
          setFavourites((prev) => {
            const newFavourites = new Set(prev);
            newFavourites.delete(movie.Id);
            return newFavourites;
          });
        }
      } else {
       // console.log("Adding to Favourites:", { userId, MovieId: movie.Id });
  
        const requestBody = {
          UserId: userId,
          MovieId: movie.Id,
          MovieTitle: movie.Title,
          Genres: movie.Genres.map((genre) => ({
            Name: genre.Name, 
            CreatedAt: new Date().toISOString(), 
          })),
          MovieImage: movie.ImageUrl
        };
  
        const response = await axios.post(`http://localhost:5233/api/favorites/${userId}`, requestBody);
  
        if (response.status === 200) {
          setFavourites((prev) => new Set([...prev, movie.Id]));
        }
      }
    } catch (error: any) {
      console.error("Failed to update favourites:", error);
      alert(`Failed to update favourites. Error: ${error.message}`);
    }
  };

  const handleDeleteMovie = async (movieId: string) => {
    try {
      await axios.delete(`http://localhost:5233/api/Movie?movieId=${movieId}`);
      setMovies((prevMovies) => prevMovies.filter((movie) => movie.Id !== movieId));
    } catch (error) {
      console.error("Failed to delete movie:", error);
      alert("Failed to delete movie. Please try again.");
    }
  };

  const openMovieDetails = (movie: MovieModel) => {
    setSelectedMovie(movie);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedMovie(null);
  };

  const handleBookNow = (movie: MovieModel) => {
    if (!isLoggedIn) {
      alert("Please log in to book a movie.");
      navigate("/login");
      return;
    }
    navigate("/booking", { state: { movie } });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <MoviesContainer>
        <GenreButtonContainer>
          {Genres.map((Genre) => (
            <Button key={Genre} onClick={() => setSelectedGenre(Genre)} isSelected={selectedGenre === Genre}>
              {Genre}
            </Button>
          ))}
        </GenreButtonContainer>

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
          {movies.map((movie) => (
            <MovieCard key={movie.Id}>
              <MovieImage src={`data:image/jpeg;base64,${movie.ImageUrl}`} alt={movie.Title} onClick={() => openMovieDetails(movie)} />
              <MovieInfo>
                <MovieTitle onClick={() => openMovieDetails(movie)}>{movie.Title}</MovieTitle>
                <MovieGenre>{movie.Genres.map((Genre) => Genre.Name).join(", ")}</MovieGenre>
                {userRole === "Admin" ? (
                  <Button onClick={() => handleDeleteMovie(movie.Id)}>Remove</Button>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Button onClick={() => handleBookNow(movie)}>Book Now</Button>
                    <img
                      src={favourites.has(movie.Id) ? like : dislike}
                      alt={favourites.has(movie.Id) ? "Like" : "Dislike"}
                      onClick={() => handleToggleFavourite(movie)}
                      style={{ cursor: "pointer", width: "24px", height: "24px" }}
                    />
                    
                    <img
                      src={watchlist.has(movie.Id) ? save : unsave}
                      alt={watchlist.has(movie.Id) ? "Save" : "Unsave"}
                      onClick={() => handleToggleWatchlist(movie)}
                      style={{ cursor: "pointer", width: "24px", height: "24px" }}
                    />
                    
                  </div>
                )}
              </MovieInfo>
            </MovieCard>
          ))}
        </div>
      </MoviesContainer>

      {modalOpen && selectedMovie && (
        <ModalOverlay onClick={closeModal}>
          <MovieDetailsModal>
            <CloseButton onClick={closeModal}>X</CloseButton>
            <h2>{selectedMovie.Title}</h2>
            <MovieImage1 src={`data:image/jpeg;base64,${selectedMovie.ImageUrl}`} alt={selectedMovie.Title} />
            <MovieDescription>{selectedMovie.Description}</MovieDescription>
          </MovieDetailsModal>
        </ModalOverlay>
      )}
    </>
  );
};

export default MoviesPage;
