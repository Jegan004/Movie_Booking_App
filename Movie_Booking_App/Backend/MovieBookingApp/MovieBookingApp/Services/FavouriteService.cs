using MongoDB.Bson;
using MovieBookingApp.Model;
using MovieBookingApp.Repository;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MovieBookingApp.Services
{
    public class FavoriteService : IFavoriteService
    {
        private readonly IFavoriteRepository _favoriteRepository;
        private readonly IMovieService _movieService;

        public FavoriteService(IFavoriteRepository favoriteRepository, IMovieService movieService)
        {
            _favoriteRepository = favoriteRepository;
            _movieService = movieService;
        }

        public async Task<List<FavoriteModel>> GetFavoritesByUserIdAsync(string userId)
        {
            var favoriteItems = await _favoriteRepository.GetFavoritesByUserIdAsync(userId);

            foreach (var item in favoriteItems)
            {
                if (!ObjectId.TryParse(item.MovieId, out ObjectId movieObjectId))
                    continue;

                var movie = await _movieService.GetMovieByIdAsync(movieObjectId);
                if (movie != null)
                {
                    item.MovieTitle = movie.Title;
                    item.Genres = movie.Genres;
                    item.MovieImage = movie.ImageUrl;
                }
            }

            return favoriteItems;
        }

        public async Task<bool> AddToUserFavoritesAsync(string userId, string movieId)
        {
            if (!ObjectId.TryParse(userId, out ObjectId userObjectId) || !ObjectId.TryParse(movieId, out ObjectId movieObjectId))
                return false;

            var existingFavoriteItems = await _favoriteRepository.GetFavoritesByUserIdAsync(userId);

            if (existingFavoriteItems.Exists(f => f.MovieId == movieId))
            {
                return false; // Movie is already in the favorites
            }

            var movie = await _movieService.GetMovieByIdAsync(movieObjectId);
            if (movie == null)
            {
                return false; 
            }

            var newFavoriteItem = new FavoriteModel
            {
                UserId = userId,
                MovieId = movieId,
                MovieTitle = movie.Title,
                Genres = movie.Genres,
                MovieImage = movie.ImageUrl,
            };

            return await _favoriteRepository.AddToFavoritesAsync(newFavoriteItem);
        }

        public async Task<bool> RemoveFromFavoritesAsync(string userId, string movieId)
        {
            return await _favoriteRepository.RemoveFromUserFavoritesAsync(userId, movieId);
        }
    }
}
