using MongoDB.Bson;
using MovieBookingApp.Model;
using MovieBookingApp.Repository;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MovieBookingApp.Services
{
    public class WatchListService : IWatchListService
    {
        private readonly IWatchListRepository _watchListRepository;
        private readonly IMovieService _movieService;

        public WatchListService(IWatchListRepository watchListRepository, IMovieService movieService)
        {
            _watchListRepository = watchListRepository;
            _movieService = movieService;
        }

        public async Task<List<WatchListModel>> GetWatchListByUserIdAsync(string userId)
        {
            var watchlistItems = await _watchListRepository.GetWatchListByUserIdAsync(userId);

            foreach (var item in watchlistItems)
            {
                if (!ObjectId.TryParse(item.MovieId, out ObjectId movieObjectId))
                    continue; // Skip this item if MovieId is not valid

                var movie = await _movieService.GetMovieByIdAsync(movieObjectId);
                if (movie != null)
                {
                    item.MovieTitle = movie.Title;
                    item.Genres = movie.Genres;
                    item.MovieImage = movie.ImageUrl;
                }
            }

            return watchlistItems;
        }


        public async Task<bool> AddToUserWatchlistAsync(string userId, string movieId)
        {
            // Ensure UserId and MovieId are valid
            if (!ObjectId.TryParse(userId, out ObjectId userObjectId) || !ObjectId.TryParse(movieId, out ObjectId movieObjectId))
                return false;

            var existingWatchlistItems = await _watchListRepository.GetWatchListByUserIdAsync(userId);

            if (existingWatchlistItems.Exists(w => w.MovieId == movieId))
            {
                return false; // Movie is already in the watchlist
            }

            var movie = await _movieService.GetMovieByIdAsync(movieObjectId);
            if (movie == null)
            {
                return false; // Movie not found
            }

            var newWatchlistItem = new WatchListModel
            {
                UserId = userId,
                MovieId = movieId,
                MovieTitle = movie.Title,
                Genres = movie.Genres,
                MovieImage = movie.ImageUrl,
            };

            return await _watchListRepository.AddToWatchListAsync(newWatchlistItem);
        }


        public async Task<bool> RemoveFromWatchListAsync(string userId, string movieId)
        {
            return await _watchListRepository.RemoveFromUserWatchlistAsync(userId, movieId);
        }

    }
}
