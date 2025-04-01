using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using MovieBookingApp.Model;
using MovieBookingApp.Repository.Interfaces;
using MovieBookingApp.Services.Interfaces;

namespace MovieBookingApp.Services
{
    public class PlatformMetricsService : IPlatformMetricsService
    {
        private readonly IPlatformMetricsRepository _metricsRepository;
        private readonly IMongoCollection<UserModel> _users;
        private readonly IMongoCollection<MovieModel> _movies;

        public PlatformMetricsService(IPlatformMetricsRepository metricsRepository, IMongoDatabase database)
        {
            _metricsRepository = metricsRepository;
            _users = database.GetCollection<UserModel>("Users");
            _movies = database.GetCollection<MovieModel>("Movies");
        }
        public async Task<int> GetTotalUserCountAsync()
        {
            return await _metricsRepository.GetTotalUserCountAsync();
        }
        public async Task<List<object>> GetTopUsersByBookingsAsync()
        {
            var topUsers = await _metricsRepository.GetTopUsersByBookingsAsync();
            var userIds = topUsers.Select(x => x.UserId).ToList();
            var users = await _users.Find(user => userIds.Contains(user.Id.ToString()) && user.Role == "User").ToListAsync();

            return topUsers.Join(users,
                topUser => topUser.UserId,
                user => user.Id.ToString(),
                (topUser, user) => new
                {
                    UserId = user.Id.ToString(),
                    Name = user.Name,
                    Email = user.Email,
                    BookingCount = topUser.BookingCount
                })
                .Cast<object>()
                .ToList();
        }
        public async Task<List<object>> GetMostBookedMoviesAsync()
        {
            var mostBookedMovies = await _metricsRepository.GetMostBookedMoviesAsync();
            var movieIds = mostBookedMovies.Select(x => x.MovieId).ToList();
            var movies = await _movies.Find(movie => movieIds.Contains(movie.Id.ToString())).ToListAsync();

            return mostBookedMovies.Join(movies,
                movieBooking => movieBooking.MovieId,
                movie => movie.Id.ToString(),
                (movieBooking, movie) => new
                {
                    MovieId = movie.Id.ToString(),
                    Title = movie.Title,
                    BookingCount = movieBooking.BookingCount
                })
                .Cast<object>()
                .ToList();
        }
    }
}
